from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, Header, HTTPException, status
from pydantic import BaseModel, Field, model_validator

from app.core.config import settings
from app.repositories.chatlaya_pg import create_founder_project, update_founder_project_opencloud_workspace
from app.services.opencloud_client import ensure_founder_project_workspace


router = APIRouter()


class FounderProjectCreatePayload(BaseModel):
    user_id: str | None = None
    guest_id: str | None = None
    conversation_id: str | None = None
    title: str = "Projet Founder"
    current_step: str = "point_de_depart"
    project_data: dict[str, Any] = Field(default_factory=dict)

    @model_validator(mode="after")
    def validate_payload(self) -> FounderProjectCreatePayload:
        has_user = bool((self.user_id or "").strip())
        has_guest = bool((self.guest_id or "").strip())
        if has_user == has_guest:
            raise ValueError("Exactly one of user_id or guest_id is required")
        if not (self.title or "").strip():
            raise ValueError("title must not be empty")
        return self


def _require_internal_token(x_internal_token: str | None) -> None:
    expected = (settings.INTERNAL_API_TOKEN or "").strip()
    provided = (x_internal_token or "").strip()
    if not expected or not provided or provided != expected:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")


@router.post("/chatlaya/internal/founder-projects")
async def create_internal_founder_project(
    payload: FounderProjectCreatePayload,
    x_internal_token: str | None = Header(default=None, alias="X-Internal-Token"),
) -> dict[str, object]:
    _require_internal_token(x_internal_token)

    now = datetime.now(timezone.utc)
    project = await create_founder_project(
        user_id=(payload.user_id or "").strip() or None,
        guest_id=(payload.guest_id or "").strip() or None,
        conversation_id=(payload.conversation_id or "").strip() or None,
        title=payload.title.strip(),
        current_step=payload.current_step,
        project_data=payload.project_data,
        now=now,
    )

    opencloud = await ensure_founder_project_workspace(
        project_id=str(project.get("id") or ""),
        project_title=payload.title.strip(),
    )
    if not opencloud.get("ok"):
        return {
            "ok": False,
            "project": project,
            "opencloud": opencloud,
            "error": opencloud.get("error") or "OpenCloud workspace creation failed",
        }

    root_folder = str(opencloud.get("root_folder") or "ChatLAYA Founder")
    project_folder = str(opencloud.get("project_folder") or "").strip()
    opencloud_project_path = f"{root_folder}/{project_folder}" if project_folder else None
    updated_project = await update_founder_project_opencloud_workspace(
        project_id=str(project.get("id") or ""),
        user_id=(payload.user_id or "").strip() or None,
        guest_id=(payload.guest_id or "").strip() or None,
        opencloud_root_folder=root_folder,
        opencloud_project_folder=project_folder or None,
        opencloud_project_path=opencloud_project_path,
        opencloud_workspace=opencloud,
        synced_at=now,
    )
    if updated_project is None:
        return {
            "ok": False,
            "project": project,
            "opencloud": opencloud,
            "error": "Founder project OpenCloud sync update failed",
        }

    return {
        "ok": True,
        "project": updated_project,
        "opencloud": opencloud,
        "error": None,
    }

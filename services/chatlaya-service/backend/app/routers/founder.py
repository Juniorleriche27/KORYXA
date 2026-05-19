from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, Header, HTTPException, Query, status
from pydantic import BaseModel, Field, model_validator

from app.core.config import settings
from app.repositories.chatlaya_pg import (
    create_founder_project,
    get_founder_project,
    list_founder_projects,
    update_founder_project_data,
    update_founder_project_opencloud_workspace,
)
from app.services.opencloud_client import ensure_founder_project_workspace


router = APIRouter()
_FOUNDER_ALLOWED_STEPS = {
    "point_de_depart",
    "client_cible",
    "probleme",
    "offre_valeur",
    "prix",
    "business_model",
    "validation_preuves",
    "pitch_vente",
    "business_plan",
    "completed",
}
_FOUNDER_ALLOWED_STATUS = {
    "draft",
    "in_progress",
    "validated",
    "completed",
    "archived",
}


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


class FounderProjectUpdatePayload(BaseModel):
    title: str | None = None
    current_step: str | None = None
    status: str | None = None
    project_data: dict[str, Any] | None = None

    @model_validator(mode="after")
    def validate_payload(self) -> FounderProjectUpdatePayload:
        if (
            self.title is None
            and self.current_step is None
            and self.status is None
            and self.project_data is None
        ):
            raise ValueError("At least one field must be provided")
        if self.title is not None and not self.title.strip():
            raise ValueError("title must not be empty")
        if self.current_step is not None and self.current_step not in _FOUNDER_ALLOWED_STEPS:
            raise ValueError("current_step is invalid")
        if self.status is not None and self.status not in _FOUNDER_ALLOWED_STATUS:
            raise ValueError("status is invalid")
        return self


def _require_internal_token(x_internal_token: str | None) -> None:
    expected = (settings.INTERNAL_API_TOKEN or "").strip()
    provided = (x_internal_token or "").strip()
    if not expected or not provided or provided != expected:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")


def _validate_owner(user_id: str | None, guest_id: str | None) -> tuple[str | None, str | None]:
    clean_user_id = (user_id or "").strip() or None
    clean_guest_id = (guest_id or "").strip() or None
    if bool(clean_user_id) == bool(clean_guest_id):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Exactly one of user_id or guest_id is required",
        )
    return clean_user_id, clean_guest_id


@router.post("/chatlaya/internal/founder-projects")
async def create_internal_founder_project(
    payload: FounderProjectCreatePayload,
    x_internal_token: str | None = Header(default=None, alias="X-Internal-Token"),
) -> dict[str, object]:
    _require_internal_token(x_internal_token)
    user_id, guest_id = _validate_owner(payload.user_id, payload.guest_id)

    now = datetime.now(timezone.utc)
    project = await create_founder_project(
        user_id=user_id,
        guest_id=guest_id,
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
        user_id=user_id,
        guest_id=guest_id,
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


@router.get("/chatlaya/internal/founder-projects")
async def list_internal_founder_projects(
    user_id: str | None = None,
    guest_id: str | None = None,
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    x_internal_token: str | None = Header(default=None, alias="X-Internal-Token"),
) -> dict[str, object]:
    _require_internal_token(x_internal_token)
    user_id, guest_id = _validate_owner(user_id, guest_id)
    items = await list_founder_projects(
        user_id=user_id,
        guest_id=guest_id,
        limit=limit,
        offset=offset,
    )
    return {
        "ok": True,
        "items": items,
        "limit": limit,
        "offset": offset,
    }


@router.get("/chatlaya/internal/founder-projects/{project_id}")
async def get_internal_founder_project(
    project_id: str,
    user_id: str | None = None,
    guest_id: str | None = None,
    x_internal_token: str | None = Header(default=None, alias="X-Internal-Token"),
) -> dict[str, object]:
    _require_internal_token(x_internal_token)
    user_id, guest_id = _validate_owner(user_id, guest_id)
    project = await get_founder_project(
        project_id=project_id,
        user_id=user_id,
        guest_id=guest_id,
    )
    if project is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Founder project not found")
    return {
        "ok": True,
        "project": project,
    }


@router.patch("/chatlaya/internal/founder-projects/{project_id}")
async def patch_internal_founder_project(
    project_id: str,
    payload: FounderProjectUpdatePayload,
    user_id: str | None = None,
    guest_id: str | None = None,
    x_internal_token: str | None = Header(default=None, alias="X-Internal-Token"),
) -> dict[str, object]:
    _require_internal_token(x_internal_token)
    user_id, guest_id = _validate_owner(user_id, guest_id)
    project = await update_founder_project_data(
        project_id=project_id,
        user_id=user_id,
        guest_id=guest_id,
        title=payload.title.strip() if payload.title is not None else None,
        current_step=payload.current_step,
        status=payload.status,
        project_data=payload.project_data,
        updated_at=datetime.now(timezone.utc),
    )
    if project is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Founder project not found")
    return {
        "ok": True,
        "project": project,
    }

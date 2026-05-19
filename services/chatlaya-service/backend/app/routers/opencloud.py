from __future__ import annotations

from fastapi import APIRouter, Header, HTTPException, status

from app.core.config import settings
from app.services.opencloud_client import check_opencloud_reachability


router = APIRouter()


def _require_internal_token(x_internal_token: str | None) -> None:
    expected = (settings.INTERNAL_API_TOKEN or "").strip()
    provided = (x_internal_token or "").strip()
    if not expected or not provided or provided != expected:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")


@router.get("/chatlaya/internal/opencloud/health")
async def opencloud_health(
    x_internal_token: str | None = Header(default=None, alias="X-Internal-Token"),
) -> dict[str, object]:
    _require_internal_token(x_internal_token)
    return await check_opencloud_reachability()

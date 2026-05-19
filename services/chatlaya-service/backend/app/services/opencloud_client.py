from __future__ import annotations

from typing import Any

import httpx

from app.core.config import settings


class OpenCloudClientError(RuntimeError):
    pass


def _base_url() -> str:
    value = (settings.OPENCLOUD_BASE_URL or "").strip().rstrip("/")
    if not value:
        raise OpenCloudClientError("OPENCLOUD_BASE_URL is not configured")
    return value


def get_opencloud_auth() -> tuple[str, str] | None:
    username = (settings.OPENCLOUD_SERVICE_USERNAME or "").strip()
    token = (settings.OPENCLOUD_SERVICE_APP_TOKEN or "").strip()
    if not token:
        token = (settings.OPENCLOUD_SERVICE_PASSWORD or "").strip()
    if not username or not token:
        return None
    return username, token


async def check_opencloud_reachability() -> dict[str, Any]:
    enabled = bool(settings.OPENCLOUD_ENABLED)
    configured = bool((settings.OPENCLOUD_BASE_URL or "").strip())
    base_url = (settings.OPENCLOUD_BASE_URL or "").strip().rstrip("/") or None
    timeout = max(1.0, float(settings.OPENCLOUD_TIMEOUT_S or 8.0))
    verify_ssl = bool(settings.OPENCLOUD_VERIFY_SSL)

    result: dict[str, Any] = {
        "configured": configured,
        "enabled": enabled,
        "reachable": False,
        "status_code": None,
        "base_url": base_url,
        "error": None,
    }
    if not configured:
        result["error"] = "OPENCLOUD_BASE_URL is not configured"
        return result

    try:
        url = _base_url()
        async with httpx.AsyncClient(timeout=timeout, verify=verify_ssl) as client:
            response = await client.get(url)
        result["reachable"] = True
        result["status_code"] = response.status_code
        return result
    except OpenCloudClientError as exc:
        result["error"] = str(exc)
        return result
    except httpx.TimeoutException:
        result["error"] = "OpenCloud request timed out"
        return result
    except httpx.HTTPError as exc:
        result["error"] = f"OpenCloud request failed: {exc}"
        return result


async def check_opencloud_webdav_auth() -> dict[str, Any]:
    enabled = bool(settings.OPENCLOUD_ENABLED)
    configured = bool((settings.OPENCLOUD_BASE_URL or "").strip())
    base_url = (settings.OPENCLOUD_BASE_URL or "").strip().rstrip("/") or None
    timeout = max(1.0, float(settings.OPENCLOUD_TIMEOUT_S or 8.0))
    verify_ssl = bool(settings.OPENCLOUD_VERIFY_SSL)
    auth = get_opencloud_auth()

    result: dict[str, Any] = {
        "configured": configured,
        "enabled": enabled,
        "auth_configured": auth is not None,
        "webdav_auth_ok": False,
        "status_code": None,
        "base_url": base_url,
        "username": auth[0] if auth else None,
        "error": None,
    }
    if not configured:
        result["error"] = "OPENCLOUD_BASE_URL is not configured"
        return result
    if auth is None:
        result["error"] = "OpenCloud service auth is not configured"
        return result

    username, token = auth
    url = f"{_base_url()}/remote.php/dav/files/{username}/"
    try:
        async with httpx.AsyncClient(timeout=timeout, verify=verify_ssl) as client:
            response = await client.request(
                "PROPFIND",
                url,
                auth=(username, token),
                headers={"Depth": "0"},
            )
        result["status_code"] = response.status_code
        result["webdav_auth_ok"] = response.status_code == 207
        if not result["webdav_auth_ok"]:
            result["error"] = f"OpenCloud WebDAV auth failed [{response.status_code}]"
        return result
    except OpenCloudClientError as exc:
        result["error"] = str(exc)
        return result
    except httpx.TimeoutException:
        result["error"] = "OpenCloud WebDAV request timed out"
        return result
    except httpx.HTTPError as exc:
        result["error"] = f"OpenCloud WebDAV request failed: {exc}"
        return result

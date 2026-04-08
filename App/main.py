from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from starlette.types import ASGIApp, Receive, Scope, Send

from App.api.v1.api import api_router
from App.core.config import settings

app = FastAPI(title=settings.PROJECT_NAME)

FRONTEND_ORIGIN = "https://attendance-management-system-zzpz.vercel.app"

class ApiOnlyCORSMiddleware:
    def __init__(self, app: ASGIApp) -> None:
        self.app = app
        self.cors_app = CORSMiddleware(
            app,
            allow_origins=[FRONTEND_ORIGIN],
            allow_credentials=False,
            allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allow_headers=["Content-Type", "Authorization"],
        )

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] == "http" and scope.get("path", "").startswith("/api/"):
            await self.cors_app(scope, receive, send)
            return
        await self.app(scope, receive, send)


# CORS for /api/* (preflight OPTIONS handled by middleware)
app.add_middleware(ApiOnlyCORSMiddleware)

@app.get("/health")
def health() -> dict[str, str]:
	return {"status": "ok"}


app.include_router(api_router, prefix="/api/v1")

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from App.api.v1.api import api_router
from App.core.config import settings

app = FastAPI(title=settings.PROJECT_NAME)

raw_origins = os.getenv(
	"CORS_ALLOW_ORIGINS",
	"http://localhost:5173,http://localhost:3000",
)
allow_origins = [origin.strip() for origin in raw_origins.split(",") if origin.strip()]

# Supports Vercel preview URLs like:
# https://attendance-management-system-<hash>-<user>.vercel.app
allow_origin_regex = os.getenv(
	"CORS_ALLOW_ORIGIN_REGEX",
	r"https://attendance-management-system-.*\.vercel\.app",
)

# Browsers reject wildcard origin with credentials enabled.
allow_credentials = "*" not in allow_origins

app.add_middleware(
	CORSMiddleware,
	allow_origins=allow_origins,
	allow_origin_regex=allow_origin_regex,
	allow_credentials=allow_credentials,
	allow_methods=["*"],
	allow_headers=["*"],
)

@app.get("/health")
def health() -> dict[str, str]:
	return {"status": "ok"}


app.include_router(api_router, prefix="/api/v1")

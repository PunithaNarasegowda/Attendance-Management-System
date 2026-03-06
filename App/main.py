import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from App.api.v1.api import api_router
from App.core.config import settings

app = FastAPI(title=settings.PROJECT_NAME)


# Browsers reject wildcard origin with credentials enabled.
allow_credentials = "*"

app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],
	allow_credentials=allow_credentials,
	allow_methods=["*"],
	allow_headers=["*"],
)

@app.get("/health")
def health() -> dict[str, str]:
	return {"status": "ok"}


app.include_router(api_router, prefix="/api/v1")

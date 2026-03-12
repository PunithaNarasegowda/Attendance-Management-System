from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from App.api.v1.api import api_router
from App.core.config import settings

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
	CORSMiddleware,
	allow_origins=["https://attendance-management-system-zzpz.vercel.app"],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

@app.get("/health")
def health() -> dict[str, str]:
	return {"status": "ok"}


app.include_router(api_router, prefix="/api/v1")

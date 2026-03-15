from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from App.api.v1.api import api_router
from App.core.config import settings

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
	CORSMiddleware,
<<<<<<< HEAD
	allow_origins=[
		"http://localhost:5173",
		"http://127.0.0.1:5173",
		"http://localhost:4173",
		"http://127.0.0.1:4173",
		"http://localhost:3000",
		"http://127.0.0.1:3000",
	],
	allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?$",
=======
	allow_origins=["https://attendance-management-system-zzpz.vercel.app"],
    # allow_origins=["*"],
>>>>>>> fadd85edaba66373918efe3dffe48cddb0fd7f67
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

@app.get("/health")
def health() -> dict[str, str]:
	return {"status": "ok"}


app.include_router(api_router, prefix="/api/v1")

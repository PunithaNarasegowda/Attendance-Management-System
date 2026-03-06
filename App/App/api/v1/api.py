from fastapi import APIRouter

from App.api.v1 import admin, attendance, auth, compat, students

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(compat.router)
api_router.include_router(admin.router)
api_router.include_router(attendance.router)
api_router.include_router(students.router, prefix="/students", tags=["Students"])

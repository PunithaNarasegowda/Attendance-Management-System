import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()
class Settings(BaseSettings):
    PROJECT_NAME: str = "Attendance Management System"
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret-key")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
<<<<<<< HEAD
    # CA_CERT_BASE64: str = os.getenv("CA_CERT_BASE64", "")
=======
    CA_CERT_BASE64: str = os.getenv("CA_CERT_BASE64", "")
>>>>>>> fadd85edaba66373918efe3dffe48cddb0fd7f67
    class Config:
        case_sensitive = True
settings = Settings()
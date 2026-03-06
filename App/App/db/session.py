from collections.abc import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from App.core.config import settings 

if not settings.DATABASE_URL:
    raise ValueError("DATABASE_URL is required. Configure MySQL connection in .env.")

engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True, echo=False)


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine) 

def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db 
    finally:
        db.close()
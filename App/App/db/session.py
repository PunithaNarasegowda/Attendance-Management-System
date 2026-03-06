from collections.abc import Generator
import os
import tempfile

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from App.core.config import settings

if not settings.DATABASE_URL:
    raise ValueError("DATABASE_URL is required. Configure MySQL connection in .env.")

ca_cert_content = os.getenv("MYSQL_CA_CERT")
ca_file_env_path = os.getenv("MYSQL_SSL_CA_PATH")
default_ca_path = "./ca.pem"

ca_path = None
if ca_cert_content:
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pem") as temp_ca:
        temp_ca.write(ca_cert_content.encode("utf-8"))
        ca_path = temp_ca.name
elif ca_file_env_path and os.path.exists(ca_file_env_path):
    ca_path = ca_file_env_path
elif os.path.exists(default_ca_path):
    ca_path = default_ca_path

connect_args = {"ssl": {"ca": ca_path}} if ca_path else {}

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True,
    echo=False,
)


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
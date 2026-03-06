from collections.abc import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from App.core.config import settings 
import os
import tempfile

if not settings.DATABASE_URL:
    raise ValueError("DATABASE_URL is required. Configure MySQL connection in .env.")

ca_cert_content = os.getenv("MYSQL_CA_CERT")

# 2. Create a temporary file to hold the cert during runtime
if ca_cert_content:
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pem") as temp_ca:
        temp_ca.write(ca_cert_content.encode("utf-8"))
        ca_path = temp_ca.name
else:
    # Fallback for local dev if file exists
    ca_path = "./ca.pem"

# 3. Update the Connection String with the dynamic path
# Note: Using 'ssl_ca' parameter for the pymysql driver
connect_args = {
    "ssl": {
        "ca": ca_path
    }
}

engine = create_engine(settings.DATABASE_URL,
                       connect_args=connect_args,
                       pool_pre_ping=True,
                       echo=False)


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine) 

def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db 
    finally:
        db.close()
import base64
import hashlib
import hmac
import json
import time

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import text
from sqlalchemy.orm import Session

from App.core.config import settings
from App.core.security import hash_password, verify_password
from App.db.session import get_db

router = APIRouter()


def _base64url(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode("utf-8").rstrip("=")


def _create_access_token(subject: str, email: str, role: str, expires_in_seconds: int = 3600) -> str:
    header = {"alg": "HS256", "typ": "JWT"}
    payload = {
        "sub": subject,
        "email": email,
        "role": role,
        "exp": int(time.time()) + expires_in_seconds,
    }

    header_b64 = _base64url(json.dumps(header, separators=(",", ":")).encode("utf-8"))
    payload_b64 = _base64url(json.dumps(payload, separators=(",", ":")).encode("utf-8"))
    signing_input = f"{header_b64}.{payload_b64}".encode("utf-8")
    signature = hmac.new(settings.SECRET_KEY.encode("utf-8"), signing_input, hashlib.sha256).digest()
    return f"{header_b64}.{payload_b64}.{_base64url(signature)}"


def _ensure_admin_table(db: Session) -> None:
    db.execute(
        text(
            """
            CREATE TABLE IF NOT EXISTS admin_users (
                admin_id VARCHAR(36) PRIMARY KEY,
                name VARCHAR(120) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                is_active BOOLEAN NOT NULL DEFAULT TRUE,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
    )
    db.commit()


def _table_exists(db: Session, table_name: str) -> bool:
    row = db.execute(
        text(
            """
            SELECT 1
            FROM information_schema.tables
            WHERE table_schema = DATABASE() AND table_name = :table_name
            LIMIT 1
            """
        ),
        {"table_name": table_name},
    ).first()
    return row is not None


def _column_exists(db: Session, table_name: str, column_name: str) -> bool:
    row = db.execute(
        text(
            """
            SELECT 1
            FROM information_schema.columns
            WHERE table_schema = DATABASE() AND table_name = :table_name AND column_name = :column_name
            LIMIT 1
            """
        ),
        {"table_name": table_name, "column_name": column_name},
    ).first()
    return row is not None


def _ensure_faculty_student_auth_columns(db: Session) -> None:
    if _table_exists(db, "faculty"):
        if not _column_exists(db, "faculty", "email"):
            db.execute(text("ALTER TABLE faculty ADD COLUMN email VARCHAR(255) NULL"))
        if not _column_exists(db, "faculty", "password_hash"):
            db.execute(text("ALTER TABLE faculty ADD COLUMN password_hash VARCHAR(255) NULL"))
        if not _column_exists(db, "faculty", "is_active"):
            db.execute(text("ALTER TABLE faculty ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE"))

    if _table_exists(db, "student"):
        if not _column_exists(db, "student", "email"):
            db.execute(text("ALTER TABLE student ADD COLUMN email VARCHAR(255) NULL"))
        if not _column_exists(db, "student", "password_hash"):
            db.execute(text("ALTER TABLE student ADD COLUMN password_hash VARCHAR(255) NULL"))
        if not _column_exists(db, "student", "is_active"):
            db.execute(text("ALTER TABLE student ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE"))

    if _table_exists(db, "faculty") and _column_exists(db, "faculty", "email"):
        db.execute(
            text(
                """
                UPDATE faculty
                SET email = CONCAT(LOWER(faculty_id), '@nithams.local')
                WHERE email IS NULL OR TRIM(email) = ''
                """
            )
        )

    if _table_exists(db, "faculty") and _column_exists(db, "faculty", "password_hash"):
        db.execute(
            text(
                """
                UPDATE faculty
                SET password_hash = LOWER(SHA2(CONCAT('Fac@', faculty_id), 256))
                WHERE password_hash IS NULL OR TRIM(password_hash) = ''
                """
            )
        )

    if _table_exists(db, "student") and _column_exists(db, "student", "email"):
        db.execute(
            text(
                """
                UPDATE student
                SET email = CONCAT(LOWER(roll_no), '@nithams.local')
                WHERE email IS NULL OR TRIM(email) = ''
                """
            )
        )

    if _table_exists(db, "student") and _column_exists(db, "student", "password_hash"):
        db.execute(
            text(
                """
                UPDATE student
                SET password_hash = LOWER(SHA2(CONCAT('Stu@', roll_no), 256))
                WHERE password_hash IS NULL OR TRIM(password_hash) = ''
                """
            )
        )

    db.commit()


def _get_admin_by_email(db: Session, email: str) -> dict | None:
    if not _table_exists(db, "admin_users"):
        return None
    row = db.execute(
        text(
            """
            SELECT admin_id, name, email, password_hash, is_active
            FROM admin_users
            WHERE LOWER(email) = LOWER(:email)
            LIMIT 1
            """
        ),
        {"email": email},
    ).mappings().first()
    return dict(row) if row else None


def _get_faculty_by_email(db: Session, email: str) -> dict | None:
    if not _table_exists(db, "faculty"):
        return None
    required_columns = ("faculty_id", "name", "email", "password_hash", "is_active")
    if any(not _column_exists(db, "faculty", col) for col in required_columns):
        return None
    row = db.execute(
        text(
            """
            SELECT faculty_id AS user_id, name, email, password_hash, is_active
            FROM faculty
            WHERE LOWER(email) = LOWER(:email)
            LIMIT 1
            """
        ),
        {"email": email},
    ).mappings().first()
    return dict(row) if row else None


def _get_student_by_email(db: Session, email: str) -> dict | None:
    if not _table_exists(db, "student"):
        return None
    required_columns = ("roll_no", "name", "email", "password_hash", "is_active")
    if any(not _column_exists(db, "student", col) for col in required_columns):
        return None
    row = db.execute(
        text(
            """
            SELECT roll_no AS user_id, name, email, password_hash, is_active
            FROM student
            WHERE LOWER(email) = LOWER(:email)
            LIMIT 1
            """
        ),
        {"email": email},
    ).mappings().first()
    return dict(row) if row else None


@router.post("/login")
def login(payload: dict, db: Session = Depends(get_db)):
    email = (payload.get("email") or "").strip()
    password = payload.get("password")

    if not email or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email and password are required",
        )

    # In production, DB users may not have CREATE/ALTER privileges.
    # Treat these schema bootstrap steps as best-effort so login can still work
    # against already-initialized schemas.
    try:
        _ensure_admin_table(db)
    except Exception:
        db.rollback()

    try:
        _ensure_faculty_student_auth_columns(db)
    except Exception:
        db.rollback()

    admin = _get_admin_by_email(db, email)
    if admin and admin.get("is_active") and verify_password(password, admin["password_hash"]):
        user = {
            "id": admin["admin_id"],
            "name": admin["name"],
            "email": admin["email"],
            "role": "admin",
        }
        token = _create_access_token(subject=str(admin["admin_id"]), email=admin["email"], role="admin")
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": user,
        }

    faculty = _get_faculty_by_email(db, email)
    if faculty and faculty.get("is_active") and verify_password(password, faculty["password_hash"]):
        user = {
            "id": faculty["user_id"],
            "name": faculty["name"],
            "email": faculty["email"],
            "role": "faculty",
        }
        token = _create_access_token(subject=str(faculty["user_id"]), email=faculty["email"], role="faculty")
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": user,
        }

    student = _get_student_by_email(db, email)
    if student and student.get("is_active") and verify_password(password, student["password_hash"]):
        user = {
            "id": student["user_id"],
            "name": student["name"],
            "email": student["email"],
            "role": "student",
        }
        token = _create_access_token(subject=str(student["user_id"]), email=student["email"], role="student")
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": user,
        }

    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")


@router.post("/refresh")
def refresh(payload: dict):
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Refresh token flow is not enabled",
    )


@router.post("/change-password")
def change_password(payload: dict, db: Session = Depends(get_db)):
    email = (payload.get("email") or "").strip()
    old_password = payload.get("oldPassword")
    new_password = payload.get("newPassword")

    if not email or not old_password or not new_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="email, oldPassword and newPassword are required",
        )

    admin = _get_admin_by_email(db, email)
    if not admin or not verify_password(old_password, admin["password_hash"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    db.execute(
        text("UPDATE admin_users SET password_hash = :password_hash WHERE admin_id = :admin_id"),
        {
            "password_hash": hash_password(new_password),
            "admin_id": admin["admin_id"],
        },
    )
    db.commit()

    return {"status": "success", "message": "Password changed successfully"}

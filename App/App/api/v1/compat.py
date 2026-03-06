from datetime import date

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy import text
from sqlalchemy.orm import Session

from App.core.security import hash_password
from App.db.session import get_db
from App.schemas.responses import APIResponse

router = APIRouter(prefix="/compat", tags=["Compat"])


def _rows(result) -> list[dict]:
    return [dict(row) for row in result.mappings().all()]


def _next_attendance_id(db: Session) -> str:
    max_num = db.execute(
        text(
            """
            SELECT COALESCE(MAX(CAST(SUBSTRING(attendance_id, 4) AS UNSIGNED)), 0)
            FROM attendance
            WHERE attendance_id LIKE 'ATT%'
            """
        )
    ).scalar() or 0
    return f"ATT{int(max_num) + 1:07d}"


def _next_lecture_id(db: Session) -> int:
    max_id = db.execute(text("SELECT COALESCE(MAX(lecture_id), 0) FROM lecture")).scalar() or 0
    return int(max_id) + 1


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


def _ensure_user_auth_columns(db: Session) -> None:
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


def _ensure_enrollment_section_column(db: Session) -> None:
    if not _table_exists(db, "enrolls"):
        return

    if not _column_exists(db, "enrolls", "section_name"):
        db.execute(text("ALTER TABLE enrolls ADD COLUMN section_name VARCHAR(10) NULL"))

    db.execute(
        text(
            """
            UPDATE enrolls e
            SET e.section_name = COALESCE(
                (SELECT MIN(s.section_name) FROM section s),
                e.section_name
            )
            WHERE e.section_name IS NULL OR TRIM(e.section_name) = ''
            """
        )
    )
    db.commit()


def _ensure_course_section_table(db: Session) -> None:
    db.execute(
        text(
            """
            CREATE TABLE IF NOT EXISTS course_section (
                course_id VARCHAR(6) NOT NULL,
                section_name VARCHAR(10) NOT NULL,
                PRIMARY KEY (course_id, section_name),
                CONSTRAINT fk_course_section_course
                    FOREIGN KEY (course_id) REFERENCES course(course_id)
                    ON DELETE CASCADE,
                CONSTRAINT fk_course_section_section
                    FOREIGN KEY (section_name) REFERENCES section(section_name)
                    ON DELETE CASCADE
            )
            """
        )
    )

    # Backfill mappings from current live usage.
    db.execute(
        text(
            """
            INSERT IGNORE INTO course_section (course_id, section_name)
            SELECT DISTINCT e.course_id, e.section_name
            FROM enrolls e
            WHERE e.course_id IS NOT NULL
              AND e.section_name IS NOT NULL
              AND TRIM(e.section_name) <> ''
            """
        )
    )
    db.execute(
        text(
            """
            INSERT IGNORE INTO course_section (course_id, section_name)
            SELECT DISTINCT l.course_id, l.section_name
            FROM lecture l
            WHERE l.course_id IS NOT NULL
              AND l.section_name IS NOT NULL
              AND TRIM(l.section_name) <> ''
            """
        )
    )
    db.commit()


@router.get("/courses", response_model=APIResponse)
def list_courses(db: Session = Depends(get_db)):
    rows = _rows(db.execute(text("SELECT course_id, course_name FROM course ORDER BY course_id")))
    return APIResponse(message="Courses fetched", data=rows)


@router.post("/courses", response_model=APIResponse, status_code=status.HTTP_201_CREATED)
def create_course(payload: dict, db: Session = Depends(get_db)):
    course_id = payload.get("course_id")
    course_name = payload.get("course_name")
    if not course_id or not course_name:
        raise HTTPException(status_code=400, detail="course_id and course_name are required")

    db.execute(
        text("INSERT INTO course (course_id, course_name) VALUES (:course_id, :course_name)"),
        {"course_id": course_id, "course_name": course_name},
    )
    db.commit()
    return APIResponse(message="Course created", data={"course_id": course_id, "course_name": course_name})


@router.put("/courses/{course_id}", response_model=APIResponse)
def update_course(course_id: str, payload: dict, db: Session = Depends(get_db)):
    course_name = payload.get("course_name")
    if not course_name:
        raise HTTPException(status_code=400, detail="course_name is required")

    result = db.execute(
        text("UPDATE course SET course_name = :course_name WHERE course_id = :course_id"),
        {"course_id": course_id, "course_name": course_name},
    )
    db.commit()
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Course not found")
    return APIResponse(message="Course updated", data={"course_id": course_id, "course_name": course_name})


@router.delete("/courses/{course_id}", response_model=APIResponse)
def delete_course(course_id: str, db: Session = Depends(get_db)):
    result = db.execute(text("DELETE FROM course WHERE course_id = :course_id"), {"course_id": course_id})
    db.commit()
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Course not found")
    return APIResponse(message="Course deleted", data={"course_id": course_id})


@router.get("/courses/{course_id}/sections", response_model=APIResponse)
def list_sections_by_course(course_id: str, db: Session = Depends(get_db)):
    _ensure_enrollment_section_column(db)
    _ensure_course_section_table(db)
    rows = _rows(
        db.execute(
            text(
                """
                SELECT
                    cs.section_name AS section_id,
                    (
                        SELECT COUNT(*)
                        FROM enrolls e
                        WHERE e.course_id = :course_id
                          AND e.section_name = cs.section_name
                    ) AS student_count,
                    (
                        SELECT COUNT(*)
                        FROM lecture l
                        WHERE l.course_id = :course_id
                          AND l.section_name = cs.section_name
                    ) AS lecture_count
                FROM course_section cs
                WHERE cs.course_id = :course_id
                ORDER BY cs.section_name
                """
            ),
            {"course_id": course_id},
        )
    )
    return APIResponse(message="Sections fetched", data=rows)


@router.get("/sections", response_model=APIResponse)
def list_sections(db: Session = Depends(get_db)):
    _ensure_enrollment_section_column(db)
    _ensure_course_section_table(db)
    rows = _rows(
        db.execute(
            text(
                """
                SELECT
                    s.section_name AS section_id,
                    (
                        SELECT COUNT(*)
                        FROM enrolls e
                        WHERE e.section_name = s.section_name
                    ) AS student_count,
                    (
                        SELECT COUNT(*)
                        FROM lecture l
                        WHERE l.section_name = s.section_name
                    ) AS lecture_count
                FROM section s
                ORDER BY s.section_name
                """
            )
        )
    )
    return APIResponse(message="Sections fetched", data=rows)


@router.get("/course-sections", response_model=APIResponse)
def list_course_section_mappings(db: Session = Depends(get_db)):
    _ensure_course_section_table(db)
    rows = _rows(
        db.execute(
            text(
                """
                SELECT
                    cs.course_id,
                    c.course_name,
                    cs.section_name AS section_id,
                    (
                        SELECT COUNT(*)
                        FROM enrolls e
                        WHERE e.course_id = cs.course_id
                          AND e.section_name = cs.section_name
                    ) AS student_count,
                    (
                        SELECT COUNT(*)
                        FROM lecture l
                        WHERE l.course_id = cs.course_id
                          AND l.section_name = cs.section_name
                    ) AS lecture_count
                FROM course_section cs
                JOIN course c ON c.course_id = cs.course_id
                ORDER BY cs.course_id, cs.section_name
                """
            )
        )
    )
    return APIResponse(message="Course-section mappings fetched", data=rows)


@router.post("/course-sections", response_model=APIResponse, status_code=status.HTTP_201_CREATED)
def create_course_section_mapping(payload: dict, db: Session = Depends(get_db)):
    _ensure_course_section_table(db)
    course_id = payload.get("course_id")
    section_id = payload.get("section_id")
    if not course_id or not section_id:
        raise HTTPException(status_code=400, detail="course_id and section_id are required")

    try:
        db.execute(
            text(
                """
                INSERT INTO course_section (course_id, section_name)
                VALUES (:course_id, :section_id)
                """
            ),
            {"course_id": course_id, "section_id": section_id},
        )
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=409, detail="Mapping already exists or references invalid course/section") from exc

    return APIResponse(
        message="Course-section mapping created",
        data={"course_id": course_id, "section_id": section_id},
    )


@router.delete("/course-sections/{course_id}/{section_id}", response_model=APIResponse)
def delete_course_section_mapping(course_id: str, section_id: str, db: Session = Depends(get_db)):
    _ensure_course_section_table(db)
    in_use = db.execute(
        text(
            """
            SELECT
                (
                    SELECT COUNT(*)
                    FROM lecture l
                    WHERE l.course_id = :course_id
                      AND l.section_name = :section_id
                )
                +
                (
                    SELECT COUNT(*)
                    FROM enrolls e
                    WHERE e.course_id = :course_id
                      AND e.section_name = :section_id
                ) AS usage_count
            """
        ),
        {"course_id": course_id, "section_id": section_id},
    ).scalar() or 0

    if int(in_use) > 0:
        raise HTTPException(
            status_code=409,
            detail="Cannot delete mapping that is used by enrollments or lectures",
        )

    result = db.execute(
        text(
            """
            DELETE FROM course_section
            WHERE course_id = :course_id AND section_name = :section_id
            """
        ),
        {"course_id": course_id, "section_id": section_id},
    )
    db.commit()
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Course-section mapping not found")

    return APIResponse(
        message="Course-section mapping deleted",
        data={"course_id": course_id, "section_id": section_id},
    )


@router.post("/sections", response_model=APIResponse, status_code=status.HTTP_201_CREATED)
def create_section(payload: dict, db: Session = Depends(get_db)):
    section_id = payload.get("section_id")
    if not section_id:
        raise HTTPException(status_code=400, detail="section_id is required")

    try:
        db.execute(
            text(
                """
                INSERT INTO section (section_name)
                VALUES (:section_id)
                """
            ),
            {"section_id": section_id},
        )
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=409, detail="Section already exists") from exc

    return APIResponse(message="Section created", data={"section_id": section_id})


@router.delete("/sections/{section_id}", response_model=APIResponse)
def delete_section(section_id: str, db: Session = Depends(get_db)):
    _ensure_enrollment_section_column(db)
    _ensure_course_section_table(db)

    enrolled_count = db.execute(
        text(
            """
            SELECT COUNT(*)
            FROM enrolls
            WHERE section_name = :section_id
            """
        ),
        {"section_id": section_id},
    ).scalar() or 0
    if enrolled_count > 0:
        raise HTTPException(status_code=409, detail="Cannot delete section with assigned students")

    lecture_count = db.execute(
        text(
            """
            SELECT COUNT(*)
            FROM lecture
            WHERE section_name = :section_id
            """
        ),
        {"section_id": section_id},
    ).scalar() or 0
    if lecture_count > 0:
        raise HTTPException(status_code=409, detail="Cannot delete section with assigned lectures")

    mapped_count = db.execute(
        text(
            """
            SELECT COUNT(*)
            FROM course_section
            WHERE section_name = :section_id
            """
        ),
        {"section_id": section_id},
    ).scalar() or 0
    if mapped_count > 0:
        raise HTTPException(status_code=409, detail="Cannot delete section mapped to courses")

    result = db.execute(
        text(
            """
            DELETE FROM section
                        WHERE section_name = :section_id
            """
        ),
                {"section_id": section_id},
    )
    db.commit()
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Section not found")

    return APIResponse(message="Section deleted", data={"section_id": section_id})


@router.get("/faculty", response_model=APIResponse)
def list_faculty(db: Session = Depends(get_db)):
    _ensure_user_auth_columns(db)
    rows = _rows(db.execute(text("SELECT faculty_id, name, email, department FROM faculty ORDER BY faculty_id")))
    return APIResponse(message="Faculty fetched", data=rows)


@router.post("/faculty", response_model=APIResponse, status_code=status.HTTP_201_CREATED)
def create_faculty(payload: dict, db: Session = Depends(get_db)):
    _ensure_user_auth_columns(db)
    faculty_id = payload.get("faculty_id")
    name = payload.get("name")
    email = (payload.get("email") or f"{str(faculty_id).lower()}@nithams.local").strip().lower() if faculty_id else None
    department = payload.get("department")
    raw_password = payload.get("password") or f"Fac@{faculty_id}"
    if not faculty_id or not name:
        raise HTTPException(status_code=400, detail="faculty_id and name are required")

    try:
        db.execute(
            text(
                """
                INSERT INTO faculty (faculty_id, name, email, department, password_hash)
                VALUES (:faculty_id, :name, :email, :department, :password_hash)
                """
            ),
            {
                "faculty_id": faculty_id,
                "name": name,
                "email": email,
                "department": department,
                "password_hash": hash_password(raw_password),
            },
        )
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=409, detail="Faculty ID or email already exists") from exc

    return APIResponse(
        message="Faculty created",
        data={
            "faculty_id": faculty_id,
            "name": name,
            "email": email,
            "department": department,
            "login_email": email,
            "temporary_password": raw_password,
            "role": "faculty",
        },
    )


@router.put("/faculty/{faculty_id}", response_model=APIResponse)
def update_faculty(faculty_id: str, payload: dict, db: Session = Depends(get_db)):
    result = db.execute(
        text(
            """
            UPDATE faculty
            SET name = :name, email = :email, department = :department
            WHERE faculty_id = :faculty_id
            """
        ),
        {
            "faculty_id": faculty_id,
            "name": payload.get("name"),
            "email": payload.get("email"),
            "department": payload.get("department"),
        },
    )
    db.commit()
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Faculty not found")
    return APIResponse(message="Faculty updated", data={"faculty_id": faculty_id, **payload})


@router.delete("/faculty/{faculty_id}", response_model=APIResponse)
def delete_faculty(faculty_id: str, db: Session = Depends(get_db)):
    try:
        existing = db.execute(
            text("SELECT 1 FROM faculty WHERE faculty_id = :faculty_id LIMIT 1"),
            {"faculty_id": faculty_id},
        ).first()
        if not existing:
            db.rollback()
            raise HTTPException(status_code=404, detail="Faculty not found")

        # Remove dependent lecture/attendance rows so FK constraints do not block delete.
        db.execute(
            text(
                """
                DELETE a
                FROM attendance a
                JOIN lecture l ON l.lecture_id = a.lecture_id
                WHERE l.faculty_id = :faculty_id
                """
            ),
            {"faculty_id": faculty_id},
        )
        db.execute(text("DELETE FROM lecture WHERE faculty_id = :faculty_id"), {"faculty_id": faculty_id})
        db.execute(text("DELETE FROM faculty WHERE faculty_id = :faculty_id"), {"faculty_id": faculty_id})
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=409, detail="Cannot delete faculty due to related records") from exc

    return APIResponse(message="Faculty deleted", data={"faculty_id": faculty_id})


@router.get("/faculty/{faculty_id}/courses", response_model=APIResponse)
def faculty_courses(faculty_id: str, db: Session = Depends(get_db)):
    _ensure_enrollment_section_column(db)
    rows = _rows(
        db.execute(
            text(
                """
                SELECT
                    l.course_id,
                    c.course_name,
                    l.section_name AS section_id,
                    COALESCE(
                        (
                            SELECT MAX(s.batch_year)
                            FROM student s
                            JOIN enrolls e ON e.roll_no = s.roll_no
                            WHERE e.course_id = l.course_id
                              AND e.section_name = l.section_name
                        ),
                        'Unknown'
                    ) AS batch_year,
                    (
                        SELECT COUNT(*)
                        FROM enrolls e
                        WHERE e.course_id = l.course_id
                          AND e.section_name = l.section_name
                    ) AS student_count,
                    COUNT(*) AS lecture_count
                FROM lecture l
                JOIN course c ON c.course_id = l.course_id
                WHERE l.faculty_id = :faculty_id
                GROUP BY l.course_id, c.course_name, l.section_name
                ORDER BY l.course_id, l.section_name
                """
            ),
            {"faculty_id": faculty_id},
        )
    )
    return APIResponse(message="Faculty courses fetched", data=rows)


@router.post("/faculty/{faculty_id}/assign", response_model=APIResponse, status_code=status.HTTP_201_CREATED)
def assign_faculty_to_course(faculty_id: str, payload: dict, db: Session = Depends(get_db)):
    _ensure_course_section_table(db)
    course_id = payload.get("course_id")
    section_id = payload.get("section_id")
    if not course_id or not section_id:
        raise HTTPException(status_code=400, detail="course_id and section_id are required")

    faculty_exists = db.execute(
        text("SELECT 1 FROM faculty WHERE faculty_id = :faculty_id LIMIT 1"),
        {"faculty_id": faculty_id},
    ).first()
    if not faculty_exists:
        raise HTTPException(status_code=404, detail="Faculty not found")

    course_exists = db.execute(
        text("SELECT 1 FROM course WHERE course_id = :course_id LIMIT 1"),
        {"course_id": course_id},
    ).first()
    if not course_exists:
        raise HTTPException(status_code=404, detail="Course not found")

    section_exists = db.execute(
        text(
            """
            SELECT 1
            FROM section
            WHERE section_name = :section_id
            LIMIT 1
            """
        ),
        {"section_id": section_id},
    ).first()
    if not section_exists:
        raise HTTPException(status_code=404, detail="Section not found")

    mapping_exists = db.execute(
        text(
            """
            SELECT 1
            FROM course_section
            WHERE course_id = :course_id AND section_name = :section_id
            LIMIT 1
            """
        ),
        {"course_id": course_id, "section_id": section_id},
    ).first()
    if not mapping_exists:
        raise HTTPException(status_code=409, detail="Section is not mapped to this course")

    existing = db.execute(
        text(
            """
            SELECT 1
            FROM lecture
            WHERE faculty_id = :faculty_id
              AND course_id = :course_id
              AND section_name = :section_id
            LIMIT 1
            """
        ),
        {"faculty_id": faculty_id, "course_id": course_id, "section_id": section_id},
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="Faculty is already assigned to this course and section")

    lecture_id = _next_lecture_id(db)
    try:
        db.execute(
            text(
                """
                INSERT INTO lecture (lecture_id, lecture_date, status, course_id, section_name, faculty_id)
                VALUES (:lecture_id, :lecture_date, :status, :course_id, :section_id, :faculty_id)
                """
            ),
            {
                "lecture_id": lecture_id,
                "lecture_date": str(date.today()),
                "status": "scheduled",
                "course_id": course_id,
                "section_id": section_id,
                "faculty_id": faculty_id,
            },
        )
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=409, detail="Could not assign faculty to course") from exc

    return APIResponse(
        message="Faculty assigned to course",
        data={
            "faculty_id": faculty_id,
            "course_id": course_id,
            "section_id": section_id,
            "lecture_id": lecture_id,
        },
    )


@router.get("/students", response_model=APIResponse)
def list_students(db: Session = Depends(get_db)):
    _ensure_user_auth_columns(db)
    rows = _rows(db.execute(text("SELECT roll_no, name, email, batch_year, department FROM student ORDER BY roll_no")))
    return APIResponse(message="Students fetched", data=rows)


@router.post("/students", response_model=APIResponse, status_code=status.HTTP_201_CREATED)
def create_student(payload: dict, db: Session = Depends(get_db)):
    _ensure_user_auth_columns(db)
    roll_no = payload.get("roll_no")
    name = payload.get("name")
    email = (payload.get("email") or f"{str(roll_no).lower()}@nithams.local").strip().lower() if roll_no else None
    raw_password = payload.get("password") or f"Stu@{roll_no}"
    batch_year = payload.get("batch_year")
    department = payload.get("department")
    if not roll_no or not name or not batch_year:
        raise HTTPException(status_code=400, detail="roll_no, name, batch_year are required")

    try:
        db.execute(
            text(
                """
                INSERT INTO student (roll_no, name, email, password_hash, batch_year, department)
                VALUES (:roll_no, :name, :email, :password_hash, :batch_year, :department)
                """
            ),
            {
                "roll_no": roll_no,
                "name": name,
                "email": email,
                "password_hash": hash_password(raw_password),
                "batch_year": int(batch_year),
                "department": department,
            },
        )
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=409, detail="Roll number or email already exists") from exc

    return APIResponse(
        message="Student created",
        data={
            "roll_no": roll_no,
            "name": name,
            "email": email,
            "batch_year": int(batch_year),
            "department": department,
            "login_email": email,
            "temporary_password": raw_password,
            "role": "student",
        },
    )


@router.put("/students/{roll_no}", response_model=APIResponse)
def update_student(roll_no: str, payload: dict, db: Session = Depends(get_db)):
    _ensure_user_auth_columns(db)
    result = db.execute(
        text(
            """
            UPDATE student
            SET name = :name,
                email = COALESCE(:email, email),
                batch_year = :batch_year,
                department = :department
            WHERE roll_no = :roll_no
            """
        ),
        {
            "roll_no": roll_no,
            "name": payload.get("name"),
            "email": payload.get("email"),
            "batch_year": int(payload.get("batch_year")),
            "department": payload.get("department"),
        },
    )
    db.commit()
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Student not found")
    return APIResponse(message="Student updated", data={"roll_no": roll_no, **payload})


@router.delete("/students/{roll_no}", response_model=APIResponse)
def delete_student(roll_no: str, db: Session = Depends(get_db)):
    try:
        # Remove dependent rows first to satisfy FK constraints.
        db.execute(text("DELETE FROM attendance WHERE roll_no = :roll_no"), {"roll_no": roll_no})
        db.execute(text("DELETE FROM enrolls WHERE roll_no = :roll_no"), {"roll_no": roll_no})
        result = db.execute(text("DELETE FROM student WHERE roll_no = :roll_no"), {"roll_no": roll_no})
        if result.rowcount == 0:
            db.rollback()
            raise HTTPException(status_code=404, detail="Student not found")
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=409, detail="Cannot delete student due to related records") from exc

    return APIResponse(message="Student deleted", data={"roll_no": roll_no})


@router.get("/students/{roll_no}/courses", response_model=APIResponse)
def student_courses(roll_no: str, db: Session = Depends(get_db)):
    _ensure_enrollment_section_column(db)
    rows = _rows(
        db.execute(
            text(
                """
                SELECT
                    e.course_id,
                    c.course_name,
                    COALESCE(e.section_name, (SELECT MIN(s.section_name) FROM section s), 'A') AS section_id
                FROM enrolls e
                JOIN course c ON c.course_id = e.course_id
                WHERE e.roll_no = :roll_no
                ORDER BY e.course_id
                """
            ),
            {"roll_no": roll_no},
        )
    )
    return APIResponse(message="Student courses fetched", data=rows)


@router.post("/students/{roll_no}/enroll", response_model=APIResponse, status_code=status.HTTP_201_CREATED)
def enroll_student(roll_no: str, payload: dict, db: Session = Depends(get_db)):
    _ensure_enrollment_section_column(db)
    _ensure_course_section_table(db)
    course_id = payload.get("course_id")
    section_id = payload.get("section_id")
    if not course_id or not section_id:
        raise HTTPException(status_code=400, detail="course_id and section_id are required")

    student_exists = db.execute(
        text("SELECT 1 FROM student WHERE roll_no = :roll_no LIMIT 1"),
        {"roll_no": roll_no},
    ).first()
    if not student_exists:
        raise HTTPException(status_code=404, detail="Student not found")

    course_exists = db.execute(
        text("SELECT 1 FROM course WHERE course_id = :course_id LIMIT 1"),
        {"course_id": course_id},
    ).first()
    if not course_exists:
        raise HTTPException(status_code=404, detail="Course not found")

    section_exists = db.execute(
        text(
            """
            SELECT 1
            FROM section
            WHERE section_name = :section_id
            LIMIT 1
            """
        ),
        {"section_id": section_id},
    ).first()
    if not section_exists:
        raise HTTPException(status_code=404, detail="Section not found")

    mapping_exists = db.execute(
        text(
            """
            SELECT 1
            FROM course_section
            WHERE course_id = :course_id AND section_name = :section_id
            LIMIT 1
            """
        ),
        {"course_id": course_id, "section_id": section_id},
    ).first()
    if not mapping_exists:
        raise HTTPException(status_code=409, detail="Section is not mapped to this course")

    existing = db.execute(
        text("SELECT 1 FROM enrolls WHERE roll_no = :roll_no AND course_id = :course_id LIMIT 1"),
        {"roll_no": roll_no, "course_id": course_id},
    ).first()

    try:
        if existing:
            db.execute(
                text(
                    """
                    UPDATE enrolls
                    SET section_name = :section_id
                    WHERE roll_no = :roll_no AND course_id = :course_id
                    """
                ),
                {"roll_no": roll_no, "course_id": course_id, "section_id": section_id},
            )
        else:
            db.execute(
                text(
                    """
                    INSERT INTO enrolls (roll_no, course_id, section_name)
                    VALUES (:roll_no, :course_id, :section_id)
                    """
                ),
                {"roll_no": roll_no, "course_id": course_id, "section_id": section_id},
            )
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=409, detail="Could not assign student to section") from exc

    return APIResponse(
        message="Student assigned to section",
        data={"roll_no": roll_no, "course_id": course_id, "section_id": section_id},
    )


@router.get("/sections/{course_id}/{section_id}/students", response_model=APIResponse)
def section_students(course_id: str, section_id: str, db: Session = Depends(get_db)):
    _ensure_enrollment_section_column(db)
    rows = _rows(
        db.execute(
            text(
                """
                SELECT s.roll_no, s.name, s.department, s.batch_year
                FROM student s
                JOIN enrolls e ON e.roll_no = s.roll_no
                WHERE e.course_id = :course_id
                  AND e.section_name = :section_id
                ORDER BY s.roll_no
                """
            ),
            {"course_id": course_id, "section_id": section_id},
        )
    )
    return APIResponse(message="Section students fetched", data=rows)


@router.get("/lectures/faculty/{faculty_id}", response_model=APIResponse)
def lectures_by_faculty(faculty_id: str, db: Session = Depends(get_db)):
    rows = _rows(
        db.execute(
            text(
                """
                SELECT lecture_id, lecture_date, status, course_id, section_name, faculty_id
                FROM lecture
                WHERE faculty_id = :faculty_id
                ORDER BY lecture_date DESC, lecture_id DESC
                """
            ),
            {"faculty_id": faculty_id},
        )
    )
    return APIResponse(message="Faculty lectures fetched", data=rows)


@router.post("/lectures", response_model=APIResponse, status_code=status.HTTP_201_CREATED)
def create_lecture(payload: dict, db: Session = Depends(get_db)):
    lecture_id = int(payload.get("lecture_id") or _next_lecture_id(db))
    lecture_date = payload.get("lecture_date") or str(date.today())
    status_value = payload.get("status") or "ongoing"

    db.execute(
        text(
            """
            INSERT INTO lecture (lecture_id, lecture_date, status, course_id, section_name, faculty_id)
            VALUES (:lecture_id, :lecture_date, :status, :course_id, :section_name, :faculty_id)
            """
        ),
        {
            "lecture_id": lecture_id,
            "lecture_date": lecture_date,
            "status": status_value,
            "course_id": payload.get("course_id"),
            "section_name": payload.get("section_id"),
            "faculty_id": payload.get("faculty_id"),
        },
    )
    db.commit()
    return APIResponse(message="Lecture created", data={"lecture_id": lecture_id})


@router.delete("/lectures/{lecture_id}", response_model=APIResponse)
def delete_lecture(lecture_id: int, db: Session = Depends(get_db)):
    result = db.execute(text("DELETE FROM lecture WHERE lecture_id = :lecture_id"), {"lecture_id": lecture_id})
    db.commit()
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Lecture not found")
    return APIResponse(message="Lecture deleted", data={"lecture_id": lecture_id})


@router.post("/lectures/{lecture_id}/finalize", response_model=APIResponse)
def finalize_lecture(lecture_id: int, db: Session = Depends(get_db)):
    result = db.execute(
        text("UPDATE lecture SET status = 'finalized' WHERE lecture_id = :lecture_id"),
        {"lecture_id": lecture_id},
    )
    db.commit()
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Lecture not found")
    return APIResponse(message="Lecture finalized", data={"lecture_id": lecture_id, "status": "finalized"})


@router.get("/attendance/lecture/{lecture_id}", response_model=APIResponse)
def attendance_by_lecture(lecture_id: int, db: Session = Depends(get_db)):
    rows = _rows(
        db.execute(
            text(
                "SELECT attendance_id, roll_no, is_present FROM attendance WHERE lecture_id = :lecture_id ORDER BY roll_no"
            ),
            {"lecture_id": lecture_id},
        )
    )
    return APIResponse(message="Attendance by lecture fetched", data=rows)


@router.get("/attendance/student/{roll_no}", response_model=APIResponse)
def attendance_by_student(roll_no: str, db: Session = Depends(get_db)):
    rows = _rows(
        db.execute(
            text(
                """
                SELECT a.attendance_id, a.lecture_id, a.is_present,
                       l.course_id, l.section_name, l.lecture_date
                FROM attendance a
                JOIN lecture l ON l.lecture_id = a.lecture_id
                WHERE a.roll_no = :roll_no
                ORDER BY a.lecture_id DESC
                """
            ),
            {"roll_no": roll_no},
        )
    )
    return APIResponse(message="Attendance by student fetched", data=rows)


@router.get("/attendance/student/{roll_no}/course/{course_id}", response_model=APIResponse)
def attendance_by_student_course(roll_no: str, course_id: str, db: Session = Depends(get_db)):
    rows = _rows(
        db.execute(
            text(
                """
                SELECT a.attendance_id, a.lecture_id, a.is_present,
                       l.course_id, l.section_name, l.lecture_date
                FROM attendance a
                JOIN lecture l ON l.lecture_id = a.lecture_id
                WHERE a.roll_no = :roll_no AND l.course_id = :course_id
                ORDER BY a.lecture_id DESC
                """
            ),
            {"roll_no": roll_no, "course_id": course_id},
        )
    )
    return APIResponse(message="Attendance by student/course fetched", data=rows)


@router.post("/attendance/mark", response_model=APIResponse)
def mark_attendance(payload: dict, db: Session = Depends(get_db)):
    roll_no = str(payload.get("roll_no"))
    lecture_id = int(payload.get("lecture_id"))
    is_present = bool(payload.get("is_present"))

    existing = db.execute(
        text("SELECT attendance_id FROM attendance WHERE roll_no = :roll_no AND lecture_id = :lecture_id"),
        {"roll_no": roll_no, "lecture_id": lecture_id},
    ).mappings().first()

    if existing:
        db.execute(
            text(
                "UPDATE attendance SET is_present = :is_present WHERE roll_no = :roll_no AND lecture_id = :lecture_id"
            ),
            {"roll_no": roll_no, "lecture_id": lecture_id, "is_present": is_present},
        )
        attendance_id = existing["attendance_id"]
    else:
        attendance_id = _next_attendance_id(db)
        db.execute(
            text(
                """
                INSERT INTO attendance (attendance_id, roll_no, lecture_id, is_present)
                VALUES (:attendance_id, :roll_no, :lecture_id, :is_present)
                """
            ),
            {
                "attendance_id": attendance_id,
                "roll_no": roll_no,
                "lecture_id": lecture_id,
                "is_present": is_present,
            },
        )
    db.commit()

    return APIResponse(
        message="Attendance marked",
        data={"attendance_id": attendance_id, "roll_no": roll_no, "lecture_id": lecture_id, "is_present": is_present},
    )

-- Global Sections Migration
-- Purpose:
-- 1) Convert SECTION table from (section_name, course_id) composite key model
--    to global section names only (section_name PK).
-- 2) Ensure ENROLLS has section_name and is backfilled.
-- 3) Recreate foreign keys so LECTURE.section_name and ENROLLS.section_name
--    reference SECTION(section_name).
--
-- Safe to run multiple times (idempotent-oriented).

USE attendance_management_system;

-- Workbench safe-update mode blocks some migration UPDATE statements.
-- Temporarily disable it for this session and restore later.
SET @prev_sql_safe_updates := @@SQL_SAFE_UPDATES;
SET SQL_SAFE_UPDATES = 0;

-- ------------------------------------------------------------
-- Ensure ENROLLS.section_name exists and has enough width
-- ------------------------------------------------------------
SET @has_enrolls_section := (
  SELECT COUNT(*)
  FROM information_schema.columns
  WHERE table_schema = BINARY DATABASE()
    AND table_name = 'enrolls'
    AND column_name = 'section_name'
);

SET @sql := IF(
  @has_enrolls_section = 0,
  'ALTER TABLE enrolls ADD COLUMN section_name VARCHAR(10) NULL',
  'SELECT 1'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ------------------------------------------------------------
-- Backfill ENROLLS.section_name for null/blank rows
-- ------------------------------------------------------------
SET @section_has_course := (
  SELECT COUNT(*)
  FROM information_schema.columns
  WHERE table_schema = BINARY DATABASE()
    AND table_name = 'section'
    AND column_name = 'course_id'
);

-- Old schema backfill: map by enrolls.course_id -> first section_name in that course.
SET @sql := IF(
  @section_has_course > 0,
  'UPDATE enrolls e
   JOIN (
      SELECT course_id, MIN(section_name) AS section_name
      FROM section
      GROUP BY course_id
   ) s ON s.course_id = e.course_id
   SET e.section_name = s.section_name
  WHERE COALESCE(TRIM(e.section_name), '''') = ''''',
  'UPDATE enrolls e
   JOIN (SELECT MIN(section_name) AS section_name FROM section) s
   SET e.section_name = s.section_name
  WHERE COALESCE(TRIM(e.section_name), '''') = ''''
     AND s.section_name IS NOT NULL'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ------------------------------------------------------------
-- If SECTION still has course_id, convert to global SECTION model
-- ------------------------------------------------------------
-- Create temp global table if conversion needed
SET @sql := IF(
  @section_has_course > 0,
  'CREATE TABLE IF NOT EXISTS section_global_new (
      section_name VARCHAR(10) PRIMARY KEY
   )',
  'SELECT 1'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Seed global section names from old SECTION and from live usage in ENROLLS/LECTURE
SET @sql := IF(
  @section_has_course > 0,
  'INSERT IGNORE INTO section_global_new (section_name)
   SELECT DISTINCT section_name FROM section WHERE section_name IS NOT NULL AND TRIM(section_name) <> ''''
   UNION
   SELECT DISTINCT section_name FROM enrolls WHERE section_name IS NOT NULL AND TRIM(section_name) <> ''''
   UNION
   SELECT DISTINCT section_name FROM lecture WHERE section_name IS NOT NULL AND TRIM(section_name) <> ''''',
  'SELECT 1'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Drop existing FKs from LECTURE/ENROLLS pointing to SECTION (unknown names)
DROP TEMPORARY TABLE IF EXISTS _fk_to_section;
CREATE TEMPORARY TABLE _fk_to_section AS
SELECT table_name, constraint_name
FROM information_schema.referential_constraints
WHERE constraint_schema = BINARY DATABASE()
  AND referenced_table_name = 'section'
  AND table_name IN ('lecture', 'enrolls');

SET @drop_fk_lecture_sql := (
  SELECT IFNULL(
    CONCAT(
      'ALTER TABLE `lecture` ',
      GROUP_CONCAT(CONCAT('DROP FOREIGN KEY `', constraint_name, '`') SEPARATOR ', ')
    ),
    'SELECT 1'
  )
  FROM _fk_to_section
  WHERE table_name = 'lecture'
);
PREPARE stmt FROM @drop_fk_lecture_sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @drop_fk_enrolls_sql := (
  SELECT IFNULL(
    CONCAT(
      'ALTER TABLE `enrolls` ',
      GROUP_CONCAT(CONCAT('DROP FOREIGN KEY `', constraint_name, '`') SEPARATOR ', ')
    ),
    'SELECT 1'
  )
  FROM _fk_to_section
  WHERE table_name = 'enrolls'
);
PREPARE stmt FROM @drop_fk_enrolls_sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Replace old SECTION table with global model if conversion needed
SET @sql := IF(
  @section_has_course > 0,
  'DROP TABLE section',
  'SELECT 1'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := IF(
  @section_has_course > 0,
  'RENAME TABLE section_global_new TO section',
  'SELECT 1'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ------------------------------------------------------------
-- Normalize column width to VARCHAR(10)
-- ------------------------------------------------------------
ALTER TABLE lecture MODIFY COLUMN section_name VARCHAR(10);
ALTER TABLE enrolls MODIFY COLUMN section_name VARCHAR(10);

-- If section_name became empty after migration and SECTION has values, set default
UPDATE enrolls e
JOIN (SELECT MIN(section_name) AS section_name FROM section) s
SET e.section_name = s.section_name
WHERE (e.section_name IS NULL OR TRIM(e.section_name) = '')
  AND s.section_name IS NOT NULL;

-- ------------------------------------------------------------
-- Recreate canonical FKs to SECTION(section_name)
-- ------------------------------------------------------------
-- LECTURE -> SECTION
SET @has_fk_lecture_section := (
  SELECT COUNT(*)
  FROM information_schema.key_column_usage
  WHERE table_schema = BINARY DATABASE()
    AND table_name = 'lecture'
    AND referenced_table_name = 'section'
    AND column_name = 'section_name'
);
SET @sql := IF(
  @has_fk_lecture_section = 0,
  'ALTER TABLE lecture
   ADD CONSTRAINT fk_lecture_section_name
   FOREIGN KEY (section_name) REFERENCES section(section_name)',
  'SELECT 1'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ENROLLS -> SECTION
SET @has_fk_enrolls_section := (
  SELECT COUNT(*)
  FROM information_schema.key_column_usage
  WHERE table_schema = BINARY DATABASE()
    AND table_name = 'enrolls'
    AND referenced_table_name = 'section'
    AND column_name = 'section_name'
);
SET @sql := IF(
  @has_fk_enrolls_section = 0,
  'ALTER TABLE enrolls
   ADD CONSTRAINT fk_enrolls_section_name
   FOREIGN KEY (section_name) REFERENCES section(section_name)',
  'SELECT 1'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ------------------------------------------------------------
-- Ensure course->section mapping table exists and is backfilled
-- ------------------------------------------------------------
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
);

INSERT IGNORE INTO course_section (course_id, section_name)
SELECT DISTINCT e.course_id, e.section_name
FROM enrolls e
WHERE e.course_id IS NOT NULL
  AND e.section_name IS NOT NULL
  AND TRIM(e.section_name) <> '';

INSERT IGNORE INTO course_section (course_id, section_name)
SELECT DISTINCT l.course_id, l.section_name
FROM lecture l
WHERE l.course_id IS NOT NULL
  AND l.section_name IS NOT NULL
  AND TRIM(l.section_name) <> '';

-- ------------------------------------------------------------
-- Optional integrity checks (read-only)
-- ------------------------------------------------------------
SELECT 'SECTION rows' AS item, COUNT(*) AS value FROM section
UNION ALL
SELECT 'COURSE_SECTION rows', COUNT(*) FROM course_section
UNION ALL
SELECT 'ENROLLS missing section_name', COUNT(*) FROM enrolls WHERE section_name IS NULL OR TRIM(section_name) = ''
UNION ALL
SELECT 'Distinct ENROLLS section_name not in SECTION', COUNT(*)
FROM (
  SELECT DISTINCT e.section_name
  FROM enrolls e
  LEFT JOIN section s ON s.section_name = e.section_name
  WHERE e.section_name IS NOT NULL AND TRIM(e.section_name) <> ''
    AND s.section_name IS NULL
) x;

-- Restore session safe-update mode
SET SQL_SAFE_UPDATES = @prev_sql_safe_updates;

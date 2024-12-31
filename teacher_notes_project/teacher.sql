CREATE TABLE teacher_notes (
  id SERIAL PRIMARY KEY,
  teacher_name VARCHAR(255),
  file_url TEXT,
  upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Change the embedding column to F32_BLOB type for vector search
-- Unfortunately SQLite doesn't support ALTER COLUMN TYPE, so we need to create a new table

-- 1. Create a new table with the vector type
CREATE TABLE post_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT(256) NOT NULL,
  content TEXT(1000) NOT NULL,
  excerpt TEXT(1000),
  image TEXT(1000),
  category_id INTEGER REFERENCES category(id),
  embedding F32_BLOB(384),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Copy data (embedding will be NULL, it needs to be regenerated)
INSERT INTO post_new (id, title, content, excerpt, image, category_id, created_at)
SELECT id, title, content, excerpt, image, category_id, created_at FROM post;

-- 3. Drop the old table
DROP TABLE post;

-- 4. Rename the new table
ALTER TABLE post_new RENAME TO post;

-- 5. Create vector index
CREATE INDEX post_embedding_idx ON post(libsql_vector_idx(embedding));

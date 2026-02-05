Summary of changes in this branch — Semantic Search

This branch adds semantic search functionality based on embeddings and Turso vector search. Below is a concise overview of the key changes and files.

- **Embedding model:** [src/lib/embeddings/model.ts](src/lib/embeddings/model.ts) — uses `@xenova/transformers` (model "Xenova/all-MiniLM-L6-v2") to generate 384-dimensional embeddings; includes helpers `embeddingToBuffer`, `bufferToEmbedding`, and `cosineSimilarity`.
- **Search API:** [src/app/api/search/route.ts](src/app/api/search/route.ts) — the `/api/search` endpoint generates an embedding for the query, sends it to the Turso client, and uses the native `vector_distance_cos` for ranking results (distance → similarity conversion); supports `limit` and `threshold` parameters.
- **DB and migrations:**
  - [src/lib/db/init-vector.ts](src/lib/db/init-vector.ts) — script to initialize Turso vector support (runs SQL migrations).
  - The `drizzle` schema and migrations in `src/lib/db/migrations/` (e.g. `0001_add_vector_support.sql`) add the column/index for embeddings.
- **Embedding generation and seed data:**
  - [src/lib/db/generate-embeddings.ts](src/lib/db/generate-embeddings.ts) — batch script to generate and save embeddings for existing posts.
  - [src/lib/db/seed.ts](src/lib/db/seed.ts) — seed data for posts and categories (uses `src/lib/data/mock-data.json`).
- **Frontend component:** [src/components/semantic-search.tsx](src/components/semantic-search.tsx) — client-side search component with input, debounce, calls to `/api/search`, and result rendering (match % badge, excerpt, category, image).

Notes for running:
- Requires Turso environment variables to be set (`TURSO_CONNECTION_URL`, `TURSO_AUTH_TOKEN`).
- After applying migrations, initialize vector support and generate embeddings: for example `pnpm db:init-vector` → `pnpm db:embeddings` (if corresponding npm scripts exist).

If you want, I can also:
- add a short guide to the README for deploying the vector search,
- or create npm scripts (if missing) for `db:init-vector` / `db:embeddings` / `db:seed`.

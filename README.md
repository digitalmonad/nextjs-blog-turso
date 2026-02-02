## About this project

This repository is a small example mini-blog application created to experiment with setting up a Turso database (local `turso dev` and Turso Cloud [www.turso.tech](https://www.turso.tech)). It's intended for learning and testing local development, migrations, and connection handling rather than production use.

## Local development workflow

This project requires the Turso CLI for local development. Install instructions are available at https://docs.turso.tech/cli/installation

Also create a `.env` file in the project root and set `TURSO_CONNECTION_URL` (and `TURSO_AUTH_TOKEN` for cloud). For local development with `turso dev`, use the local server URL printed by the CLI, for example:

```
TURSO_CONNECTION_URL=http://127.0.0.1:8080
```

Or set the remote Turso connection URL and token when using Turso Cloud.

For local development with Turso and Drizzle run these steps (using pnpm):

1. Generate Drizzle client

```bash
pnpm run db:generate
```

2. Start local Turso dev server

```bash
pnpm run db:local
```

3. Run migrations

```bash
pnpm run db:migrate
```

4. (optional) To manage local Turso db run Drizzle studio in separate terminal:

```bash
pnpm run db:studio
```

If you need to set environment variables manually, create a `.env` with `TURSO_CONNECTION_URL` (and `TURSO_AUTH_TOKEN` for cloud) or export them in your shell before running migrations.

For running Nextjs:

```bash
pnpm dev
```

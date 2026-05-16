# @zalvice/db

Drizzle schema, migrations, and typed query helpers. Single source of truth for the data model defined in [`PRD.md` §6](../../PRD.md#6-content-model).

## Layout

```
src/
  schema/      One file per table. Re-exported from index.ts.
  queries/     Typed read helpers — anything used in more than one place.
  migrations/  Generated SQL. Never hand-edit after commit.
  scripts/     migrate / seed / reset entry points.
  index.ts     Default Drizzle client.
```

## Workflow

```bash
pnpm db:generate    # diff schema → new migration file
pnpm db:migrate     # apply pending migrations
pnpm db:seed        # populate dev fixtures
pnpm db:reset       # drop, migrate, seed (refuses on prod URL)
pnpm db:studio      # GUI at http://localhost:4983
```

## Rules

- Migrations are additive-first. Never destructive in one deploy.
- Renames are two-phase. See [`skills.md` §14](../../skills.md#14-database-migration-safety).
- Every query that appears in more than one route belongs in `src/queries/`.
- Schema and Zod validators live in the same file when the validator
  exists; do not duplicate the shape.

## Scaffold status

This package is scaffolded with the **stats** and **clients** tables (the
minimum needed to power the homepage masthead + logo strip + services
overview). Remaining tables from PRD §6 are tracked as a separate PR.

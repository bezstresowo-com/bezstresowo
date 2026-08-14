# Dev notes (not committed without explicit consent)

## Git / commits

- **DO NOT commit or push without the user's direct, explicit consent.**
  This overrides the global "always commit after changes" rule for this repo.

## Media cleanup (supersedes the Prisma extension idea)

The Prisma **query extension** approach was dropped - see TODO.md pkt 3. Extensions
only intercept top-level client calls, so they miss `$runCommandRaw`, direct Mongo
access, MongoDB's engine-side `onDelete: Cascade`, and nested relational writes.

What we run instead lives in `src/shared/server/functions/media-cleanup.ts`:

1. `cleanupMedia(ids)` - explicit, called right **after** a mutation commits
   (`admin-blog.remote.ts`, `admin-products.remote.ts`). Never throws: a bucket
   failure must not undo a successful db write. Before deleting anything it
   re-reads every `mediaIds` array in the database, so media shared between
   translations or records is kept.
2. `reconcileBucket()` - the actual guarantee. Lists the bucket, subtracts every
   referenced id, deletes what is left over once it is older than the grace
   period (fresh uploads are not attached to a row yet). Exposed as
   `POST /api/cron/media-sweep` behind `CRON_SECRET`, supports `?dryRun=1`.

Adding a new model with `mediaIds`? Register it in `MEDIA_OWNERS` and both layers
pick it up.

## Remote functions

Data access lives in `src/remote/*.remote.ts` (`kit.experimental.remoteFunctions`).
Things worth remembering:

- `.remote.ts` files may only export remote functions - DTOs live in `src/remote/dto/`.
- Remote functions all share the `/_app/remote/...` prefix, so path based auth in
  `hooks.server.ts` cannot see them: admin functions call `requireAdmin()`.
- Command/query arguments are JSON (devalue), **not** multipart - media uploads
  send base64 (`uploadMedia`), capped at 8 MB.
- Validation reuses the existing `class-validator` DTOs through
  `dtoSchema()`, which adapts them to Standard Schema. Messages stay translation
  keys and reach the client per field via `handleValidationError`.

## i18n

The active locale comes from the `[lang]` route segment, never from a module level
store (that would leak between concurrent SSR requests). `t()` reads it off
`page.params.lang`; server code uses `translateWith(locale, key)`.

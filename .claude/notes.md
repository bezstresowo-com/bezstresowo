# Dev notes (not committed without explicit consent)

## Git / commits
- **DO NOT commit or push without the user's direct, explicit consent.**
  This overrides the global "always commit after changes" rule for this repo.

## Blog media cleanup Prisma extension
File: `src/shared/server/services/prisma/extensions/blog-media-cleanup.ts`

Goal: when an `InternationalizedBlogArticle` is deleted (directly or via cascade
from `BlogArticle`), delete its `mediaIds` objects from the bucket (S3/MinIO).

### Key limitation (why it also hooks the parent)
A Prisma query extension only intercepts **top-level client calls**. MongoDB
emulates `onDelete: Cascade` inside the query engine, so children deleted by
cascading from `blogArticle.delete` do NOT pass through the child handler.
=> To cover the cascade, the extension ALSO intercepts `blogArticle.delete` /
`deleteMany`, pre-reads the children's `mediaIds`, then cleans the bucket.

Intercepted ops: `internationalizedBlogArticle.{delete,deleteMany}` and
`blogArticle.{delete,deleteMany}`.

### NOT covered (ask before adding)
- Nested relational deletes: `blogArticle.update({ data: {
  internationalizedArticles: { delete / deleteMany } } })` (goes through `update`).
- Raw ops (`$runCommandRaw`) / direct Mongo access bypass extensions entirely.

### Behaviour
- Non-atomic by design: read ids -> DB delete -> best-effort bucket delete
  (`Promise.allSettled`, failures logged, never thrown). A bucket failure leaves
  orphaned files but never leaves live rows without media.
- Assumes a media id belongs to a single row (blog media are per-translation).

### Wiring (NOT done yet — needs approval)
`$extends` returns a new client that is NOT `instanceof PrismaService`, so the
current class-based singleton in `prisma-service.ts` needs a small refactor, e.g.:

```ts
const base = new PrismaClient({ log: ... });
export const prisma = base.$extends(blogMediaCleanupExtension);
```

Also note: the existing `src/routes/api/admin/blog/[id]/+server.ts` DELETE still
deletes media by `blogArticle.mediaIds`, but `mediaIds` moved to
`InternationalizedBlogArticle` in the new schema — that route is already stale and
should be simplified once the extension is wired in.

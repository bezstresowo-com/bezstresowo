# Book delivery activation

The book checkout and download routes are staged in the preview branch. Existing shop and consultation checkouts are unchanged. No paid PDF is committed to the public repository.

## Required production configuration

- Create a separate private S3 bucket for paid books in the existing AWS region. Enable **all four** S3 Block Public Access settings, disable public ACLs, and allow the application's existing IAM identity only the required `s3:GetObject` and `s3:GetBucketPublicAccessBlock` operations. Do not use the public media bucket: its cleanup removes unreferenced files.
- Upload the approved final 75-page PDF. The current Library manuscript still says “Робочий варіант” on its cover; do not sell that file unchanged without approval.
- Set `AWS_BOOKS_BUCKET_NAME`, `BOOK_UA_OBJECT_KEY`, and a randomly generated `BOOK_DOWNLOAD_SECRET` of at least 32 characters in deployment secrets. Keep that signing secret stable or all outstanding download links stop working.
- Keep `BOOK_SALES_ENABLED=false` until the PDF, storage access, email, webhook and full purchase flow have been tested.
- The existing Gmail email transport needs its production credentials. No new SendPulse integration is needed for this book.
- Subscribe the existing Stripe webhook endpoint to `checkout.session.completed` and `checkout.session.async_payment_succeeded`.
- Activate `BOOK_SALES_ENABLED=true` only after a successful test in a deployment connected to matching Stripe keys/webhook secrets.

## Behavior

- Price is fixed server-side at PLN 49.00, quantity one. Client input cannot change the product or amount.
- Checkout checks that storage blocks public access and that the object is a PDF before creating a payment session.
- Delivery runs on verified webhook events and rechecks the actual Stripe session for payment, product, currency and amount.
- Emails contain a signed link with no expiry, allowing three download attempts. Downloads recheck the paid session, never reveal the S3 URL, and use `private, no-store` response headers.
- Run `prisma generate` and deploy the `BookDownload` schema before activation. The counter uses the checkout session id as its Mongo `_id`; retries do not reset it.
- GET requests only display the download page. A same-origin form POST atomically increments the counter, preventing four parallel requests from exceeding three successful claims. A network failure after the claim can consume an attempt.
- Downloads are ordinary PDF copies, without a personalized watermark at this stage. They can be saved/printed/shared.
- The success page never claims payment confirmation on its own.
- Email failures return HTTP 500 for Stripe retry. Successful book delivery is recorded by checkout-session id to suppress sequential duplicate events. Concurrent retries can still duplicate an email; they do not duplicate a charge or expose unpaid content. Before high-volume launch, add a durable delivery queue with lease-based concurrency handling.
- Access renewal currently requires the owner to resend a new signed link after verifying the paid session. Automated self-service renewal is not implemented.

## End-to-end launch checks

Test successful payment and delivery, failed/unpaid checkout, tampered download tokens and the three-download limit, duplicate webhooks, delayed successful payments, absent/private-file misconfiguration, mail failure/retry and existing consultation checkout. Inspect the actual delivered PDF on a phone and desktop. No production purchase was performed by the agent.

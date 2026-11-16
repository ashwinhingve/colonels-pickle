# Set up official WhatsApp order alerts

This guide connects the website directly to Meta's WhatsApp Cloud API. Sir receives an alert on his WhatsApp for confirmed COD orders and successful online payments. Orders already appear in **Admin → Orders** independently of WhatsApp. Unpaid/abandoned checkouts do not trigger an alert. No customer WhatsApp messaging is added.

The code replaces CallMeBot and Telegram. Existing email/SMS behavior is preserved. Meta can charge for delivered template messages; account approval and a free production service are not guaranteed. See [Meta pricing](https://business.whatsapp.com/products/platform-pricing).

## 1. Prepare the accounts and phone numbers

1. Ask Sir which WhatsApp number should **receive** the alerts and obtain his agreement to receive them.
2. Use a **separate business sender number** that can receive an SMS/voice verification code. Sir keeps using his existing recipient WhatsApp normally. Do not delete or deregister an existing WhatsApp account to follow this guide. Connecting an existing WhatsApp Business app number needs Meta's separate coexistence onboarding flow.
3. Sign in to [Meta for Developers](https://developers.facebook.com/apps), register as a developer if required, and create an app with the **Connect with customers through WhatsApp** use case.
4. Select/create the client's business portfolio and WhatsApp Business account. Keep these owned by the client, with access granted to the developer as needed.
5. Open the app's WhatsApp API setup. A Meta test sender can be used for initial API tests; add and verify Sir as a test recipient if prompted. This does not replace registering a production sender.
6. Add and verify the production sender, enter the business display name, and complete the account/publishing/business-verification requirements shown by Meta. Configure billing in WhatsApp Manager. Timing depends on Meta's reviews.

Official walkthrough: [Meta Cloud API quickstart](https://developers.facebook.com/documentation/business-messaging/whatsapp/get-started).

## 2. Collect credentials

Create a local `.env.local` from `.env.local.example` only if you do not already have one. Preserve the existing database, payment, shipping, and authentication settings.

| Variable | Where to get it / value |
| --- | --- |
| `WHATSAPP_ACCESS_TOKEN` | Business Settings → System users → assign the app and WhatsApp account → generate a system-user token with `whatsapp_business_messaging` and `whatsapp_business_management`. Grant `business_management` if required by the setup workflow. Use the token lifetime offered for production; temporary quickstart tokens expire. |
| `WHATSAPP_PHONE_NUMBER_ID` | The **sender phone-number ID** from API Setup; this is an ID, not a telephone number. |
| `WHATSAPP_BUSINESS_ACCOUNT_ID` | WhatsApp Business account ID from API Setup; used by template submission. |
| `WHATSAPP_ADMIN_PHONE` | Sir's receiving WhatsApp number in international digits only, e.g. `919876543210`. Do not use the sender number here. |
| `WHATSAPP_API_VERSION` | Defaults to `v23.0`; use a supported version shown in your Meta app and review it when upgrading. |
| `WHATSAPP_ORDER_TEMPLATE` | `colonels_pickle_admin_new_order` |
| `WHATSAPP_TEMPLATE_LANGUAGE` | `en_US` (must match the approved template). |
| `WHATSAPP_APP_SECRET` | App Dashboard → App Settings → Basic → App secret. Used to authenticate webhook callbacks. |
| `WHATSAPP_VERIFY_TOKEN` | A random secret you generate; enter the same value in Meta's webhook verification form. |
| `WHATSAPP_RETRY_SECRET` | A different random secret; used only by the retry scheduler. |
| `WHATSAPP_START_AT` | UTC launch timestamp, e.g. `2026-11-16T19:00:00.000Z`. Orders created earlier are excluded, including callbacks for old orders. Set it once at rollout; keep it unchanged across later deployments. |
| `NEXT_PUBLIC_APP_URL` | Your final HTTPS website origin, without `/admin`, e.g. `https://your-domain.example`. |

Generate each random secret separately with `openssl rand -hex 32`. Never put tokens/secrets in `NEXT_PUBLIC_` variables, source control, screenshots, client messages, or URL query parameters. Remove obsolete `CALLMEBOT_*` and `TELEGRAM_*` variables from hosting after rollout.

### Register the verified production sender

Adding the number and verifying SMS ownership is separate from Cloud API registration. After completing step 2, set `WHATSAPP_TWO_STEP_PIN` in your local `.env.local` to a six-digit PIN for the **new sender**, then run:

```bash
npx tsx scripts/register-whatsapp-sender.ts
npx tsx scripts/register-whatsapp-sender.ts --register
```

The first command only displays instructions; the second registers the configured sender. If two-step verification already exists, use its existing PIN. Store the PIN securely; this is not the SMS verification code. It is only needed locally for registration, not as a Vercel runtime variable. Do not repeatedly register an already functioning sender. See [Meta sender registration](https://developers.facebook.com/documentation/business-messaging/whatsapp/business-phone-numbers/registration).

## 3. Create and approve the order template

Preview the exact submission JSON without sending anything:

```bash
npx tsx scripts/whatsapp-template.ts
```

The template is proposed as **Utility**, English (US), with this exact body:

```text
New confirmed order received.
Order: {{1}}
Customer: {{2}}
Total: INR {{3}}
Quantity: {{4}}
Payment method: {{5}}
View orders: {{6}}
```

Sample values, in order: `CP-2026-001`, `Aarav`, `1299.50`, `3`, `Cash on Delivery`, `https://your-domain.example/admin/orders`.

Submit with the configured account/token:

```bash
npx tsx scripts/whatsapp-template.ts --submit
```

Alternatively create it manually in WhatsApp Manager → Message templates using the identical name, language, body, and examples. Do not submit twice if it already exists. Meta decides category and approval; an internal merchant alert is not guaranteed to qualify as utility. Review any rejection in WhatsApp Manager. If approved wording or category changes, keep the same six parameter meanings/order and update the script/code if required. Do not enable sending until the template is approved and active.

## 4. Deploy to Vercel

1. Add all the variables above in Vercel → Project → Settings → Environment Variables for **Production**. Preserve existing project variables. Keep real recipient credentials out of preview deployments to avoid accidental messages.
2. Set `WHATSAPP_START_AT` to your rollout timestamp. Redeploy after environment changes.
3. Build command remains `npm run build`; this feature needs no extra package or always-running process.
4. Ensure production webhook and retry URLs are reachable by Meta/the scheduler. If deployment protection is enabled, configure access for these integrations; application signature/secret checks remain required.

## 5. Connect the delivery webhook

In Meta App Dashboard → WhatsApp / Use cases → Customize → Configuration:

- Callback URL: `https://YOUR-DOMAIN/api/notifications/whatsapp/webhook`
- Verify token: exactly your `WHATSAPP_VERIFY_TOKEN`
- Verify and save; subscribe to the **messages** field for the WhatsApp account. Ensure the app is subscribed to that account as directed by Meta's setup.

The endpoint validates the challenge and HMAC signature using the app secret. It handles sent, delivered, read, and failed receipts, including duplicate and out-of-order events. Incoming chat messages are acknowledged; this is not a chatbot.

Official reference: [Create a Meta webhook endpoint](https://developers.facebook.com/documentation/business-messaging/whatsapp/webhooks/create-webhook-endpoint).

## 6. Schedule automatic retries

Immediate sends run during order confirmation. A scheduler also recovers missed confirmations and retries temporary failures. Without it, background recovery will not run.

Create a job at [cron-job.org](https://cron-job.org/) (or an equivalent HTTP scheduler):

- URL: `https://YOUR-DOMAIN/api/notifications/whatsapp/retry`
- Method: **GET**
- Schedule: **every five minutes**
- Custom request header: `Authorization: Bearer YOUR_WHATSAPP_RETRY_SECRET`
- Enable failure notifications and run the scheduler's test request.
- Expect HTTP 200 with aggregate `recovered`, `processed`, `pending`, and `failed` counts. Investigate a nonzero `failed` count even when HTTP is 200.

Use a scheduler request timeout of at least 30 seconds if available. A scheduler timeout does not necessarily stop the Vercel invocation; atomic claims protect overlapping runs. Never put the secret in the URL. The scheduler only needs this retry secret, not your Meta token. See [scheduler documentation](https://docs.cron-job.org/).

The endpoint processes at most five jobs and reconciles at most ten missing jobs per run. Scale this design before high order volumes. This setup does not add a frequent Vercel cron, so it does not require Vercel Pro's cron frequency allowance. Hosting/provider eligibility and usage charges remain separate.

## 7. Test before closing the project

1. Preview the message without network delivery:
   `npx tsx scripts/test-whatsapp-notification.ts`
2. Explicitly send a sample alert:
   `npx tsx scripts/test-whatsapp-notification.ts --live`
   This returns Meta acceptance and a message ID. **Open Sir's WhatsApp to verify arrival.** This standalone sample creates no order/database job, so its delivery status is not shown in Admin.
3. Place a confirmed COD order. Check Admin → Orders → open the order → **WhatsApp order alert**. Verify Sir receives the message.
4. Complete a paid online order and check the same result. Repeated payment callbacks should reuse the existing job.
5. Create an unpaid checkout: it can appear in Admin → Orders, but should not trigger WhatsApp under the confirmed-order rule.
6. Test the scheduler and ensure webhook statuses advance from `accepted` to `sent`, `delivered`, or `read`.

Local automated tests: `npm run test:whatsapp`. Also run `npm run lint` and `npm run build`.

## 8. Troubleshooting and recovery

- **Not queued:** confirm the order is paid online/confirmed COD, created after `WHATSAPP_START_AT`, and the scheduler is running. Check Vercel logs for enqueue/database errors. Old orders are deliberately excluded.
- **Pending / sending:** check scheduler history. Jobs have atomic 60-second leases. Temporary errors retry with delays of 5, 10, 20, then 40 minutes; five total attempts are allowed. The next scheduler tick determines actual retry time.
- **Accepted:** Meta accepted the request; this is not proof of delivery. Check the recipient phone, number, template/account status, and webhook configuration. Do not automatically resend an accepted message merely because a read receipt is absent.
- **`configuration_missing_or_invalid`:** verify token, digit-only phone-number ID and recipient, supported API version, template name, and HTTPS app URL.
- **`meta_401_*` / token errors:** replace expired/revoked tokens and redeploy. Check permissions and assigned business assets.
- **Other `meta_HTTP_CODE_META_CODE` errors:** inspect the corresponding Meta error in WhatsApp Manager; check template approval, language, parameter count, billing, sender registration, and recipient consent.
- **`delivery_META_CODE`:** Meta later reported failure. Resolve the cause before manually retrying. Delivery failures are visible and are not blindly resent.
- **`network_or_timeout_delivery_uncertain` or `lease_expired_delivery_uncertain`:** delivery may have occurred. Check WhatsApp before retrying. Exact-once delivery cannot be guaranteed across network failures.
- **Webhook HTTP 403:** verify the app secret/verify token belong to this app and match Vercel. Do not disable signature validation.
- **Retry endpoint HTTP 401:** correct the scheduler Authorization header and redeploy if the retry secret changed.

After correcting a failed job, use a trusted local environment connected to the same production database:

```bash
npx tsx scripts/retry-whatsapp-notification.ts --order-id=ORDER_MONGODB_ID --retry
```

This resets only that order's failed WhatsApp job and attempts a send. It can duplicate a message after uncertain delivery. It does not create missing jobs or resend delivered/accepted alerts. Never change `adminNotifiedAt` to retry WhatsApp; email/SMS deduplication is independent.

## Client update to send

> Sir, we’re setting up official WhatsApp alerts so you receive a notification for each confirmed order. Orders will also be available in the admin Orders page. Please confirm the receiving WhatsApp number and help complete the Meta account/phone verification; messaging charges may apply. Please also create the delivery partner account so we can connect its API, and confirm the product list, sizes and prices currently shown on the website. We’ll create any missing product images.

Finish only after the account and template are approved, the scheduler/webhook are connected, and Sir confirms receiving real COD and paid-order alerts.

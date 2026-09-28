# Resend enquiry delivery setup

The website form sends a JSON request to `/api/contact`. That Vercel Function sends the enquiry to `brian@elliservices.com.au` using Resend and sets the visitor's address as the Reply-To address.

## Vercel configuration

1. In Resend, verify the sending domain and create an API key with sending permission.
2. In Vercel: **Project → Settings → Environment Variables**, add these values for Production, Preview and Development:

   - `RESEND_API_KEY` — the Resend API key beginning with `re_`
   - `RESEND_FROM_EMAIL` — a verified sender, for example `Ellis Services Group <enquiries@your-domain.com.au>`

3. Confirm the Vercel project root directory is this website folder, so both `api/contact.js` and `vercel.json` are included in the deployment.
4. Redeploy, submit a test enquiry, and reply to the received message to confirm the Reply-To address is the visitor's email.

Do not add the API key to browser JavaScript, GitHub, or any public file.

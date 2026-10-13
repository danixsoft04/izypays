IZYPAYS PWA PACKAGE

Files in this folder:
- index.html: updated izypays app with working Try Free Now CTA, school-registration success handler, and PWA registration/install prompt.
- manifest.json: PWA identity, display settings, and icon references.
- service-worker.js: caches the app shell only. It does not cache Supabase, authentication, or payment responses.
- icon-192.png and icon-512.png: PWA app icons.

DEPLOYMENT
1. Back up the existing folder first.
2. Put these files together in the same folder on your HTTPS website, replacing the old index.html and the matching PWA assets if needed.
3. Open the website online and refresh it. The browser may need a short time to recognize the updated manifest/service worker.
4. Test school registration using a test account. If email confirmation is enabled, confirm the email and then log in in the same browser; the success confirmation appears after the school has actually been connected.
5. Test Try Free Now: it should open the Create Your izypays School Account form.

OFFLINE NOTE
The service worker can reopen the cached HTML shell. Supabase sign-in, school data, and payments still need an internet connection. This package intentionally does not cache private school/payment data or third-party authentication/payment responses.

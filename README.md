# We Clear Debt Website

A modern, mobile-first website for We Clear Debt, a South African debt assistance company.

## Pages

- **Home (`/`)**: Hero section, problem/solution, benefits, testimonials, 3-step process, contact form.
- **About Us (`/about-us/`)**: Company information and mission.
- **Debt Review (`/debt-review/`)**: How debt review works.
- **Common Terms (`/common-terms/`)**: Definitions of common debt review terms.
- **Articles (`/articles/`)**: Practical guides to debt review, the process, and common questions.
- **FAQ (`/faq/`)**: Common questions and answers.
- **Contact (`/contact/`)**: Contact form, details, and a private service feedback form.
- **Privacy and terms (`/privacy/`)**: Website legal policies and consent information.

## Features

- Mobile-first responsive design using Bootstrap 5.
- Sticky call-to-action buttons for phone and WhatsApp.
- SEO optimized with meta tags and keywords.
- Trustworthy design with testimonials and benefits.
- Contact enquiries are stored in the Supabase CRM and sent through the configured Formspree endpoint.
- Private service feedback submissions are sent through the configured Formspree endpoint; the team can reply using the email provided.

## Technologies

- HTML5
- CSS3
- JavaScript
- Bootstrap 5
- Font Awesome icons

## Setup

1. Open `index.html` in a web browser to view the site.
2. For development, use a local server (e.g., Live Server extension in VS Code).

## Customization

- Update contact details in all pages.
- Replace placeholder testimonials with real ones.
- Integrate forms with a backend service like Formspree or Netlify Forms.
- Add Google Analytics or Facebook Pixel in the `<head>`.

## Deployment

Upload all files to a web server. Ensure the directory structure is maintained.

## Portal user administration

The portal Users page uses a protected Supabase Edge Function; the service-role/secret key stays on the server and is never placed in browser code.

1. Link the Supabase CLI to the existing project and apply the database migration:

   ```text
   supabase link --project-ref ogwfsagyvcckyihcjqdb
   supabase db push
   ```

2. Add the portal sign-in page to Supabase Auth's allowed redirect URLs:

   ```text
   https://wecleardebt.co.za/portal/login.html
   ```

   Configure Supabase Auth email delivery (SMTP) so new-user invitations can be sent.

3. Configure the authorized administrator and invitation redirect, then deploy the function:

   ```text
   supabase secrets set PORTAL_ADMIN_EMAILS=wecleardebtsocials@gmail.com PORTAL_INVITE_REDIRECT_URL=https://wecleardebt.co.za/portal/login.html
   supabase functions deploy portal-user-admin
   ```

Only the configured administrator email can list, invite, update, activate/deactivate, or manage time entries for portal users. Do not copy a Supabase service-role/secret key into the website.

The configured administrator must already have a Supabase Auth account. New users receive an invitation and choose their portal password on the sign-in page. Time-sheet clock-in and clock-out actions are performed by the administrator for the selected user.
# SimulaQ — Startup Landing

Deep-tech landing page for SimulaQ.

## Deploy

1. Create a new GitHub repo, e.g. `simulaq-web`.
2. Push the contents of this folder to the `main` branch.
3. **Settings → Pages** → Source: `main` / root → **Save**.
4. Add a CNAME record in Cloudflare:
   - **Name:** `simulaq`
   - **Target:** `<your-username>.github.io`
   - **Proxy:** DNS only (gray cloud) until SSL provisions, then orange.
5. In **Settings → Pages → Custom domain**, enter `simulaq.aadityarajyadav.com.np` and enable HTTPS.

## Customize

- Replace `simulation-plot.png` with your actual Gross-Pitaevskii / vortex plot.
- Edit copy in `index.html`.
- Tweak colors in `:root` of `styles.css`.

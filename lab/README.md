# Lab — Research Page

Research-style page for Aaditya Raj Yadav. KaTeX renders equations client-side from CDN.

## Deploy

1. Create a repo, e.g. `lab-web`.
2. Push this folder to `main`.
3. **Settings → Pages** → Source: `main` / root → **Save**.
4. Cloudflare DNS → CNAME: `lab` → `<username>.github.io` (DNS only at first).
5. **Settings → Pages → Custom domain** → `lab.aadityarajyadav.com.np` → enable HTTPS.

## Customize

- Add real plots to `./figures/` and replace each `<div class="thumb"></div>` with `<img src="figures/spectrum.png" alt="...">`.
- Add a real `cv.pdf` in this folder.
- Edit research entries in `index.html`.

## Equations

Use `$...$` for inline and `$$...$$` for display math — KaTeX auto-renders on load.

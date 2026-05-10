# aadityarajyadav.com.np — three sites, one repo

A monorepo for three independent static sites, each deployed to its own
GitHub Pages repository via a single GitHub Actions workflow.

| Folder      | Purpose          | Domain                                 | Pages repo                                |
| ----------- | ---------------- | -------------------------------------- | ----------------------------------------- |
| `home/`     | Apex landing     | `aadityarajyadav.com.np`               | `yadavaaditya06/yadavaaditya06.github.io` |
| `simulaq/`  | Startup landing  | `simulaq.aadityarajyadav.com.np`       | `yadavaaditya06/simulaq-web`              |
| `lab/`      | Research page    | `lab.aadityarajyadav.com.np`           | `yadavaaditya06/lab-web`                  |
| `blog/`     | Long-form notes  | `blog.aadityarajyadav.com.np`          | `yadavaaditya06/blog-web`                 |

## How it works

Source lives here in `yadavaaditya06/website`. On every push to `main`,
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) detects which
of `simulaq/`, `lab/`, `blog/` changed and force-pushes that subfolder to
the corresponding `*-web` repo's `main` branch using
[`peaceiris/actions-gh-pages`](https://github.com/peaceiris/actions-gh-pages).
GitHub Pages serves each `*-web` repo at its custom subdomain.

```    push to main
├── home/     ─┐                              │
├── simulaq/  ─┤                              │
├── lab/      ─┼──── deploy.yml ──────────────┤
└── blog/     ─┘                              │
                                              ▼
              yadavaaditya06.github.io ──► aadityarajyadav.com.np
              simulaq-web              ──► simulaq.aadityarajyadav.com.np
              lab-web                  ──► lab.aadityarajyadav.com.np
              blog-web                 ──► lab.aadityarajyadav.com.np
                       blog-web    ──► blog.aadityarajyadav.com.np
```

## Local preview

From inside any folder:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## One-time deployGitHub repos

```bash
gh repo create yadavaaditya06/website                  --public --source=. --remote=origin --push
gh repo create yadavaaditya06/yadavaaditya06.github.io --public  # apex landing target
gh repo create yadavaaditya06/simulaq-web              --public
gh repo create yadavaaditya06/lab-web                  --public
gh repo create yadavaaditya06/blog-web                 --public
```

### 2. Create a deploy token

Generate a Personal Access Token (classic) with `repo` scope, or a
fine-grained PAT with `Contents: write` on the four target repos
(`yadavaaditya06.github.io`, `simulaq-web`, `lab-web`, `blog-web`)
Generate a Personal Access Token (classic) with `repo` scope, or a
fine-grained PAT with `Contents: write` on the three `*-web` repos:

  https://github.com/settings/tokens

Add it to the **source** repo as a secret named `DEPLOY_TOKEN`:

```bash
gh secret set DEPLOY_TOKEN --repo yadavaaditya06/website
```

### 3. Trigger the first deploy

```bash
git push origin main
### 4. Enable Pages on each target repo

For each of `yadavaaditya06.github.io`, `simulaq-web`, `lab-web`, `blog-web`:

  **Settings → Pages** → Source: `Deploy from a branch`, Branch: `main` / `/ (root)` → **Save**

The CNAME file is published by the workflow, so the custom domain field
should fill in automatically. Tick **Enforce HTTPS** once it appears.

### 5. Cloudflare DNS

The apex needs A records (CNAMEs aren&rsquo;t allowed at the apex on most DNS providers).
The subdomains use CNAMEs.

| Type  | Name      | Target                       | Proxy     |
| ----- | --------- | ---------------------------- | --------- |
| A     | `@`       | `185.199.108.153`            | DNS only* |
| A     | `@`       | `185.199.109.153`            | DNS only* |
| A     | `@`       | `185.199.110.153`            | DNS only* |
| A     | `@`       | `185.199.111.153`            | DNS only* |
### 5. Cloudflare DNS (once per subdomain)

| Type  | Name      | Target                       | Proxy     |
| ----- | --------- | ---------------------------- | --------- |
| CNAME | `simulaq` | `yadavaaditya06.github.io`   | DNS only* |
| CNAME | `lab`     | `yadavaaditya06.github.io`   | DNS only* |
| CNAME | `blog`    | `yadavaaditya06.github.io`   | DNS only* |

\* Keep DNS-only (gray cloud) until GitHub provisions SSL (~10 min). Then
you can switch to proxied (orange cloud) if you want Cloudflare's CDN/WAF.

## Day-to-day workflow

```bash
# edit any file under simulaq/, lab/, or blog/
git add -A && git commit -m "lab: add vortex-lattice figure"
git push
# the workflow only redeploys the site whose folder changed
```

To force-rebuild every site (e.g. after fixing the workflow itself):

```bash
gh home/`: add a profile photo, latest post highlight, maybe a "now" section.
- `workflow run deploy.yml --repo yadavaaditya06/website
```

## Notes

- `.nojekyll` is included in each folder so Pages serves files as-is.
- KaTeX is loaded from CDN in `lab/` and `blog/posts/*.html` — no build step.
- The three sites cross-link in nav and footer so they feel like one ecosystem.

## TODO

- `simulaq/`: drop a real `simulation-plot.png` next to `index.html`.
- `lab/`: replace gallery `.thumb` divs with real `<img>` tags into `lab/figures/`; add `cv.pdf`.
- `blog/`: write more posts (use `posts/entropy-in-afno.html` as template); add `feed.xml`.

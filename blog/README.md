# Blog — Notes

Minimal serif blog. Light by default, dark via `prefers-color-scheme`.

## Structure

```
blog/
├── index.html         # post list
├── styles.css
├── posts/
│   └── entropy-in-afno.html  # sample post (KaTeX equations)
└── CNAME              # blog.aadityarajyadav.com.np
```

## Add a new post

1. Copy `posts/entropy-in-afno.html` to `posts/your-slug.html`.
2. Edit the `<title>`, `<time>`, `<h1>`, and body.
3. Add a new `<li class="post-item">` to `index.html` linking to it.

## Deploy

1. Push to a repo `blog-web`.
2. **Settings → Pages** → `main` / root.
3. Cloudflare CNAME: `blog` → `<username>.github.io`.
4. Custom domain: `blog.aadityarajyadav.com.np`.

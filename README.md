# FirstCommit Markdown Blog

A static HTML/CSS/JS blog that loads Markdown posts from `/posts/`.

## Add a post

Create a new file in `posts/`, for example:

`posts/my-new-post.md`

Use front matter:

```md
---
title: My New Post
date: 2026-08-20
author: Your Name
category: Building
description: A short description.
featured: false
---

# My New Post

Your Markdown content goes here.
```

The homepage automatically loads the post list from `posts/index.json`.

## Important: update posts/index.json

Because GitHub Pages/static hosting cannot list a directory at runtime, every new `.md` post must be added to `posts/index.json`.

Example:

```json
[
  "your-first-commit-doesnt-have-to-be-good.md",
  "building-something-small.md",
  "the-ugly-first-version.md"
]
```

## Run locally

Use a local server, not `file://`.

Python:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy

This is static and works on GitHub Pages, Vercel, Netlify, Cloudflare Pages, etc.

For GitHub Pages:
Settings → Pages → Deploy from branch → `main` → `/root`.

Custom domain:
`blog.firstcommit.xyz`

## Contribution & Contact
This page was developed by [Harshil Arora](https://harora.firstcommit.xyz). Please [contact me](mailto:harora@firstcommit.xyz) for questions or concerns.
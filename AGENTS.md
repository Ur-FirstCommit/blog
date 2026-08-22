# AGENTS.md

Static HTML/CSS/JS blog. No framework, no build step, no package.json, no lint/test tooling. Do not run `npm install`, bundlers, or test runners — there are none.

## Run locally
Never run locally or create servers, the user will and can do that manually.

## Adding or editing posts (the main gotcha)
- Posts live in `posts/*.md` with a hand-rolled YAML-ish front matter block (`title`, `date`, `author`, `category`, `description`, `featured`). See `README.md` for the exact format.
- Every new/renamed post MUST also be added to `posts/index.json` (an array of filenames). Static hosts can't list directories, so `js/app.js` reads the post list only from this file. A `.md` file not listed here is invisible to the site.
- Markdown is rendered at runtime by the `marked` library loaded from CDN — the site needs network access at runtime.

## Deploy
Static site; works on GitHub Pages / Vercel / Netlify / Cloudflare Pages. For GitHub Pages: Settings → Pages → Deploy from branch `main`, `/root`. Custom domain: `blog.firstcommit.xyz`.

## Editing notes
- All styling is in `css/style.css`. Be aware it is currently written as a single minified line — reformat locally before editing and avoid breaking rules.
- Theme (dark default / light via `body.light`) is toggled in `js/app.js` / `js/post.js` and persisted in `localStorage`; light mode overrides duplicate component selectors rather than using a full CSS-variable palette.
- Only `index.html` and `post.html` are real pages; article content is rendered dynamically by `js/post.js`.

## Protected files
Do not delete or restructure:
- posts/index.json
- js/app.js
- js/post.js
- css/style.css theme logic

Ask before changing the content loading system.

## Design goals
- Mobile-first responsive design
- Fast loading
- Accessible typography
- Clean reading experience for blog posts

## Updates
All updates must be made within the given git branch, you may not commit changes or change branches. If you are within the Default/Main branch, stop making changes and tell the user to create a branch.

## Change scope
Make the smallest changes necessary to complete the task.
Do not rewrite the entire website unless explicitly requested.

## Security
Never read, expose, or modify:
- .env files
- API keys
- credentials
- private tokens
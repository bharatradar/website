# bharatradar/website

<https://bharatradar.com>

> **Version:** 6.0.0

Plain HTML/CSS/JS static site. No build step, no dependencies.

## Structure

```
static-output/   ← All site files (HTML, CSS, JS, fonts, images)
Dockerfile       ← Single-stage nginx:alpine
favicon.ico      ← Site favicon
README.md        ← This file
```

## Edit the site

Just edit the HTML files in `static-output/` and commit. No build required.

## Deploy

```
git push origin main
```

The Dockerfile copies `static-output/` directly into nginx:alpine.

# I'm Sorry 🥺 — a small romantic website

A single-page apology story, built with plain HTML, CSS, and vanilla JS.
No frameworks, no backend, no database — just static files you can host
for free.

## 1. Add your own content

Drop these files in before you deploy:

```
images/apology.jpg    → ![alt text](image.png)
images/memory1.jpg    → "Your smile"
images/memory2.jpg    → "Our conversations"
images/memory3.jpg    → "The little things"
images/memory4.jpg    → "Us"
audio/our-song.mp3    → optional, for the "Play our song" button
```

If a file is missing, the page shows a soft placeholder instead of
breaking, so you can preview the site before the photos are ready.
The music button will quietly disable itself if `our-song.mp3` isn't
there.

Feel free to also personalize the copy in `index.html` — the letter on
page 4, the memory captions on page 3, and the funny messages in
`script.js` (search for `funnyMessages`).

## 2. Preview it locally

Just open `index.html` in a browser, or run a tiny local server so the
`onerror` image fallbacks and audio behave exactly like they will once
deployed:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## 3. Deploy for free

**GitHub Pages**
1. Push this folder to a new GitHub repo.
2. Repo → Settings → Pages → Deploy from branch → `main` / root.
3. Your site will be live at `https://<username>.github.io/<repo>/`.

**Netlify**
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag this whole folder onto the page.
3. Done — you'll get a live link immediately.

## What's inside

- `index.html` — all five "pages" as sections, shown/hidden with JS
  (no page reloads, so it works perfectly as a static site)
- `style.css` — the pink/cream glassmorphism look, floating hearts,
  and all animations
- `script.js` — page navigation, the runaway NO button on page 1,
  ambient hearts, the music toggle, and the finale heart burst

Everything is commented so you can tweak colors, timing, or copy
without needing to understand the whole file.

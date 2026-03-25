# Free Portfolio Website (runs locally)

This is a simple portfolio website (plain **HTML + CSS + JavaScript**) with:
- **Home** (short page)
- **Past projects** (separate page)
- **Current projects** (separate page)
- **Learning** (articles, separate page)
- **About** (separate page)

It’s designed so visitors can **scroll and see your images/videos embedded** (not just links).

## Run it right now (Windows)

### Option A (easiest): open the file
1. Open this folder: `portfolio-site`
2. Double‑click `index.html`

### Option B (recommended): run a tiny local server
This avoids any browser quirks and is closer to “real hosting”.

If you have Python:

```bash
cd "c:\Users\Hammad\Documents\portfolio-site"
python -m http.server 5500
```

Then open `http://localhost:5500`

If you have Node.js:

```bash
cd "c:\Users\Hammad\Documents\portfolio-site"
npx serve .
```

## Add your pictures and videos (embedded)

1. Put images in:
   - `assets/images/`
2. Put videos in:
   - `assets/videos/`
3. Open `content.js` and edit the `pastProjects` / `currentProjects` items.

### Example (add an image)
Put `my-build.jpg` in `assets/images/`, then in `content.js`:

```js
media: {
  images: [{ src: "./assets/images/my-build.jpg", alt: "My build" }],
  videos: []
}
```

### Example (add a video)
Put `demo.mp4` in `assets/videos/`, then:

```js
media: {
  images: [],
  videos: [{ src: "./assets/videos/demo.mp4", title: "Demo" }]
}
```

## Add your articles

Open `content.js` → `articles` and add a new item:

```js
{
  title: "My new post",
  date: "2026-03-25",
  tags: ["notes", "embedded"],
  body: [
    "Write paragraphs as strings.",
    "",
    "- Use '- ' for bullet lists",
    "- Use **bold** and `code`",
  ]
}
```

## Customize your name, links, and about section
Edit these in `content.js`:
- `profile.name`, `profile.subtitle`
- `profile.quickLinks`
- `about.bio`, `about.skills`, `about.contact`


(() => {
  const data = window.PORTFOLIO;
  if (!data) {
    document.body.innerHTML =
      "<div style='padding:20px;font-family:system-ui'>Missing <code>content.js</code>.</div>";
    return;
  }

  const $ = (id) => document.getElementById(id);

  // Random doodle background (1..5) each load (real SVG files)
  const BUILD = "20260325-1130";
  try {
    const n = 1 + Math.floor(Math.random() * 5);
    if (document?.body) {
      document.body.dataset.doodle = String(n);
      document.body.style.setProperty(
        "--doodle",
        `url("./assets/images/doodles/doodle-${n}.svg")`
      );

      // Visual proof that new JS loaded
      document.body.dataset.build = BUILD;
    }
  } catch {
    // ignore
  }

  const setText = (id, text) => {
    const el = $(id);
    if (el) el.textContent = text;
  };

  const escapeHtml = (s) =>
    String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  // Tiny markdown-ish renderer for articles:
  // - **bold**
  // - `code`
  // - bullet lists starting with "- "
  const renderBodyLines = (lines) => {
    const out = [];
    let inList = false;

    const flushList = () => {
      if (inList) out.push("</ul>");
      inList = false;
    };

    const inline = (text) => {
      let t = escapeHtml(text);
      t = t.replaceAll(/`([^`]+)`/g, "<code>$1</code>");
      t = t.replaceAll(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
      return t;
    };

    for (const raw of lines) {
      const line = raw ?? "";
      if (line.startsWith("- ")) {
        if (!inList) {
          out.push("<ul>");
          inList = true;
        }
        out.push(`<li>${inline(line.slice(2))}</li>`);
        continue;
      }

      if (line.trim() === "") {
        flushList();
        continue;
      }

      flushList();
      out.push(`<p>${inline(line)}</p>`);
    }

    flushList();
    return out.join("");
  };

  const renderMedia = (media) => {
    const images = media?.images ?? [];
    const videos = media?.videos ?? [];
    const has = images.length || videos.length;
    if (!has) return "";

    const items = [];
    for (const img of images) {
      if (!img?.src) continue;
      items.push(
        `<img loading="lazy" src="${escapeHtml(img.src)}" alt="${escapeHtml(
          img.alt ?? ""
        )}" />`
      );
    }
    for (const vid of videos) {
      if (!vid?.src) continue;
      items.push(
        `<video controls preload="metadata" src="${escapeHtml(vid.src)}" aria-label="${escapeHtml(
          vid.title ?? "video"
        )}"></video>`
      );
    }

    if (items.length === 1) {
      return `<div class="media">${items[0]}</div>`;
    }

    return `<div class="media"><div class="media-grid">${items
      .map((x) => `<div>${x}</div>`)
      .join("")}</div></div>`;
  };

  const pickFirstMedia = (media) => {
    const images = media?.images ?? [];
    const videos = media?.videos ?? [];
    const img = images.find((x) => x?.src);
    if (img) return { kind: "image", src: img.src, alt: img.alt ?? "" };
    const vid = videos.find((x) => x?.src);
    if (vid) return { kind: "video", src: vid.src, title: vid.title ?? "video" };
    return null;
  };

  const renderLinks = (links) => {
    const arr = (links ?? []).filter((l) => l?.label && l?.href);
    if (!arr.length) return "";
    return `<div class="links">${arr
      .map(
        (l) =>
          `<a href="${escapeHtml(l.href)}" target="_blank" rel="noreferrer">${escapeHtml(
            l.label
          )}</a>`
      )
      .join("")}</div>`;
  };

  const renderTags = (tags) => {
    const arr = (tags ?? []).filter(Boolean);
    if (!arr.length) return "";
    return `<div class="card-tags">${arr
      .map((t) => `<span class="tag">${escapeHtml(t)}</span>`)
      .join("")}</div>`;
  };

  const renderProjectCard = (p) => {
    return `
      <article class="card">
        ${renderMedia(p.media)}
        <div class="card-inner">
          <h3 class="card-title">${escapeHtml(p.title ?? "")}</h3>
          <p class="card-sub">${escapeHtml(p.summary ?? "")}</p>
          ${renderTags(p.tags)}
          ${renderLinks(p.links)}
        </div>
      </article>
    `;
  };

  const initHeader = () => {
    const profile = data.profile ?? {};
    setText("brandName", profile.name ?? "Portfolio");
    setText("brandSubtitle", profile.subtitle ?? "");
    setText("heroTitle", profile.heroTitle ?? "Hi.");
    setText("heroLead", profile.heroLead ?? "");

    const meta = (profile.meta ?? []).filter(Boolean);
    const metaEl = $("heroMeta");
    if (metaEl) {
      metaEl.innerHTML = meta
        .map((m) => `<span class="meta-item">${escapeHtml(m)}</span>`)
        .join("");
    }

    const quickLinks = (profile.quickLinks ?? []).filter((l) => l?.label && l?.href);
    const ql = $("quickLinks");
    if (ql) {
      ql.innerHTML = quickLinks
        .map(
          (l) =>
            `<a href="${escapeHtml(l.href)}" target="_blank" rel="noreferrer">${escapeHtml(
              l.label
            )}</a>`
        )
        .join("<br/>");
    }

    setText("year", String(new Date().getFullYear()));
    setText("footerName", profile.name ?? "Portfolio");
  };

  const initProjects = () => {
    const past = $("pastGrid");
    const current = $("currentGrid");

    const pastArr = data.pastProjects ?? [];
    const currentArr = data.currentProjects ?? [];

    if (past) past.innerHTML = pastArr.map(renderProjectCard).join("");
    if (current) current.innerHTML = currentArr.map(renderProjectCard).join("");

    // Home page highlights (keep home short)
    const homePast = $("homePastGrid");
    const homeCurrent = $("homeCurrentGrid");
    if (homePast) homePast.innerHTML = pastArr.slice(0, 2).map(renderProjectCard).join("");
    if (homeCurrent) homeCurrent.innerHTML = currentArr.slice(0, 2).map(renderProjectCard).join("");

    const allLatest = [
      ...currentArr.map((p) => ({ type: "Project (current)", title: p.title, tags: p.tags })),
      ...pastArr.map((p) => ({ type: "Project (past)", title: p.title, tags: p.tags })),
      ...((data.articles ?? []).map((a) => ({ type: "Article", title: a.title, tags: a.tags })) ?? []),
    ].filter((x) => x.title);

    const latest = allLatest.slice(0, 4);
    const lb = $("latestBlock");
    if (lb) {
      lb.innerHTML = latest
        .map((x) => {
          const tags = (x.tags ?? []).slice(0, 3).join(" · ");
          return `<div style="margin:8px 0"><div style="color:var(--text);font-weight:700">${escapeHtml(
            x.title
          )}</div><div style="font-size:13px">${escapeHtml(x.type)}${tags ? " · " + escapeHtml(tags) : ""}</div></div>`;
        })
        .join("");
    }
  };

  const initHomeCarousel = () => {
    const track = $("homeCarouselTrack");
    const dots = $("carouselDots");
    const prevBtn = $("carouselPrev");
    const nextBtn = $("carouselNext");
    if (!track || !dots || !prevBtn || !nextBtn) return;

    const slides = [];

    for (const p of data.pastProjects ?? []) {
      const media = pickFirstMedia(p.media);
      if (!media) continue;
      slides.push({
        type: "Past project",
        title: p.title ?? "",
        href: "./past-projects.html",
        media,
      });
    }

    for (const p of data.currentProjects ?? []) {
      const media = pickFirstMedia(p.media);
      if (!media) continue;
      slides.push({
        type: "Current project",
        title: p.title ?? "",
        href: "./current-projects.html",
        media,
      });
    }

    for (const a of data.articles ?? []) {
      const cover = a?.cover?.src
        ? { kind: "image", src: a.cover.src, alt: a.cover.alt ?? a.title ?? "" }
        : null;
      if (!cover) continue;
      slides.push({
        type: "Learning",
        title: a.title ?? "",
        href: "./learning.html",
        media: cover,
      });
    }

  
  // Keep it lightweight and short
    const finalSlides = slides.slice(0, 12);

    if (!finalSlides.length) {
      track.innerHTML =
        `<div class="slide"><div class="slide-info"><div><h3 class="slide-title">Add media to see highlights</h3></div><div class="slide-type">Edit content.js</div></div></div>`;
      dots.innerHTML = "";
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      return;
    }

    track.innerHTML = finalSlides
      .map((s) => {
        const mediaHtml =
          s.media.kind === "video"
            ? `<video autoplay muted loop playsinline src="${escapeHtml(s.media.src)}" aria-label="${escapeHtml(
                s.media.title ?? "video"
              )}"></video>`
            : `<img loading="lazy" src="${escapeHtml(s.media.src)}" alt="${escapeHtml(
                s.media.alt ?? ""
              )}" />`;

        return `
          <article class="slide">
            <a class="slide-media" href="${escapeHtml(s.href)}" aria-label="${escapeHtml(
          s.type + ": " + s.title
        )}">
              ${mediaHtml}
            </a>
            <div class="slide-info">
              <h3 class="slide-title">${escapeHtml(s.title)}</h3>
              <div class="slide-type">${escapeHtml(s.type)}</div>
            </div>
          </article>
        `;
      })
      .join("");

    let idx = 0;

    const renderDots = () => {
      dots.innerHTML = finalSlides
        .map((_, i) => `<span class="dot ${i === idx ? "active" : ""}" aria-hidden="true"></span>`)
        .join("");
    };

    const go = (next) => {
      idx = (next + finalSlides.length) % finalSlides.length;
      track.style.transform = `translateX(${-idx * 100}%)`;
      renderDots();
    };

    prevBtn.addEventListener("click", () => go(idx - 1));
    nextBtn.addEventListener("click", () => go(idx + 1));

    // simple auto-advance, no heavy transitions
    const intervalMs = 3500;
    let timerId = window.setInterval(() => go(idx + 1), intervalMs);
    const pause = () => {
      if (timerId) window.clearInterval(timerId);
      timerId = 0;
    };
    const resume = () => {
      if (!timerId) timerId = window.setInterval(() => go(idx + 1), intervalMs);
    };

    const carousel = track.closest(".carousel");
    (carousel ?? track).addEventListener("mouseenter", pause);
    (carousel ?? track).addEventListener("mouseleave", resume);
    prevBtn.addEventListener("click", pause);
    nextBtn.addEventListener("click", pause);
    prevBtn.addEventListener("blur", resume);
    nextBtn.addEventListener("blur", resume);

    renderDots();
    go(0);
  };
  // Initialize second carousel
const initSecondCarousel = () => {
  const track = document.getElementById("secondCarouselTrack");
  const dots = document.getElementById("secondCarouselDots");
  const prevBtn = document.getElementById("secondCarouselPrev");
  const nextBtn = document.getElementById("secondCarouselNext");
  if (!track || !dots || !prevBtn || !nextBtn) return;

  // Create slides for second carousel (you can customize these)
  const slides = [];
  
  // Add your past projects
  for (const p of data.pastProjects ?? []) {
    const media = pickFirstMedia(p.media);
    if (!media) continue;
    slides.push({
      type: "Past Project",
      title: p.title ?? "",
      href: "./past-projects.html",
      media,
    });
  }

  const finalSlides = slides.slice(0, 4);

  if (!finalSlides.length) {
    track.innerHTML = `<div class="slide"><div class="slide-info"><div><h3 class="slide-title">Add projects to see more</h3></div><div class="slide-type">Edit content.js</div></div></div>`;
    dots.innerHTML = "";
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    return;
  }

  track.innerHTML = finalSlides
    .map((s) => {
      const mediaHtml =
        s.media.kind === "video"
          ? `<video controls preload="metadata" autoplay muted loop playsinline src="${escapeHtml(s.media.src)}" aria-label="${escapeHtml(
              s.media.title ?? "video"
            )}"></video>`
          : `<img loading="lazy" src="${escapeHtml(s.media.src)}" alt="${escapeHtml(
              s.media.alt ?? ""
            )}" />`;

      return `
        <article class="slide">
          <a class="slide-media" href="${escapeHtml(s.href)}" aria-label="${escapeHtml(
        s.type + ": " + s.title
      )}">
            ${mediaHtml}
          </a>
          <div class="slide-info">
            <h3 class="slide-title">${escapeHtml(s.title)}</h3>
            <div class="slide-type">${escapeHtml(s.type)}</div>
          </div>
        </article>
      `;
    })
    .join("");

  let idx = 0;

  const renderDots = () => {
    dots.innerHTML = finalSlides
      .map((_, i) => `<span class="dot ${i === idx ? "active" : ""}" aria-hidden="true"></span>`)
      .join("");
  };

  const go = (next) => {
    idx = (next + finalSlides.length) % finalSlides.length;
    track.style.transform = `translateX(${-idx * 100}%)`;
    renderDots();
  };

  prevBtn.addEventListener("click", () => go(idx - 1));
  nextBtn.addEventListener("click", () => go(idx + 1));

  const intervalMs = 3500;
  let timerId = window.setInterval(() => go(idx + 1), intervalMs);
  const pause = () => {
    if (timerId) window.clearInterval(timerId);
    timerId = 0;
  };
  const resume = () => {
    if (!timerId) timerId = window.setInterval(() => go(idx + 1), intervalMs);
  };

  const carousel = track.closest(".carousel");
  (carousel ?? track).addEventListener("mouseenter", pause);
  (carousel ?? track).addEventListener("mouseleave", resume);
  prevBtn.addEventListener("click", pause);
  nextBtn.addEventListener("click", pause);
  prevBtn.addEventListener("blur", resume);
  nextBtn.addEventListener("blur", resume);

  renderDots();
  go(0);
};

// Call the second carousel
initSecondCarousel();

  const initAbout = () => {
    const about = data.about ?? {};
    const bioEl = $("aboutBio");
    if (bioEl) {
      const bio = (about.bio ?? []).filter(Boolean);
      bioEl.innerHTML = bio.map((p) => `<p class="muted">${escapeHtml(p)}</p>`).join("");
    }

    const skillsEl = $("aboutSkills");
    if (skillsEl) {
      const skills = (about.skills ?? []).filter(Boolean);
      skillsEl.innerHTML = skills.map((s) => `<li>${escapeHtml(s)}</li>`).join("");
    }

    const contactEl = $("aboutContact");
    if (contactEl) {
      const contact = (about.contact ?? []).filter((c) => c?.label && c?.href);
      contactEl.innerHTML = contact
        .map(
          (c) =>
            `<div><a href="${escapeHtml(c.href)}" target="_blank" rel="noreferrer">${escapeHtml(
              c.label
            )}</a></div>`
        )
        .join("");
    }
  };

  const initArticles = () => {
    const all = (data.articles ?? []).map((a, idx) => ({ ...a, _id: String(idx) }));
    const listEl = $("articlesList");
    const searchEl = $("articleSearch");
    const chipsEl = $("tagChips");

    const tags = Array.from(
      new Set(all.flatMap((a) => (a.tags ?? []).map((t) => String(t).toLowerCase().trim())).filter(Boolean))
    ).sort();

    let activeTag = "";
    let q = "";

    const renderChips = () => {
      if (!chipsEl) return;
      const chip = (label, value) => `
        <button class="chip" type="button" aria-pressed="${activeTag === value ? "true" : "false"}" data-tag="${escapeHtml(
        value
      )}">
          ${escapeHtml(label)}
        </button>
      `;
      chipsEl.innerHTML = [
        chip("All", ""),
        ...tags.map((t) => chip(t, t)),
      ].join("");

      chipsEl.querySelectorAll("button[data-tag]").forEach((btn) => {
        btn.addEventListener("click", () => {
          activeTag = btn.getAttribute("data-tag") ?? "";
          render();
          renderChips();
        });
      });
    };

    const render = () => {
      if (!listEl) return;
      const filtered = all.filter((a) => {
        const text = `${a.title ?? ""} ${(a.body ?? []).join(" ")} ${(a.tags ?? []).join(" ")}`.toLowerCase();
        if (q && !text.includes(q)) return false;
        if (activeTag) {
          const at = (a.tags ?? []).map((t) => String(t).toLowerCase().trim());
          if (!at.includes(activeTag)) return false;
        }
        return true;
      });

      if (!filtered.length) {
        listEl.innerHTML =
          `<div class="muted" style="grid-column: span 12; padding: 10px 0;">No matching articles.</div>`;
        return;
      }

      listEl.innerHTML = filtered
        .map((a) => {
          const date = a.date ? String(a.date) : "";
          const body = renderBodyLines(a.body ?? []);
          const tags = renderTags(a.tags ?? []);
          const cover = a?.cover?.src
            ? `<div class="media"><img loading="lazy" src="${escapeHtml(a.cover.src)}" alt="${escapeHtml(
                a.cover.alt ?? a.title ?? ""
              )}" /></div>`
            : "";
          return `
            <article class="article">
              ${cover}
              <div class="article-head">
                <h3 class="article-title">${escapeHtml(a.title ?? "")}</h3>
                <div class="article-date">${escapeHtml(date)}</div>
              </div>
              <div class="article-body">
                ${tags}
                ${body}
              </div>
            </article>
          `;
        })
        .join("");
    };

    if (searchEl) {
      searchEl.addEventListener("input", (e) => {
        q = String(e.target?.value ?? "").toLowerCase().trim();
        render();
      });
    }

    renderChips();
    render();
  };

  const page = document.body?.dataset?.page ?? "home";

  initHeader();
  // Projects are needed on home + project pages (and for "Latest" block)
  initProjects();

  if (page === "home") initHomeCarousel();
    if (page === "learning") initArticles();
  if (page === "about") initAbout();
  
  // Initialize second carousel if on home page
  if (page === "home") {
    const initSecondCarousel = () => {
      const track = document.getElementById("secondCarouselTrack");
      const dots = document.getElementById("secondCarouselDots");
      const prevBtn = document.getElementById("secondCarouselPrev");
      const nextBtn = document.getElementById("secondCarouselNext");
      if (!track || !dots || !prevBtn || !nextBtn) return;

      const slides = [];
      
      for (const p of data.pastProjects ?? []) {
        const media = (() => {
          const images = p.media?.images ?? [];
          const videos = p.media?.videos ?? [];
          const img = images.find((x) => x?.src);
          if (img) return { kind: "image", src: img.src, alt: img.alt ?? "" };
          const vid = videos.find((x) => x?.src);
          if (vid) return { kind: "video", src: vid.src, title: vid.title ?? "video" };
          return null;
        })();
        if (!media) continue;
        slides.push({
          type: "Past Project",
          title: p.title ?? "",
          href: "./past-projects.html",
          media,
        });
      }

      const finalSlides = slides.slice(0, 4);

      if (!finalSlides.length) {
        track.innerHTML = `<div class="slide"><div class="slide-info"><div><h3 class="slide-title">Add projects to see more</h3></div><div class="slide-type">Edit content.js</div></div></div>`;
        dots.innerHTML = "";
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        return;
      }

      track.innerHTML = finalSlides
        .map((s) => {
          const mediaHtml =
            s.media.kind === "video"
              ? `<video controls preload="metadata" autoplay muted loop playsinline src="${s.media.src}" aria-label="${s.media.title ?? "video"}"></video>`
              : `<img loading="lazy" src="${s.media.src}" alt="${s.media.alt ?? ""}" />`;

          return `
            <article class="slide">
              <a class="slide-media" href="${s.href}" aria-label="${s.type + ": " + s.title}">
                ${mediaHtml}
              </a>
              <div class="slide-info">
                <h3 class="slide-title">${s.title}</h3>
                <div class="slide-type">${s.type}</div>
              </div>
            </article>
          `;
        })
        .join("");

      let idx = 0;

      const renderDots = () => {
        dots.innerHTML = finalSlides
          .map((_, i) => `<span class="dot ${i === idx ? "active" : ""}" aria-hidden="true"></span>`)
          .join("");
      };

      const go = (next) => {
        idx = (next + finalSlides.length) % finalSlides.length;
        track.style.transform = `translateX(${-idx * 100}%)`;
        renderDots();
      };

      prevBtn.addEventListener("click", () => go(idx - 1));
      nextBtn.addEventListener("click", () => go(idx + 1));

      const intervalMs = 3500;
      let timerId = window.setInterval(() => go(idx + 1), intervalMs);
      const pause = () => {
        if (timerId) window.clearInterval(timerId);
        timerId = 0;
      };
      const resume = () => {
        if (!timerId) timerId = window.setInterval(() => go(idx + 1), intervalMs);
      };

      const carousel = track.closest(".carousel");
      (carousel ?? track).addEventListener("mouseenter", pause);
      (carousel ?? track).addEventListener("mouseleave", resume);
      prevBtn.addEventListener("click", pause);
      nextBtn.addEventListener("click", pause);
      prevBtn.addEventListener("blur", resume);
      nextBtn.addEventListener("blur", resume);

      renderDots();
      go(0);
    };
    
    initSecondCarousel();
  }
})();

(() => {
  const data = window.PORTFOLIO;
  if (!data) return;

  const $ = (id) => document.getElementById(id);

  const initCarousel = (trackId, dotsId, items) => {
    const track = $(trackId);
    const dotsContainer = $(dotsId);
    if (!track || !items || items.length === 0) return;

    const limitedItems = items.slice(0, 4);

    track.innerHTML = limitedItems.map(item => {
      const img = item.media?.images?.[0]?.src || item.cover?.src || './assets/images/placeholder.svg';
      return `
        <div class="slide">
          <img src="${img}" alt="${item.title}">
          <div class="slide-info">${item.title}</div>
        </div>
      `;
    }).join('');

    dotsContainer.innerHTML = limitedItems.map((_, i) => `<div class="dot ${i === 0 ? 'active' : ''}"></div>`).join('');

    let current = 0;
    setInterval(() => {
      current = (current + 1) % limitedItems.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      Array.from(dotsContainer.children).forEach((d, i) => d.classList.toggle('active', i === current));
    }, 4000);
  };

  // Initialize
  const yearEl = $('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  if (document.body.dataset.page === 'home') {
    initCarousel('homeCarouselTrack', 'carouselDots', data.pastProjects);
    initCarousel('learningCarouselTrack', 'learningDots', data.articles);
  }
})();

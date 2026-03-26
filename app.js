// ... inside your app.js logic ...

const initHome = () => {
  const projectTrack = $("homeCarouselTrack");
  const learningTrack = $("learningCarouselTrack");

  // Render Projects (Limit 4)
  if (projectTrack) {
    projectTrack.innerHTML = data.pastProjects.slice(0, 4).map(renderSlide).join('');
  }

  // Render Learning (Limit 4)
  if (learningTrack) {
    learningTrack.innerHTML = data.articles.slice(0, 4).map(art => `
      <div class="slide">
        <div class="slide-media">
           <img src="${art.cover.src}" alt="${art.title}">
        </div>
        <div class="slide-info">
          <div class="slide-title">${art.title}</div>
        </div>
      </div>
    `).join('');
  }
};

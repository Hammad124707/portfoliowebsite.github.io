/**
 * HAMMAD PORTFOLIO ENGINE
 * Properly checked for errors.
 */
(function() {
    const data = window.PORTFOLIO;
    
    // Safety check: Is content.js loaded?
    if (!data) {
        console.error("Portfolio data not found. Ensure content.js is loaded correctly.");
        return;
    }

    const $ = (id) => document.getElementById(id);

    const setupCarousel = (trackId, dotsId, sourceArray) => {
        const track = $(trackId);
        const dotsContainer = $(dotsId);
        
        if (!track || !sourceArray || sourceArray.length === 0) return;

        // Limit to 4 slides max
        const items = sourceArray.slice(0, 4);

        // 1. Generate Slides
        track.innerHTML = items.map(item => {
            const imgSrc = item.media?.images?.[0]?.src || item.cover?.src || '';
            return `
                <div class="slide">
                    <img src="${imgSrc}" alt="${item.title}" onerror="this.src='https://via.placeholder.com/400x220?text=Image+Not+Found'">
                    <div class="slide-info">${item.title}</div>
                </div>
            `;
        }).join('');

        // 2. Generate Dots
        if (dotsContainer) {
            dotsContainer.innerHTML = items.map((_, i) => `<div class="dot ${i === 0 ? 'active' : ''}"></div>`).join('');
        }

        // 3. Animation Logic
        let index = 0;
        setInterval(() => {
            index = (index + 1) % items.length;
            track.style.transform = `translateX(-${index * 100}%)`;
            
            if (dotsContainer) {
                const dots = dotsContainer.querySelectorAll('.dot');
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === index);
                });
            }
        }, 4000);
    };

    // Main Init
    document.addEventListener('DOMContentLoaded', () => {
        // Update Year
        const yearSpan = $('year');
        if (yearSpan) yearSpan.textContent = new Date().getFullYear();

        // Run Carousels on Home Page
        if (document.body.dataset.page === 'home') {
            setupCarousel('projectTrack', 'projectDots', data.pastProjects);
            setupCarousel('learningTrack', 'learningDots', data.articles);
        }
    });
})();

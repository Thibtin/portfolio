// ---------- project detail modal ----------
// Exposes window.openProjectModal(index) which any project card (tower or
// mobile) can call to show the full detail view for PROJECTS[index].
(function initProjectModal() {
  const overlay = document.createElement('div');
  overlay.className = 'proj-modal-overlay';
  overlay.innerHTML = `
    <div class="proj-modal" role="dialog" aria-modal="true">
      <button class="proj-modal-close" aria-label="Fermer">&times;</button>
      <div class="proj-modal-idx" id="pmIdx"></div>
      <h3 class="proj-modal-title" id="pmTitle"></h3>
      <div class="proj-modal-tags" id="pmTags"></div>
      <p class="proj-modal-desc" id="pmDesc"></p>
      <div class="proj-modal-carousel" id="pmCarousel">
        <div class="proj-modal-carousel-viewport" id="pmViewport">
          <button class="proj-modal-carousel-btn prev" aria-label="Image précédente">&#10094;</button>
          <button class="proj-modal-carousel-btn next" aria-label="Image suivante">&#10095;</button>
        </div>
        <div class="proj-modal-carousel-caption" id="pmCaption"></div>
        <div class="proj-modal-carousel-dots" id="pmDots"></div>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  const modal = overlay.querySelector('.proj-modal');
  const closeBtn = overlay.querySelector('.proj-modal-close');
  const idxEl = overlay.querySelector('#pmIdx');
  const titleEl = overlay.querySelector('#pmTitle');
  const tagsEl = overlay.querySelector('#pmTags');
  const descEl = overlay.querySelector('#pmDesc');
  const carouselEl = overlay.querySelector('#pmCarousel');
  const viewport = overlay.querySelector('#pmViewport');
  const captionEl = overlay.querySelector('#pmCaption');
  const dotsEl = overlay.querySelector('#pmDots');
  const prevBtn = overlay.querySelector('.proj-modal-carousel-btn.prev');
  const nextBtn = overlay.querySelector('.proj-modal-carousel-btn.next');

  let images = [];
  let current = 0;

  function renderSlide() {
    viewport.querySelectorAll('img').forEach((img, i) => {
      img.classList.toggle('active', i === current);
    });
    dotsEl.querySelectorAll('span').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
    captionEl.textContent = images[current] ? images[current].caption || '' : '';
  }

  function goTo(i) {
    if (!images.length) return;
    current = (i + images.length) % images.length;
    renderSlide();
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  function open(index) {
    const p = PROJECTS[index];
    if (!p) return;
    current = 0;
    images = (p.detail && p.detail.images) || [];

    idxEl.textContent = `PROJET 0${index + 1} / 0${PROJECTS.length}`;
    titleEl.textContent = p.title;
    tagsEl.innerHTML = p.tags.map(t => `<span class="tag">${t}</span>`).join('');
    descEl.textContent = (p.detail && p.detail.description) || p.desc;

    // rebuild carousel images
    viewport.querySelectorAll('img').forEach(img => img.remove());
    images.forEach((im, i) => {
      const img = document.createElement('img');
      img.src = im.src;
      img.alt = im.caption || p.title;
      viewport.insertBefore(img, prevBtn);
    });
    dotsEl.innerHTML = images.map((_, i) => `<span data-i="${i}"></span>`).join('');
    dotsEl.querySelectorAll('span').forEach(d => {
      d.addEventListener('click', () => goTo(parseInt(d.dataset.i, 10)));
    });

    carouselEl.style.display = images.length ? '' : 'none';
    renderSlide();

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    modal.scrollTop = 0;
  }

  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') goTo(current + 1);
    if (e.key === 'ArrowLeft') goTo(current - 1);
  });

  window.openProjectModal = open;
})();

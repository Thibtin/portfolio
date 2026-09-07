// ---------- 3D project tower (scroll-driven) ----------
// Depends on the global PROJECTS array defined in data.js (load that file first).
(function initTower(){
  const wrap = document.getElementById('towerWrap');
  const group = document.getElementById('towerGroup');
  const dotsEl = document.getElementById('towerDots');
  const mobileList = document.getElementById('projMobileList');
  const stage = document.querySelector('.tower-stage');
  const netSvg = document.getElementById('towerNet');
  if(!wrap || !group) return;

  const N = PROJECTS.length;
  const STEP_ANGLE = 360 / N;     // degrees between cards around the tower
  const RADIUS = 540;             // px, circle radius
  const SPACING = 300;            // px vertical spacing between card levels
  const TOTAL_ROT = (N - 1) * STEP_ANGLE;
  const TOTAL_LIFT = (N - 1) * SPACING;

  // brisk scroll pace: enough vh per card to register, not a slog — scales
  // with card count instead of a fixed (and, with more cards, sluggish) total
  wrap.style.height = ((N - 1) * 34 + 120) + 'vh';

  // build cards — full content lives inside each one
  const cardEls = PROJECTS.map((p, i) => {
    const el = document.createElement('div');
    el.className = 'tower-card';
    const angle = i * STEP_ANGLE;
    el.dataset.angle = angle;
    el.style.transform = `translateY(${i * SPACING}px) rotateY(${angle}deg) translateZ(${RADIUS}px)`;
    el.innerHTML = `
      <div class="face">
        <div class="thumb-row">
          <div class="t">${p.title}</div>
          <img class="thumb" src="${p.cover || ''}" alt="${p.title}" loading="lazy">
        </div>
        <p class="d">${p.desc}</p>
        <div class="tagrow">${p.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
      </div>`;
    el.querySelector('.face').addEventListener('click', () => {
      if (typeof window.openProjectModal === 'function') window.openProjectModal(i);
    });
    group.appendChild(el);
    return el;
  });

  // dots
  PROJECTS.forEach((_, i) => {
    const d = document.createElement('span');
    d.className = 'dot2' + (i === 0 ? ' active' : '');
    dotsEl.appendChild(d);
  });
  const dotEls = dotsEl.querySelectorAll('.dot2');

  // ambient anchor points — invisible, live in the same rotating 3D group as
  // the cards, purely to give the neural net many more nodes/lines to draw
  const AMBIENT_COUNT = 130;
  const ambientEls = [];
  for (let i = 0; i < AMBIENT_COUNT; i++) {
    const el = document.createElement('div');
    el.className = 'tower-anchor';
    const a = Math.random() * 360;
    const r = RADIUS * (0.55 + Math.random() * 0.75);
    const y = -SPACING * 0.6 + Math.random() * (TOTAL_LIFT + SPACING * 1.2);
    el.style.transform = `translateY(${y}px) rotateY(${a}deg) translateZ(${r}px)`;
    group.appendChild(el);
    ambientEls.push(el);
  }

  // mobile fallback list
  PROJECTS.forEach((p, i) => {
    const c = document.createElement('div');
    c.className = 'proj-card-m';
    c.innerHTML = `<div class="thumb-row">
        <h3>${p.title}</h3>
        <img class="thumb" src="${p.cover || ''}" alt="${p.title}" loading="lazy">
      </div>
      <p>${p.desc}</p>
      <div class="tagrow">${p.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>`;
    c.addEventListener('click', () => {
      if (typeof window.openProjectModal === 'function') window.openProjectModal(i);
    });
    mobileList.appendChild(c);
  });

  // ---- neural network overlay ----
  netSvg.innerHTML = `
    <defs>
      <linearGradient id="netGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#5EEAD4"/>
        <stop offset="100%" stop-color="#A78BFA"/>
      </linearGradient>
      <filter id="netGlow" x="-200%" y="-200%" width="500%" height="500%">
        <feGaussianBlur stdDeviation="3.2" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>`;
  const svgNS = 'http://www.w3.org/2000/svg';
  function makeEl(tag, cls){ const e = document.createElementNS(svgNS, tag); if(cls) e.setAttribute('class', cls); return e; }

  // primary mesh: every card connects to every other card (bright, glowing)
  const pairs = [];
  for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) pairs.push([i, j]);
  const meshLinks = pairs.map(([i, j]) => {
    const adjacent = (j - i === 1);
    const l = makeEl('line', adjacent ? 'link' : 'link mesh');
    if (adjacent) l.setAttribute('filter', 'url(#netGlow)');
    netSvg.appendChild(l);
    return l;
  });
  const relayNodes = pairs.map(() => { const c = makeEl('circle', 'relay'); c.setAttribute('r', '1.6'); c.setAttribute('fill', '#5EEAD4'); netSvg.appendChild(c); return c; });
  const cardNodes = cardEls.map(() => { const c = makeEl('circle','node'); c.setAttribute('filter','url(#netGlow)'); netSvg.appendChild(c); return c; });

  // dense ambient mesh: a k-nearest-neighbor graph across card nodes + all
  // ambient anchors, recomputed every frame from live 2D positions — this is
  // what gives the tower its dense, always-shifting web of connections
  const AMB_K = 7;
  const POOL_SIZE = 780;
  const ambLinkPool = Array.from({length: POOL_SIZE}, () => { const l = makeEl('line','amb'); netSvg.appendChild(l); return l; });
  const ambNodeDots = ambientEls.map(() => { const c = makeEl('circle','ambnode'); c.setAttribute('r','1.3'); netSvg.appendChild(c); return c; });

  const activeOverlay = document.getElementById('towerActiveOverlay');
  const taoThumb = document.getElementById('taoThumb');
  const taoTitle = document.getElementById('taoTitle');
  const taoDesc = document.getElementById('taoDesc');
  const taoTags = document.getElementById('taoTags');

  let lastIndex = -1;
  function onTowerScroll(){
    const rect = wrap.getBoundingClientRect();
    const scrollable = rect.height - window.innerHeight;
    let t = scrollable > 0 ? (-rect.top) / scrollable : 0;
    t = Math.max(0, Math.min(1, t));

    const rot = -(t * TOTAL_ROT);
    group.style.transform = `translateY(${-(t * TOTAL_LIFT)}px) rotateY(${rot}deg)`;

    let bestIdx = 0, bestDist = Infinity;
    const closeness = [];
    cardEls.forEach((el, i) => {
      let eff = (parseFloat(el.dataset.angle) + rot) % 360;
      if (eff > 180) eff -= 360;
      if (eff < -180) eff += 360;
      const c = (Math.cos(eff * Math.PI / 180) + 1) / 2; // 1 facing viewer, 0 facing away
      closeness[i] = c;
      el.style.opacity = (0.16 + 0.84 * c).toFixed(2);
      const dist = Math.abs(eff);
      if (dist < bestDist){ bestDist = dist; bestIdx = i; }
    });

    const overlayVisible = closeness[bestIdx] > 0.9;
    cardEls.forEach((el, i) => {
      el.classList.toggle('active', i === bestIdx);
      el.classList.toggle('text-hidden', i === bestIdx && overlayVisible);
    });
    if (bestIdx !== lastIndex){
      lastIndex = bestIdx;
      dotEls.forEach((d, di) => d.classList.toggle('active', di === bestIdx));
      const p = PROJECTS[bestIdx];
      taoThumb.src = p.cover || '';
      taoThumb.alt = p.title;
      taoTitle.textContent = p.title;
      taoDesc.textContent = p.desc;
      taoTags.innerHTML = p.tags.map(t=>`<span class="tag">${t}</span>`).join('');
    }

    // ---- live positions ----
    const stageRect = stage.getBoundingClientRect();
    const activeFaceRect = cardEls[bestIdx].querySelector('.face').getBoundingClientRect();
    activeOverlay.style.left = (activeFaceRect.left - stageRect.left) + 'px';
    activeOverlay.style.top = (activeFaceRect.top - stageRect.top) + 'px';
    activeOverlay.style.width = activeFaceRect.width + 'px';
    activeOverlay.style.height = activeFaceRect.height + 'px';
    activeOverlay.classList.toggle('visible', closeness[bestIdx] > 0.9);

    const pts = cardEls.map(el => {
      const r = el.querySelector('.face').getBoundingClientRect();
      return { x: r.left + r.width / 2 - stageRect.left, y: r.bottom - 22 - stageRect.top };
    });
    const ambPts = ambientEls.map(el => {
      const r = el.getBoundingClientRect();
      return { x: r.left - stageRect.left, y: r.top - stageRect.top };
    });

    pts.forEach((p, i) => {
      const node = cardNodes[i];
      node.setAttribute('cx', p.x); node.setAttribute('cy', p.y);
      node.setAttribute('r', (2.4 + 3.4 * closeness[i]).toFixed(1));
      node.setAttribute('opacity', (0.35 + 0.65 * closeness[i]).toFixed(2));
      node.setAttribute('fill', i === bestIdx ? '#5EEAD4' : '#A78BFA');
    });

    pairs.forEach(([i, j], k) => {
      const a = pts[i], b = pts[j];
      const adjacent = (j - i === 1);
      const op = (closeness[i] + closeness[j]) / 2;
      const link = meshLinks[k];
      link.setAttribute('x1', a.x); link.setAttribute('y1', a.y);
      link.setAttribute('x2', b.x); link.setAttribute('y2', b.y);
      link.setAttribute('stroke-opacity', adjacent ? (0.12 + 0.55 * op).toFixed(2) : (0.1 + 0.4 * op).toFixed(2));

      const relay = relayNodes[k];
      relay.setAttribute('cx', (a.x + b.x) / 2);
      relay.setAttribute('cy', (a.y + b.y) / 2);
      relay.setAttribute('opacity', adjacent ? (0.25 + 0.55 * op).toFixed(2) : (0.15 + 0.35 * op).toFixed(2));
    });

    // ambient node dots (small, uniformly faint)
    const allPts = pts.concat(ambPts);
    ambPts.forEach((p, i) => {
      const d = ambNodeDots[i];
      d.setAttribute('cx', p.x); d.setAttribute('cy', p.y);
      d.setAttribute('opacity', 0.28);
    });

    // k-nearest-neighbor mesh across ALL points (cards + ambient)
    const edgeSet = new Set();
    const edges = [];
    for (let i = 0; i < allPts.length; i++){
      const dists = [];
      for (let j = 0; j < allPts.length; j++){
        if (i === j) continue;
        const dx = allPts[i].x - allPts[j].x, dy = allPts[i].y - allPts[j].y;
        dists.push([j, dx*dx + dy*dy]);
      }
      dists.sort((a,b) => a[1]-b[1]);
      for (let n = 0; n < AMB_K && n < dists.length; n++){
        const j = dists[n][0];
        const key = i < j ? i+'_'+j : j+'_'+i;
        if (!edgeSet.has(key)){
          edgeSet.add(key);
          edges.push([i, j, dists[n][1]]);
        }
      }
    }

    for (let k = 0; k < ambLinkPool.length; k++){
      const line = ambLinkPool[k];
      if (k < edges.length){
        const [i, j, d2] = edges[k];
        const a = allPts[i], b = allPts[j];
        const len = Math.sqrt(d2);
        // fade long-range links so only locally coherent structure reads clearly
        const distFade = Math.max(0, 1 - len / 620);
        line.setAttribute('x1', a.x); line.setAttribute('y1', a.y);
        line.setAttribute('x2', b.x); line.setAttribute('y2', b.y);
        line.setAttribute('stroke-opacity', (0.05 + 0.22 * distFade).toFixed(2));
      } else {
        line.setAttribute('stroke-opacity', 0);
      }
    }
  }
  window.addEventListener('scroll', onTowerScroll, { passive:true });
  window.addEventListener('resize', onTowerScroll);
  onTowerScroll();
})();

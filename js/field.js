// ---------- ambient particle field ----------
(function initField(){
  const canvas = document.getElementById('field');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize(){
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COUNT = window.innerWidth < 700 ? 45 : 90;
  for(let i=0;i<COUNT;i++){
    particles.push({
      x: Math.random()*W,
      y: Math.random()*H,
      r: Math.random()*1.4 + 0.3,
      vx: (Math.random()-0.5)*0.12,
      vy: (Math.random()-0.5)*0.12,
      hue: Math.random() > 0.5 ? '94,234,212' : '167,139,250',
      a: Math.random()*0.5 + 0.15
    });
  }

  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', e=>{
    mouseX = (e.clientX / W - 0.5) * 14;
    mouseY = (e.clientY / H - 0.5) * 14;
  });

  function tick(){
    ctx.clearRect(0,0,W,H);
    particles.forEach(p=>{
      p.x += p.vx; p.y += p.vy;
      if(p.x < 0) p.x = W; if(p.x > W) p.x = 0;
      if(p.y < 0) p.y = H; if(p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x + mouseX, p.y + mouseY, p.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${p.hue},${p.a})`;
      ctx.fill();
    });
    if(!reducedMotion) requestAnimationFrame(tick);
  }
  tick();

  // keep canvas positioned only over viewport height (fixed), scroll-independent
  canvas.style.position = 'fixed';
})();

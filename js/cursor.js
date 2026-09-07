// ---------- custom cursor ----------
(function initCursor(){
  const cur = document.getElementById('cursor');
  if(!cur) return;
  if(window.matchMedia('(min-width:861px)').matches){
    window.addEventListener('mousemove', e=>{
      cur.style.left = e.clientX+'px';
      cur.style.top = e.clientY+'px';
    });
    document.querySelectorAll('a, .tower-card, .btn-solid, .btn-ghost').forEach(el=>{
      el.addEventListener('mouseenter', ()=>cur.classList.add('pop'));
      el.addEventListener('mouseleave', ()=>cur.classList.remove('pop'));
    });
  }
})();

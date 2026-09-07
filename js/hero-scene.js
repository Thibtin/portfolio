// ---------- hero 3D scene (Three.js) ----------
// Loaded as a module (see index.html <script type="module" src="js/hero-scene.js">).
// The "three" import relies on the <script type="importmap"> declared in <head>.
try {
  const reducedMotion3d = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile3d = window.matchMedia('(max-width:640px)').matches;

  if (!reducedMotion3d && !isMobile3d) {
    const THREE = await import('three');

    const canvas = document.getElementById('scene3d');
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference:'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 8);

    // lights (subtle — the core is mostly self-illuminated via shader)
    scene.add(new THREE.AmbientLight(0xffffff, 0.2));
    const l1 = new THREE.PointLight(0x5EEAD4, 8, 22); l1.position.set(4, 3, 5); scene.add(l1);
    const l2 = new THREE.PointLight(0xA78BFA, 8, 22); l2.position.set(-4, -2, 4); scene.add(l2);

    // central holographic core — fresnel-rim shader, self-illuminated so it
    // always reads correctly on a transparent canvas (no env/backdrop dependency)
    const coreGeo = new THREE.IcosahedronGeometry(1.6, 1);
    const coreMat = new THREE.ShaderMaterial({
      uniforms: {
        colorA: { value: new THREE.Color(0x5EEAD4) },
        colorB: { value: new THREE.Color(0xA78BFA) }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewDir;
        void main(){
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          vViewDir = normalize(-mvPos.xyz);
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vViewDir;
        uniform vec3 colorA;
        uniform vec3 colorB;
        void main(){
          float fresnel = pow(1.0 - max(dot(normalize(vNormal), normalize(vViewDir)), 0.0), 3.2);
          vec3 col = mix(colorA, colorB, vNormal.y * 0.5 + 0.5);
          float alpha = clamp(fresnel * 0.9, 0.0, 0.85);
          gl_FragColor = vec4(col, alpha);
        }
      `,
      transparent: true,
      blending: THREE.NormalBlending,
      depthWrite: false,
      side: THREE.FrontSide
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.set(2.4, 0.3, -1.2);
    scene.add(core);

    // soft glowing core — a warm radial light bloom at the center, so the
    // shape reads as a lit energy orb rather than a hollow shell
    function makeGlowTexture(){
      const size = 256;
      const cnv = document.createElement('canvas');
      cnv.width = cnv.height = size;
      const ctx = cnv.getContext('2d');
      const grad = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
      grad.addColorStop(0, 'rgba(210,255,248,0.95)');
      grad.addColorStop(0.35, 'rgba(94,234,212,0.45)');
      grad.addColorStop(0.7, 'rgba(167,139,250,0.15)');
      grad.addColorStop(1, 'rgba(167,139,250,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);
      return new THREE.CanvasTexture(cnv);
    }
    const glowMat = new THREE.SpriteMaterial({
      map: makeGlowTexture(), transparent: true, depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const glowSprite = new THREE.Sprite(glowMat);
    glowSprite.scale.set(4.2, 4.2, 1);
    glowSprite.position.set(2.4, 0.3, -1.2);
    scene.add(glowSprite);

    // outer wireframe shell
    const shellGeo = new THREE.IcosahedronGeometry(2.35, 1);
    const shellMat = new THREE.MeshBasicMaterial({ color: 0x5EEAD4, wireframe: true, transparent: true, opacity: 0.14 });
    const shell = new THREE.Mesh(shellGeo, shellMat);
    shell.position.copy(core.position);
    scene.add(shell);

    // ambient particle field
    const PCOUNT = 650;
    const positions = new Float32Array(PCOUNT * 3);
    const colors = new Float32Array(PCOUNT * 3);
    const cCyan = new THREE.Color(0x5EEAD4), cViolet = new THREE.Color(0xA78BFA);
    for (let i = 0; i < PCOUNT; i++) {
      const r = 4.5 + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      positions[i*3]   = r * Math.sin(phi) * Math.cos(theta);
      positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i*3+2] = r * Math.cos(phi);
      const c = Math.random() > 0.5 ? cCyan : cViolet;
      colors[i*3] = c.r; colors[i*3+1] = c.g; colors[i*3+2] = c.b;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const pMat = new THREE.PointsMaterial({ size: 0.028, vertexColors: true, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending, depthWrite: false });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // mouse parallax
    let mx = 0, my = 0;
    window.addEventListener('mousemove', e => {
      mx = (e.clientX / window.innerWidth - 0.5);
      my = (e.clientY / window.innerHeight - 0.5);
    });

    // scroll-driven camera dolly + fade — confined to the hero: fully
    // transparent once scrolled past it, so it never lingers over other sections
    let scrollT = 0;
    function onScroll() {
      const max = document.body.scrollHeight - window.innerHeight;
      scrollT = max > 0 ? window.scrollY / max : 0;
      const heroFade = Math.max(0, 1 - (window.scrollY / (window.innerHeight * 0.75)));
      canvas.style.opacity = heroFade.toFixed(2);
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onResize);

    const clock = new THREE.Clock();
    function animate() {
      const dt = clock.getDelta();
      core.rotation.y += dt * 0.22;
      core.rotation.x += dt * 0.09;
      shell.rotation.y -= dt * 0.11;
      shell.rotation.x -= dt * 0.05;
      particles.rotation.y += dt * 0.015;

      camera.position.x += (mx * 1.1 - camera.position.x) * 0.04;
      camera.position.y += (-my * 1.1 - camera.position.y) * 0.04;
      camera.position.z = 8 + scrollT * 5;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();
    onScroll();
    requestAnimationFrame(() => canvas.classList.add('ready'));
  }
} catch (err) {
  console.warn('3D scene unavailable, falling back to ambient field.', err);
}

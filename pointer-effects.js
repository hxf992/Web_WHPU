(() => {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const canvas = document.createElement('canvas');
  canvas.id = 'pointer-effects';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.append(canvas);
  const context = canvas.getContext('2d');
  if (!context) return;
  let ripples = [], frame = 0, lastMove = -Infinity;
  let width = 0, height = 0;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }
  function draw(now) {
    frame = 0;
    context.clearRect(0, 0, width, height);
    ripples = ripples.filter(r => now - r.born < r.duration);
    for (const ripple of ripples) {
      const progress = Math.max(0, (now - ripple.born) / ripple.duration);
      const radius = 3 + ripple.radius * (1 - Math.pow(1 - progress, 2));
      const alpha = ripple.alpha * Math.pow(1 - progress, 1.4);
      for (let ring = 0; ring < ripple.rings; ring++) {
        context.beginPath();
        context.arc(ripple.x, ripple.y, radius * (1 - ring * 0.25), 0, Math.PI * 2);
        context.strokeStyle = `rgba(115, 201, 224, ${alpha * (1 - ring * 0.2)})`;
        context.lineWidth = ripple.rings > 1 ? 1.8 : 1.2;
        context.stroke();
      }
    }
    if (ripples.length) frame = requestAnimationFrame(draw);
  }
  function add(event, click) {
    if (motion.matches || document.hidden) return;
    const now = performance.now();
    if (!click && (event.pointerType === 'touch' || now - lastMove < 55)) return;
    if (!click) lastMove = now;
    ripples.push({x: event.clientX, y: event.clientY, born: now,
      duration: click ? 1600 : 900, radius: click ? 110 : 52,
      alpha: click ? 0.85 : 0.48, rings: click ? 3 : 1});
    if (ripples.length > 40) ripples = ripples.slice(-40);
    if (!frame) frame = requestAnimationFrame(draw);
  }
  function clear() {
    cancelAnimationFrame(frame);
    frame = 0;
    ripples = [];
    context.clearRect(0, 0, width, height);
  }
  document.addEventListener('pointermove', event => add(event, false), {passive: true});
  document.addEventListener('click', event => {
    if (event.detail > 0) add(event, true);
  }, {passive: true});
  window.addEventListener('resize', resize, {passive: true});
  document.addEventListener('visibilitychange', clear);
  motion.addEventListener('change', clear);
  window.addEventListener('pagehide', clear);
  resize();
})();

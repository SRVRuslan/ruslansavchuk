import land from '../data/globe-land.js';

const canvas = document.querySelector('[data-hero-globe]');
const context = canvas?.getContext('2d');

if (canvas && context) {
  const radians = Math.PI / 180;
  const tilt = 14 * radians;
  const sinTilt = Math.sin(tilt);
  const cosTilt = Math.cos(tilt);
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const turnDuration = 180_000;
  const points = [];
  const graticules = [];
  let size = 0;
  let angle = -25 * radians;
  let frame = 0;
  let lastTime = 0;
  let visible = false;

  function sphere(longitude, latitude) {
    const lon = longitude * radians;
    const lat = latitude * radians;
    return [Math.cos(lat) * Math.sin(lon), Math.sin(lat), Math.cos(lat) * Math.cos(lon)];
  }

  for (let i = 0; i < land.length; i += 2) {
    points.push(sphere(land[i] / 10, land[i + 1] / 10));
  }
  for (let latitude = -60; latitude <= 60; latitude += 30) {
    graticules.push(Array.from({ length: 181 }, (_, i) => sphere(i * 2 - 180, latitude)));
  }
  for (let longitude = 0; longitude < 360; longitude += 30) {
    graticules.push(Array.from({ length: 91 }, (_, i) => sphere(longitude, i * 2 - 90)));
  }

  function draw() {
    if (!size) return;
    const center = size / 2;
    const radius = size * .445;
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

    function project([x, y, z]) {
      const turnedX = x * cos + z * sin;
      const turnedZ = z * cos - x * sin;
      return [
        center + turnedX * radius,
        center - (y * cosTilt - turnedZ * sinTilt) * radius,
        y * sinTilt + turnedZ * cosTilt,
      ];
    }

    context.clearRect(0, 0, size, size);
    const atmosphere = context.createRadialGradient(center, center, radius * .94, center, center, radius * 1.12);
    atmosphere.addColorStop(0, '#64b5ff00');
    atmosphere.addColorStop(.35, '#418aca16');
    atmosphere.addColorStop(1, '#64b5ff00');
    context.fillStyle = atmosphere;
    context.fillRect(0, 0, size, size);

    const ocean = context.createRadialGradient(center - radius * .45, center - radius * .5, 0, center, center, radius);
    ocean.addColorStop(0, '#122238');
    ocean.addColorStop(.65, '#0c1828');
    ocean.addColorStop(1, '#090f1a');
    context.beginPath();
    context.arc(center, center, radius, 0, Math.PI * 2);
    context.fillStyle = ocean;
    context.fill();
    context.lineWidth = .7;
    context.strokeStyle = '#68a4d52b';
    context.stroke();

    context.lineWidth = .6;
    context.strokeStyle = '#6499ca1c';
    for (const line of graticules) {
      context.beginPath();
      let connected = false;
      for (const point of line) {
        const [x, y, depth] = project(point);
        if (depth <= 0) { connected = false; continue; }
        if (connected) context.lineTo(x, y);
        else context.moveTo(x, y);
        connected = true;
      }
      context.stroke();
    }

    context.fillStyle = '#74a7d6';
    for (const point of points) {
      const [x, y, depth] = project(point);
      if (depth <= 0) continue;
      context.globalAlpha = .15 + .44 * depth;
      context.beginPath();
      context.arc(x, y, Math.max(.55, size * .0019) * (.65 + .35 * depth), 0, Math.PI * 2);
      context.fill();
    }
    context.globalAlpha = 1;
  }

  function tick(time) {
    frame = 0;
    if (lastTime && time - lastTime < 1000 / 30) {
      frame = requestAnimationFrame(tick);
      return;
    }
    if (lastTime) angle += Math.min(time - lastTime, 100) * Math.PI * 2 / turnDuration;
    lastTime = time;
    draw();
    frame = requestAnimationFrame(tick);
  }

  function updateAnimation() {
    cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
    if (visible && !document.hidden && !reducedMotion.matches) frame = requestAnimationFrame(tick);
    else draw();
  }

  function resize() {
    const nextSize = canvas.getBoundingClientRect().width;
    if (!nextSize) return;
    size = nextSize;
    const pixelRatio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(size * pixelRatio);
    canvas.height = Math.round(size * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    draw();
  }

  resize();
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);
  else addEventListener('resize', resize, { passive: true });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      updateAnimation();
    }).observe(canvas);
  } else {
    visible = true;
    updateAnimation();
  }
  document.addEventListener('visibilitychange', updateAnimation);
  reducedMotion.addEventListener('change', updateAnimation);
}

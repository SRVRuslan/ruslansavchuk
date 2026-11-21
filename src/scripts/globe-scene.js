import { createEarthRenderer } from './earth-renderer.js';
import { cities, connections } from '../data/globe-network.js';

// Both the textured Earth and the network are painted off the UI thread.
export function createGlobeScene(canvas, overlay, images) {
  const renderer = createEarthRenderer(canvas, images);
  const context = overlay.getContext('2d');
  if (!renderer || !context) return null;
  const radians = Math.PI / 180;
  const sinTilt = Math.sin(14 * radians), cosTilt = Math.cos(14 * radians);
  let size = 0, ratio = 1, compact = true;
  const sphere = ([longitude, latitude]) => {
    const lon = longitude * radians, lat = latitude * radians;
    return [Math.cos(lat) * Math.sin(lon), Math.sin(lat), Math.cos(lat) * Math.cos(lon)];
  };
  const nodes = cities.map(sphere);
  const arcs = connections.map(([from, to], index) => {
    const a = nodes[from], b = nodes[to];
    const distance = Math.acos(Math.max(-1, Math.min(1, a.reduce((sum, value, i) => sum + value * b[i], 0))));
    const denominator = Math.sin(distance);
    return {
      warm: index % 4 === 2,
      points: Array.from({ length: 65 }, (_, step) => {
        const t = step / 64;
        const height = 1 + Math.sin(t * Math.PI) * (.055 + distance * .035);
        const start = Math.sin((1 - t) * distance) / denominator;
        const end = Math.sin(t * distance) / denominator;
        return a.map((value, i) => (value * start + b[i] * end) * height);
      }),
    };
  });

  function sprite(warm) {
    const image = new OffscreenCanvas(48, 48);
    const paint = image.getContext('2d');
    const glow = paint.createRadialGradient(24, 24, 0, 24, 24, 24);
    const color = warm ? '255,193,114' : '69,187,255';
    glow.addColorStop(0, '#fff8e9');
    glow.addColorStop(.06, warm ? '#fff0b7' : '#d4f8ff');
    glow.addColorStop(.16, `rgba(${color},.8)`);
    glow.addColorStop(.4, `rgba(${color},.2)`);
    glow.addColorStop(1, `rgba(${color},0)`);
    paint.fillStyle = glow;
    paint.fillRect(0, 0, 48, 48);
    return image;
  }
  const blueGlow = sprite(false), goldGlow = sprite(true);

  function draw(angle, elapsed = 0) {
    if (!size || !renderer) return;
    renderer.draw(angle);
    const center = size / 2, radius = size * .435;
    const sin = Math.sin(angle), cos = Math.cos(angle);
    const project = ([x, y, z]) => {
      const turnedX = x * cos + z * sin;
      const turnedZ = z * cos - x * sin;
      const projectedY = y * cosTilt - turnedZ * sinTilt;
      const depth = y * sinTilt + turnedZ * cosTilt;
      // Hide the far side of every path behind the opaque sphere.
      const inFront = depth >= 0 || turnedX * turnedX + projectedY * projectedY > 1.002;
      return [center + turnedX * radius, center - projectedY * radius, depth, inFront];
    };
    context.clearRect(0, 0, size, size);
    context.lineCap = 'round';
    const activeArcs = compact ? arcs.filter((_, i) => i % 3 !== 1) : arcs;
    activeArcs.forEach((arc, index) => {
      const points = arc.points.map(project);
      const path = new Path2D();
      let connected = false;
      points.forEach(([x, y, , front]) => {
        if (!front) { connected = false; return; }
        if (connected) path.lineTo(x, y); else path.moveTo(x, y);
        connected = true;
      });
      const rgb = arc.warm ? '231,175,98' : '66,166,241';
      context.strokeStyle = `rgba(${rgb},.055)`;
      context.lineWidth = 2.8;
      context.stroke(path);
      context.strokeStyle = `rgba(${rgb},.4)`;
      context.lineWidth = Math.max(.45, size * .001);
      context.stroke(path);
      const progress = (elapsed / (6500 + index * 430) + index * .19) % 1;
      const head = Math.round(progress * 64);
      for (let tail = 6; tail >= 0; tail--) {
        const point = points[head - tail];
        if (!point?.[3]) continue;
        context.globalAlpha = .6 * (1 - tail / 7);
        const width = Math.max(5, size * .015) * (1 - tail * .08);
        context.drawImage(arc.warm ? goldGlow : blueGlow, point[0] - width / 2, point[1] - width / 2, width, width);
      }
      context.globalAlpha = 1;
    });
    nodes.forEach((point, index) => {
      const [x, y, depth] = project(point);
      if (depth <= .025) return;
      const width = Math.max(7, size * .024) * (.6 + .4 * depth);
      context.globalAlpha = (.65 + .2 * Math.sin(elapsed / 1700 + index)) * Math.min(1, depth * 4);
      context.drawImage(index % 4 === 2 ? goldGlow : blueGlow, x - width / 2, y - width / 2, width, width);
    });
    context.globalAlpha = 1;
  }

  return {
    draw,
    resize(nextSize, nextRatio, nextCompact) {
      if (size === nextSize && ratio === nextRatio && compact === nextCompact) return false;
      size = nextSize; ratio = nextRatio; compact = nextCompact;
      canvas.width = canvas.height = overlay.width = overlay.height = Math.round(size * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      return true;
    },
  };
}

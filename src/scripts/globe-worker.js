import { createGlobeScene } from './globe-scene.js';

let canvas, overlay, images, scene;
let state = { size: 0, ratio: 1, compact: true, active: false };
let angle = 36 * Math.PI / 180;
let elapsed = 0;
let lastTime = 0;
let frame = 0;
const requestFrame = typeof self.requestAnimationFrame === 'function'
  ? self.requestAnimationFrame.bind(self)
  : callback => setTimeout(() => callback(performance.now()), 1000 / (state.compact ? 20 : 30));
const cancelFrame = typeof self.cancelAnimationFrame === 'function'
  ? self.cancelAnimationFrame.bind(self) : clearTimeout;

function tick(time) {
  frame = 0;
  if (!scene || !state.active) return;
  if (lastTime && time - lastTime < 1000 / (state.compact ? 20 : 30)) {
    frame = requestFrame(tick);
    return;
  }
  if (lastTime) {
    const delta = Math.min(time - lastTime, 100);
    angle = (angle + delta * Math.PI * 2 / 210_000) % (Math.PI * 2);
    elapsed += delta;
  }
  lastTime = time;
  scene.draw(angle, elapsed);
  frame = requestFrame(tick);
}

function update(nextState) {
  state = nextState;
  if (!scene) return;
  const resized = scene.resize(state.size, state.ratio, state.compact);
  if (resized) scene.draw(angle, elapsed);
  if (!state.active) {
    cancelFrame(frame); frame = 0; lastTime = 0;
  } else if (!frame) {
    lastTime = 0;
    frame = requestFrame(tick);
  }
}

function initialize() {
  scene = createGlobeScene(canvas, overlay, images);
  if (!scene) { self.postMessage({ type: 'fallback' }); return; }
  scene.resize(state.size, state.ratio, state.compact);
  scene.draw(angle, elapsed);
  self.postMessage({ type: 'ready' });
  update(state);
}

self.onmessage = ({ data }) => {
  try {
    if (data.type === 'init') {
      ({ canvas, overlay, images, state } = data);
      canvas.addEventListener('webglcontextlost', event => {
        event.preventDefault();
        cancelFrame(frame); frame = 0; lastTime = 0; scene = null;
        self.postMessage({ type: 'lost' });
      });
      canvas.addEventListener('webglcontextrestored', initialize);
      initialize();
    } else if (data.type === 'state') update(data.state);
  } catch { self.postMessage({ type: 'fallback' }); }
};

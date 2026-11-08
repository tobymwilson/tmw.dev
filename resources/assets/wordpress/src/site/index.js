// Snap between full-height anchored screens on wheel / touch / keyboard.
const SELECTOR = '.screen';
const LOCK_MS = 900;
const WHEEL_THRESHOLD = 4;
const SWIPE_THRESHOLD = 40;

const getScreens = () =>
  [...document.querySelectorAll(SELECTOR)].filter(
    (el) => el.offsetHeight >= window.innerHeight * 0.9
  );

const currentIndex = (screens) => {
  let best = 0;
  let bestDist = Infinity;
  screens.forEach((el, i) => {
    const dist = Math.abs(el.getBoundingClientRect().top);
    if (dist < bestDist) {
      bestDist = dist;
      best = i;
    }
  });
  return best;
};

let locked = false;

const go = (direction) => {
  const screens = getScreens();
  if (screens.length < 2) return false;

  const target = currentIndex(screens) + direction;
  if (target < 0 || target >= screens.length) return false; // let the page scroll naturally past the ends

  locked = true;
  const el = screens[target];
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  if (el.id) history.replaceState(null, '', `#${el.id}`);
  setTimeout(() => (locked = false), LOCK_MS);
  return true;
};

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const isTouch = window.matchMedia('(pointer: coarse)').matches;

// Touch devices: JS-driven snapping fights momentum scrolling and the collapsing
// browser toolbar, so use native scroll-snap instead.
if (isTouch) {
  const style = document.createElement('style');
  style.textContent = `
    html { scroll-snap-type: y mandatory; overscroll-behavior-y: none; }
    ${SELECTOR} { height: 100vh; height: 100dvh; scroll-snap-align: start; scroll-snap-stop: always; }
  `;
  document.head.appendChild(style);
} else if (!reduceMotion.matches) {
  window.addEventListener(
    'wheel',
    (e) => {
      if (e.ctrlKey || Math.abs(e.deltaY) < WHEEL_THRESHOLD) return;
      if (locked) return e.preventDefault();
      if (go(e.deltaY > 0 ? 1 : -1)) e.preventDefault();
    },
    { passive: false }
  );

  window.addEventListener('keydown', (e) => {
    if (e.target.closest?.('input, textarea, select, [contenteditable]')) return;
    const dir = { ArrowDown: 1, PageDown: 1, ArrowUp: -1, PageUp: -1 }[e.key];
    if (!dir) return;
    if (locked) return e.preventDefault();
    if (go(dir)) e.preventDefault();
  });
}
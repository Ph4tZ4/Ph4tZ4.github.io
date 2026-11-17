import { gsap } from './motion';
import { $$, hasFinePointer } from '../lib/dom';

/** Pointer-driven effects bound to the current DOM. Abort the signal to detach. */
export function initInteractions(root: HTMLElement, signal: AbortSignal, reduced: boolean): void {
  if (!hasFinePointer() || reduced) return;

  // Magnetic buttons
  $$('[data-magnetic]', root).forEach((el) => {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    el.addEventListener(
      'pointermove',
      (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.35);
        yTo((e.clientY - (r.top + r.height / 2)) * 0.35);
      },
      { signal },
    );
    el.addEventListener('pointerleave', () => (xTo(0), yTo(0)), { signal });
  });

  // 3D tilt + glare position
  $$('[data-tilt]', root).forEach((el) => {
    gsap.set(el, { transformPerspective: 900 });
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power3.out' });
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power3.out' });
    el.addEventListener(
      'pointermove',
      (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        ry((px - 0.5) * 12);
        rx((0.5 - py) * 10);
        el.style.setProperty('--gx', `${px * 100}%`);
        el.style.setProperty('--gy', `${py * 100}%`);
      },
      { signal },
    );
    el.addEventListener('pointerleave', () => (rx(0), ry(0)), { signal });
  });

  // Spotlight borders
  $$('[data-spotlight]', root).forEach((el) => {
    el.addEventListener(
      'pointermove',
      (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - r.left}px`);
        el.style.setProperty('--my', `${e.clientY - r.top}px`);
      },
      { signal },
    );
  });
}

/** Custom cursor (dot + lagging ring with contextual label). Bound once for the page lifetime. */
export function initCursor(): void {
  if (!hasFinePointer()) return;
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  const label = document.getElementById('cursor-label');
  if (!dot || !ring || !label) return;
  document.documentElement.classList.add('has-cursor');

  const dx = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power3' });
  const dy = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power3' });
  const rx = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' });
  const ry = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' });

  window.addEventListener(
    'pointermove',
    (e) => {
      if (ring.classList.contains('is-hidden')) {
        gsap.set([dot, ring], { x: e.clientX, y: e.clientY });
        ring.classList.remove('is-hidden');
        dot.classList.remove('is-hidden');
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    },
    { passive: true },
  );

  document.addEventListener('pointerover', (e) => {
    const target = e.target instanceof Element ? e.target : null;
    const labelled = target?.closest<HTMLElement>('[data-cursor]');
    const interactive = target?.closest('a, button, summary, [role="tab"]');
    ring.classList.toggle('is-label', Boolean(labelled));
    ring.classList.toggle('is-hover', Boolean(interactive) && !labelled);
    label.textContent = labelled?.dataset.cursor ?? '';
  });
  document.documentElement.addEventListener('pointerleave', () => {
    ring.classList.add('is-hidden');
    dot.classList.add('is-hidden');
  });
}

import './styles/main.css';
import type { PortfolioData } from './types';
import { thaiContent } from './data/thai';
import { fetchRemote, loadCached } from './data/store';
import { createSmoothScroll, initSectionMotion, playHeroIntro, ScrollTrigger } from './fx/motion';
import { initCursor, initInteractions } from './fx/interactions';
import { bindSectionUi, initDialog, initNav, startClock } from './ui';
import { renderIcons } from './lib/icons';
import { $, prefersReducedMotion } from './lib/dom';
import { heroSection, featuredSection, marqueeBand } from './sections/hero';
import { aboutSection, journeySection, expertiseSection } from './sections/about';
import { certificatesSection, projectsSection, skillsSection } from './sections/works';
import { contactSection } from './sections/contact';

const reduced = prefersReducedMotion();
const app = $('#app');
const lenis = createSmoothScroll(reduced);
const getLenis = () => lenis;
const nav = initNav(getLenis);
initDialog(getLenis);
if (!reduced) initCursor();

let motion: ReturnType<typeof initSectionMotion> | undefined;
let uiAbort: AbortController | undefined;
let refreshTimer: number | undefined;
const refreshSoon = () => {
  window.clearTimeout(refreshTimer);
  refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 100);
};

function render(source: PortfolioData): void {
  const data = thaiContent(source);
  motion?.revert();
  uiAbort?.abort();
  app.innerHTML = [
    heroSection(data), featuredSection(data), marqueeBand(data), aboutSection(data),
    projectsSection(data), skillsSection(data), journeySection(data), certificatesSection(data),
    expertiseSection(data), contactSection(),
  ].join('');
  renderIcons(app);
  uiAbort = new AbortController();
  bindSectionUi(app, data, uiAbort.signal, getLenis);
  initInteractions(app, uiAbort.signal, reduced);
  motion = initSectionMotion(app, { reduced, onSectionChange: (id) => nav.setActive(id) });
  app.querySelectorAll('img').forEach((img) => {
    if (!img.complete) img.addEventListener('load', refreshSoon, { once: true, signal: uiAbort!.signal });
  });
  ScrollTrigger.refresh();

}

let current = loadCached();
render(current);
startClock();
const initialTarget = document.getElementById(window.location.hash.slice(1));
if (initialTarget) {
  if (initialTarget instanceof HTMLDetailsElement) initialTarget.open = true;
  requestAnimationFrame(() => initialTarget.scrollIntoView({ behavior: 'instant' }));
}
if (!reduced) playHeroIntro();
document.fonts?.ready.then(refreshSoon);
window.addEventListener('load', refreshSoon, { once: true });

void fetchRemote().then((fresh) => {
  if (!fresh || JSON.stringify(fresh) === JSON.stringify(current)) return;
  // Keep an open certificate or menu stable while the visitor is using it.
  if (document.querySelector('dialog[open]') || document.documentElement.classList.contains('menu-open')) return;
  current = fresh;
  render(fresh);
});

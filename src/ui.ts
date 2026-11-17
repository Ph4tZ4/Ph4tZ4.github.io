import type Lenis from 'lenis';
import type { PortfolioData } from './types';
import { ScrollTrigger, scrollToTarget } from './fx/motion';
import { $, $$, safeUrl, prefersReducedMotion } from './lib/dom';

export function initNav(getLenis: () => Lenis | null): { setActive(id: string): void } {
  const menu = $('#menu');
  const toggle = $<HTMLButtonElement>('[data-menu-toggle]');
  const links = $$<HTMLAnchorElement>('.site-nav [data-nav-link]');
  const setMenu = (open: boolean, restoreFocus = false) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'ปิดเมนู' : 'เปิดเมนู');
    menu.toggleAttribute('data-open', open);
    menu.inert = !open;
    document.documentElement.classList.toggle('menu-open', open);
    if (open) {
      getLenis()?.stop();
      menu.querySelector<HTMLAnchorElement>('a')?.focus();
    } else {
      getLenis()?.start();
      if (restoreFocus) toggle.focus();
    }
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', (e) => { if (e.target === menu) setMenu(false, true); });
  document.addEventListener('keydown', (e) => {
    if (!menu.hasAttribute('data-open')) return;
    if (e.key === 'Escape') setMenu(false, true);
    if (e.key !== 'Tab') return;
    const focusable = [toggle, ...$$<HTMLAnchorElement>('a', menu)];
    const first = focusable[0]!;
    const last = focusable.at(-1)!;
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  window.matchMedia('(min-width: 1101px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  // Preserve the existing five-click admin shortcut.
  let clicks = 0;
  let timer: number | undefined;
  $('[data-logo]').addEventListener('click', (e) => {
    e.preventDefault();
    clicks += 1;
    if (clicks === 1) timer = window.setTimeout(() => (clicks = 0), 2000);
    if (clicks >= 5) {
      window.clearTimeout(timer);
      clicks = 0;
      try { sessionStorage.setItem('admin_secret_access', 'true'); } catch { /* Storage may be blocked. */ }
      window.location.href = 'admin.html';
      return;
    }
    setMenu(false);
    scrollToTarget(getLenis(), 0);
  });
  document.addEventListener('click', (e) => {
    if (!(e.target instanceof Element)) return;
    const anchor = e.target.closest<HTMLAnchorElement>('a[data-scroll-to]');
    const hash = anchor?.getAttribute('href');
    if (hash?.startsWith('#')) {
      const target = document.getElementById(hash.slice(1));
      if (!target) return;
      e.preventDefault();
      setMenu(false);
      if (target instanceof HTMLDetailsElement) target.open = true;
      scrollToTarget(getLenis(), hash);
      history.replaceState(null, '', hash);
    }
    if (e.target.closest('[data-scroll-top]')) scrollToTarget(getLenis(), 0);
  });
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (s) => document.documentElement.classList.toggle('show-top', s.scroll() > 700) });
  return { setActive(id: string) {
    links.forEach((link) => {
      if (link.getAttribute('href') === `#${id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  } };
}

export function bindSectionUi(root: HTMLElement, data: PortfolioData, signal: AbortSignal, getLenis: () => Lenis | null): void {
  $$<HTMLButtonElement>('[data-filter]', root).forEach((button) => {
    button.addEventListener('click', () => {
      const category = button.dataset.filter ?? 'All';
      $$<HTMLButtonElement>('[data-filter]', root).forEach((b) => {
        b.classList.toggle('is-active', b === button);
        b.setAttribute('aria-pressed', String(b === button));
      });
      $$('[data-category]', root).forEach((card) => { card.hidden = category !== 'All' && card.dataset.category !== category; });
      ScrollTrigger.refresh();
    }, { signal });
  });
  const rail = root.querySelector<HTMLElement>('[data-project-rail]');
  if (rail) {
    const moveRail = (direction: number) => rail.scrollBy({ left: direction * ((rail.firstElementChild?.getBoundingClientRect().width ?? 320) + 20), behavior: prefersReducedMotion() ? 'instant' : 'smooth' });
    root.querySelector('[data-rail-prev]')?.addEventListener('click', () => moveRail(-1), { signal });
    root.querySelector('[data-rail-next]')?.addEventListener('click', () => moveRail(1), { signal });
    rail.addEventListener('keydown', (e) => {
      if (e.target !== rail || !['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
      e.preventDefault();
      moveRail(e.key === 'ArrowRight' ? 1 : -1);
    }, { signal });
  }
  const dialog = document.getElementById('certDialog');
  if (dialog instanceof HTMLDialogElement) {
    $$<HTMLButtonElement>('[data-cert]', root).forEach((button) => {
      button.addEventListener('click', () => {
        const cert = data.certificates?.[Number(button.dataset.cert)];
        if (!cert) return;
        const image = $<HTMLImageElement>('[data-dialog-img]', dialog);
        const src = safeUrl(cert.image);
        image.hidden = !src;
        if (src) image.src = src;
        else image.removeAttribute('src');
        image.alt = cert.title;
        $('[data-dialog-title]', dialog).textContent = cert.title;
        $('[data-dialog-issuer]', dialog).textContent = cert.issuer;
        $('[data-dialog-date]', dialog).textContent = cert.date;
        $('[data-dialog-desc]', dialog).textContent = cert.description;
        getLenis()?.stop();
        dialog.showModal();
      }, { signal });
    });
  }
  $$<HTMLButtonElement>('[data-copy]', root).forEach((button) => {
    const label = button.querySelector('span');
    const original = label?.textContent ?? 'คัดลอกอีเมล';
    let timer: number | undefined;
    signal.addEventListener('abort', () => window.clearTimeout(timer), { once: true });
    button.addEventListener('click', async () => {
      const text = button.dataset.copy ?? '';
      try {
        await navigator.clipboard.writeText(text);
        if (label) label.textContent = 'คัดลอกอีเมลแล้ว!';
      } catch {
        if (label) label.textContent = text;
      }
      window.clearTimeout(timer);
      timer = window.setTimeout(() => { if (label) label.textContent = original; }, 2500);
    }, { signal });
  });
  root.addEventListener('toggle', () => ScrollTrigger.refresh(), { capture: true, signal });
  initHeroVideo(root, signal);
}

function initHeroVideo(root: HTMLElement, signal: AbortSignal): void {
  const video = root.querySelector<HTMLVideoElement>('[data-hero-video]');
  const button = root.querySelector<HTMLButtonElement>('[data-video-toggle]');
  const source = video?.querySelector('source');
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (!video || !source || !button || prefersReducedMotion() || connection?.saveData) return;
  let userPaused = false;
  video.muted = true;
  source.src = source.dataset.src ?? '';
  video.load();
  const play = () => video.play().then(() => { button.hidden = false; }).catch(() => { button.hidden = true; });
  void play();
  button.addEventListener('click', () => {
    userPaused = !userPaused;
    if (userPaused) video.pause();
    else void play();
    button.textContent = userPaused ? 'เล่นวิดีโอพื้นหลัง' : 'หยุดวิดีโอพื้นหลัง';
    button.setAttribute('aria-pressed', String(userPaused));
  }, { signal });
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry?.isIntersecting) video.pause();
    else if (!userPaused) void play();
  });
  observer.observe(video);
  signal.addEventListener('abort', () => { observer.disconnect(); video.pause(); }, { once: true });
}

export function initDialog(getLenis: () => Lenis | null): void {
  const dialog = document.getElementById('certDialog');
  if (!(dialog instanceof HTMLDialogElement)) return;
  dialog.addEventListener('click', (e) => {
    if ((e.target instanceof Element && e.target.closest('[data-dialog-close]')) || e.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => getLenis()?.start());
}

export function startClock(): void {
  const format = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Bangkok' });
  const tick = () => { $$('[data-clock]').forEach((el) => { el.textContent = format.format(new Date()); }); };
  tick();
  window.setInterval(tick, 10_000);
}

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { $, $$, pad } from '../lib/dom';

gsap.registerPlugin(ScrollTrigger, SplitText);
export { gsap, ScrollTrigger };

export function createSmoothScroll(reduced: boolean): Lenis | null {
  if (reduced) return null;
  const lenis = new Lenis({ lerp: .09, smoothWheel: true, wheelMultiplier: .9, anchors: false });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export function scrollToTarget(lenis: Lenis | null, target: string | number): void {
  if (lenis) {
    lenis.scrollTo(target, { offset: typeof target === 'string' ? -100 : 0, duration: 1.2, easing: (t) => 1 - (1 - t) ** 4 });
    return;
  }
  if (typeof target === 'number') window.scrollTo({ top: target, behavior: 'instant' });
  else document.querySelector(target)?.scrollIntoView({ behavior: 'instant' });
}

export function playHeroIntro(): void {
  gsap.from('[data-hero-fade]', { opacity: 0, y: 28, duration: 1.2, stagger: .12, ease: 'expo.out', clearProps: 'all' });
}

export function initSectionMotion(root: HTMLElement, opts: { reduced: boolean; onSectionChange(id: string): void }): gsap.Context {
  return gsap.context(() => {
    $$('[data-scene]', root).forEach((section) => {
      ScrollTrigger.create({ trigger: section, start: 'top 55%', end: 'bottom 55%', onToggle: (s) => { if (s.isActive) opts.onSectionChange(section.id); } });
    });
    const steps = $$('[data-step]', root);
    const counter = root.querySelector('[data-step-counter]');
    const progress = root.querySelector<HTMLElement>('[data-step-progress]');
    steps.forEach((step, i) => {
      const activate = () => {
        steps.forEach((s) => s.classList.toggle('is-active', s === step));
        if (counter) counter.textContent = pad(i + 1);
        if (progress) progress.style.transform = `scaleX(${(i + 1) / steps.length})`;
      };
      ScrollTrigger.create({ trigger: step, start: 'top 60%', onEnter: activate, onLeaveBack: () => {
        const previous = steps[Math.max(0, i - 1)];
        steps.forEach((s) => s.classList.toggle('is-active', s === previous));
        if (counter) counter.textContent = pad(Math.max(1, i));
        if (progress) progress.style.transform = `scaleX(${Math.max(1, i) / steps.length})`;
      } });
    });
    if (progress && steps.length) progress.style.transform = `scaleX(${1 / steps.length})`;
    if (opts.reduced) return;

    const reveals = $$('[data-reveal]', root);
    gsap.set(reveals, { opacity: 0, y: 28 });
    ScrollTrigger.batch(reveals, { start: 'top 92%', once: true, onEnter: (elements) => gsap.to(elements, { opacity: 1, y: 0, duration: 1, stagger: .07, ease: 'expo.out', clearProps: 'opacity,transform' }) });
    $$('[data-split-scrub]', root).forEach((el) => {
      const split = SplitText.create(el, { type: 'words' });
      gsap.from(split.words, { opacity: .25, stagger: .08, ease: 'none', scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom 55%', scrub: true } });
    });
    $$('[data-marquee]', root).forEach((row) => {
      const reverse = Number(row.dataset.marquee) < 0;
      gsap.fromTo($('.marquee__track', row), { xPercent: reverse ? -50 : 0 }, { xPercent: reverse ? 0 : -50, duration: 38, ease: 'none', repeat: -1 });
    });
    const browser = root.querySelector('[data-browser]');
    if (browser) {
      // Keep perspective fixed: tweening it to zero distorts the screen near the end.
      gsap.set(browser, { transformPerspective: 1800, force3D: true });
      gsap.from(browser, { scale: .92, rotationX: 6, ease: 'none', scrollTrigger: { trigger: browser, start: 'top 95%', end: 'top 35%', scrub: .4 } });
    }
    const stacked = $$('.project--stack .project__inner', root);
    stacked.slice(0, -1).forEach((card, i) => {
      gsap.to(card, { scale: .94, opacity: .5, transformOrigin: 'center top', ease: 'none', scrollTrigger: { trigger: stacked[i + 1]!, start: 'top 75%', end: 'top 18%', scrub: true } });
    });
    const hero = root.querySelector('.hero');
    if (hero) gsap.to('.hero__media', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  }, root);
}

import type { PortfolioData } from '../types';
import { html, safeUrl, type SafeHtml } from '../lib/dom';

export function heroSection(data: PortfolioData): SafeHtml {
  return html`
    <section id="home" class="hero" data-scene="home" aria-labelledby="hero-title">
      <div class="hero__media" aria-hidden="true">
        <video class="hero__video" muted loop playsinline preload="none" poster="images/studio-background.webp" data-hero-video>
          <source data-src="images/studio-background.mp4" type="video/webm" />
        </video>
      </div>
      <div class="hero__shade" aria-hidden="true"></div>
      <div class="hero__inner">
        <span class="pill glass" data-hero-fade><span class="pulse-dot"></span>นักศึกษาและนักพัฒนา · ประเทศไทย</span>
        <h1 id="hero-title" class="hero__title" data-hero-fade>
          <span>เปลี่ยนความสงสัยเป็นโค้ด</span>
          <span class="chrome">เรียนรู้จากการลงมือทำ</span>
        </h1>
        <p class="hero__intro" data-hero-fade>ผมกิตติภัทร นักศึกษาสาขาเทคโนโลยีสารสนเทศและการสื่อสาร ชั้นปีที่ 3 มหาวิทยาลัยศรีปทุม<br class="desktop-only" /> ผมนำสิ่งที่เรียนรู้มาพัฒนาเป็นเว็บไซต์และซอฟต์แวร์</p>
        <div class="hero__cta" data-hero-fade>
          <a href="#contact" class="btn btn--primary" data-scroll-to>ติดต่อผม <i data-lucide="arrow-up-right"></i></a>
          <a href="#projects" class="btn btn--glass glass" data-scroll-to>ดูผลงานของผม <i data-lucide="arrow-down"></i></a>
        </div>
        <ul class="hero__proof" data-hero-fade>
          <li>${data.about.years} ปีแห่งการเรียนรู้และลงมือทำ</li>
          <li>${data.projects.length} โปรเจกต์ที่คัดสรร</li>
          <li>${data.about.status}</li>
        </ul>
      </div>
      <a class="hero__scroll" href="${data.projects.length ? '#featured' : '#about'}" data-scroll-to><span>เลื่อนลง</span><i aria-hidden="true"></i></a>
      <button class="motion-toggle glass" type="button" data-video-toggle aria-pressed="false" hidden>หยุดวิดีโอพื้นหลัง</button>
    </section>
  `;
}

export function featuredSection(data: PortfolioData): SafeHtml {
  const project = data.projects[0];
  if (!project) return html``;
  const image = safeUrl(project.image);
  const link = safeUrl(project.demoLink || project.repoLink || project.link) || '#projects';
  return html`
    <section id="featured" class="featured" aria-labelledby="featured-title">
      <div class="container-x featured__head" data-reveal>
        <span class="eyebrow">โปรเจกต์เด่น · ${project.title}</span>
        <h2 id="featured-title" class="display chrome">สร้างเพื่อเรียนรู้ พัฒนาเพื่อใช้งาน</h2>
      </div>
      <div class="container-x">
        <div class="browser glass" data-browser>
          <div class="browser__bar">
            <span class="browser__lights" aria-hidden="true"><i></i><i></i><i></i></span>
            <a class="browser__url glass" href="${link}" ${link.startsWith('https:') ? html`target="_blank" rel="noopener"` : ''}>${project.title}<i data-lucide="external-link"></i></a>
          </div>
          <a href="${link}" class="browser__screen" aria-label="ดู ${project.title}" ${link.startsWith('https:') ? html`target="_blank" rel="noopener"` : ''} data-cursor="ดูรายละเอียด">
            ${image ? html`<img src="${image}" alt="${project.title} — ภาพตัวอย่างโปรเจกต์" width="1440" height="900" loading="lazy" decoding="async" />` : html`<span class="project__placeholder">${project.title}</span>`}
          </a>
        </div>
      </div>
      <p class="featured__note" data-reveal>${project.description}</p>
    </section>
  `;
}

export function marqueeBand(data: PortfolioData): SafeHtml {
  const words = data.skills.length ? data.skills.map((s) => s.name) : ['การออกแบบ', 'การพัฒนา', 'การเขียนโค้ดสร้างสรรค์'];
  return html`
    <div class="trusted" aria-label="เทคโนโลยีที่ผมใช้งาน">
      <p class="trusted__label">เครื่องมือเบื้องหลังผลงาน</p>
      <div class="marquee" aria-hidden="true">
        ${[words, [...words].reverse()].map((row, i) => html`
          <div class="marquee__row" data-marquee="${i === 0 ? 1 : -1}">
            <div class="marquee__track">${[...row, ...row].map((name) => html`<span class="marquee__item">${name}</span><span class="marquee__dot"></span>`)}</div>
          </div>
        `)}
      </div>
    </div>
  `;
}

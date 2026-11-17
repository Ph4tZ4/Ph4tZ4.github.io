import type { PortfolioData } from '../types';
import { html, pad, type SafeHtml } from '../lib/dom';

export function sectionLabel(_index: number, label: string): SafeHtml {
  return html`<div class="eyebrow" data-reveal>${label}</div>`;
}

export function aboutSection(data: PortfolioData): SafeHtml {
  const expertise = data.about.expertise ?? [];
  return html`
    <section id="about" class="section intro" data-scene="about">
      <div class="container-x">
        ${sectionLabel(1, 'รู้จักผมสักนิด')}
        <h2 class="statement" data-split-scrub>ทุกโปรเจกต์เริ่มจากคำถาม การลงมือทำช่วยให้ผมค้นพบคำตอบ</h2>
        <div class="intro__side" data-reveal><p class="lead muted">ปัจจุบันผมเรียนสาขาเทคโนโลยีสารสนเทศและการสื่อสาร ชั้นปีที่ 3 มหาวิทยาลัยศรีปทุม ผมนำพื้นฐานจากสายอาชีพและประสบการณ์ฝึกงานมาต่อยอดในการพัฒนา ทั้งส่วนติดต่อผู้ใช้และระบบเบื้องหลัง</p><div class="text-links"><a href="#journey" data-scroll-to>เส้นทางของผม →</a><a href="Docs/KittiphatCV.pdf" target="_blank" rel="noopener" download>ดาวน์โหลดประวัติส่วนตัว ↗</a></div></div>
        ${expertise.length ? html`
          <div class="expertise-grid glass">
            ${expertise.map((x, i) => html`
              <a class="expertise-card" href="#expertise-${i}" data-scroll-to>
                <span class="expertise-card__index">${pad(i + 1)} / ความถนัด</span><span class="circle-arrow" aria-hidden="true">↗</span>
                <h3>${x.area}</h3><span class="muted">ดูรายละเอียด</span>
              </a>
            `)}
          </div>
        ` : ''}
      </div>
      <div class="pain container-narrow" data-reveal><p class="pain__title">เริ่มจากปัญหาที่พบจริง<br /><span class="chrome">สร้างสิ่งที่ใช้ประโยชน์ได้</span></p><p class="lead muted">ผมชอบทำความเข้าใจวิธีทำงานของผู้ใช้ ทดลองแก้ปัญหา และปรับปรุงจากความคิดเห็น โดยใส่ใจทั้งหน้าจอที่ใช้งานง่ายและโค้ดที่อ่านเข้าใจได้</p><a href="#projects" class="btn btn--primary" data-scroll-to>ดูผลงานของผม <i data-lucide="arrow-down"></i></a></div>
    </section>
  `;
}

export function journeySection(data: PortfolioData): SafeHtml {
  const a = data.about;
  const experience = a.experience ?? [];
  const education = a.education ?? [];
  const stats = [
    { value: a.years, label: 'ปีแห่งการเรียนรู้และลงมือทำ', note: 'จากการเรียนสายอาชีพและฝึกงาน สู่โปรเจกต์ในมหาวิทยาลัย' },
    { value: data.projects.length, label: 'โปรเจกต์ที่คัดสรร', note: 'เว็บไซต์ แอปพลิเคชัน และงานทดลองที่ใส่ใจทุกรายละเอียด' },
    { value: data.skills.length, label: 'ทักษะด้านเทคโนโลยี', note: 'ทักษะที่ค่อย ๆ เพิ่มขึ้นจากโจทย์ใหม่ในแต่ละครั้ง' },
    { value: data.certificates?.length ?? 0, label: 'เกียรติบัตร', note: 'เรียนรู้อย่างต่อเนื่องและนำความรู้มาลงมือทำ' },
  ];
  return html`
    <section id="journey" class="section journey" data-scene="journey">
      <div class="container-x">
        <div class="journey-grid">
          <div><div class="journey__sticky">${sectionLabel(5, 'เส้นทางของผม')}<h2 class="display" data-reveal>จากห้องเรียน<br /><span class="chrome">สู่การลงมือทำ</span></h2><div class="step-counter chrome" aria-hidden="true" data-step-counter>01</div><div class="step-progress" aria-hidden="true"><span data-step-progress></span></div></div></div>
          <ol class="timeline">${experience.map((e, i) => html`
            <li class="timeline__item glass" data-step="${i + 1}">
              <span class="eyebrow">${pad(i + 1)} / ${e.period}</span><h3>${e.role}</h3><p class="timeline__company">${e.company}</p><p class="muted">${e.description}</p>
            </li>
          `)}</ol>
        </div>
        <div class="proof" data-reveal><span class="proof__ghost" aria-hidden="true">${a.years}</span><h2 class="display">ลงมือทำ ทบทวน<br /><span class="chrome">แล้วลองใหม่อีกครั้ง</span></h2><p class="lead muted">ทุกโปรเจกต์ทำให้ผมได้ทั้งผลงาน บทเรียน และคำถามที่ช่วยให้โปรเจกต์ถัดไปดีขึ้น</p></div>
        <div class="stats glass">${stats.map((s) => html`<div class="stat"><strong class="stat__value chrome">${s.value}</strong><span class="stat__label">${s.label}</span><p class="muted">${s.note}</p></div>`)}</div>
        <div class="profile-grid">
          <div class="profile-copy">
            <span class="eyebrow">คนเบื้องหลังโค้ด</span><h2 class="display">สวัสดีครับ ผมกิตติภัทร<br /><span class="chrome">เรียนรู้และลงมือทำต่อไป</span></h2>
            <div class="profile-copy__body glass" data-reveal><p>${a.description}</p><p class="muted">${a.detail}</p><dl class="facts"><div><dt>ที่อยู่</dt><dd>${a.location}</dd></div><div><dt>สถานะปัจจุบัน</dt><dd>${a.status}</dd></div></dl></div>
          </div>
          <figure class="portrait" data-reveal><img src="images/portrait.jpg" alt="กิตติภัทร สุวรรณศรี" width="900" height="1200" loading="lazy" decoding="async" /><figcaption class="glass"><span class="pulse-dot"></span>${a.status}</figcaption></figure>
        </div>
        ${education.length ? html`<div class="education"><span class="eyebrow">การศึกษา</span><div class="education__grid">${education.map((e) => html`<article class="education-card glass" data-reveal><span class="eyebrow">${e.year}</span><h3>${e.degree}</h3><p class="education-card__institution">${e.institution}</p><p class="muted">${e.description}</p></article>`)}</div></div>` : ''}
        ${a.philosophy ? html`<blockquote class="philosophy" data-reveal><span class="eyebrow">แนวคิดในการทำงาน</span><p>${a.philosophy}</p></blockquote>` : ''}
        ${a.interests?.length ? html`<details class="interests glass"><summary>ความสนใจนอกเหนือจากโค้ด <span aria-hidden="true">+</span></summary><div>${a.interests.map((interest) => html`<span class="tag">${interest}</span>`)}</div></details>` : ''}
      </div>
    </section>
  `;
}

export function expertiseSection(data: PortfolioData): SafeHtml {
  const expertise = data.about.expertise ?? [];
  if (!expertise.length) return html``;
  return html`
    <section class="section expertise" aria-labelledby="expertise-title"><div class="container-x expertise__layout">
      <div><span class="eyebrow">มารู้จักกันให้มากขึ้น</span><h2 id="expertise-title" class="display" data-reveal>เบื้องหลัง<br /><span class="chrome">การทำงานของผม</span></h2></div>
      <div class="expertise__list">${expertise.map((x, i) => html`
        <details id="expertise-${i}" class="xp glass" name="expertise"><summary><span>${x.area}</span><span class="xp__toggle" aria-hidden="true"></span></summary><div class="xp__body"><p>${x.description}</p></div></details>
      `)}</div>
    </div></section>
  `;
}

import { thaiLabel } from '../data/thai';
import type { PortfolioData, Project } from '../types';
import { escapeHtml, html, pad, safeUrl, raw, type SafeHtml } from '../lib/dom';
import { GITHUB_SVG } from '../lib/icons';
import { sectionLabel } from './about';

export function skillsSection(data: PortfolioData): SafeHtml {
  const categories = ['All', ...new Set(data.skills.map((s) => s.category))];
  return html`
    <section id="skills" class="section skills" data-scene="skills">
      <div class="container-x">
        ${sectionLabel(2, 'เครื่องมือและทักษะ')}
        <div class="section-head">
          <h2 class="display" data-reveal>เครื่องมือที่ผมใช้<br /><span class="chrome">ทักษะที่ผมพัฒนาต่อไป</span></h2>
          <p class="section-head__note muted" data-reveal>เทคโนโลยีที่ผมฝึกใช้ผ่านการเรียน โปรเจกต์ส่วนตัว และประสบการณ์จริง</p>
        </div>
        <div class="filters" role="group" aria-label="กรองทักษะ" data-reveal>
          ${categories.map((c, i) => html`<button type="button" class="filter ${i === 0 ? 'is-active' : ''}" aria-pressed="${i === 0}" data-filter="${c}">${thaiLabel(c)}</button>`)}
        </div>
        <div class="skills-grid glass" data-skills>
          ${data.skills.map((s, i) => {
            return html`
              <article class="skill" data-category="${s.category}">
                <div class="skill__meta"><span>${pad(i + 1)} / ${thaiLabel(s.category)}</span></div>
                <h3>${s.name}</h3>
              </article>
            `;
          })}
        </div>
        <div class="capabilities" data-reveal>
          <span class="eyebrow">จากหน้าจอถึงระบบเบื้องหลัง</span>
          <h2 class="display">จากส่วนติดต่อผู้ใช้<br /><span class="chrome">สู่การทำงานเบื้องหลัง</span></h2>
          <p class="lead muted">ผมชอบเชื่อมต่อสิ่งที่ผู้ใช้เห็นเข้ากับข้อมูลและการทำงานของระบบที่อยู่เบื้องหลัง</p>
          <div class="capabilities__panel glass">
            <table>
              <caption class="sr-only">ทักษะการพัฒนาส่วนติดต่อผู้ใช้และระบบเบื้องหลัง</caption>
              <thead><tr><th scope="col">ด้านการพัฒนา</th><th scope="col"><span class="eyebrow">สิ่งที่ผู้ใช้เห็น</span>ส่วนติดต่อผู้ใช้<span class="muted">หน้าจอชัดเจน รองรับทุกอุปกรณ์</span></th><th scope="col"><span class="eyebrow">การทำงานของระบบ</span>ระบบเบื้องหลัง<span class="muted">ระบบที่ขับเคลื่อนการใช้งาน</span></th></tr></thead>
              <tbody>
                <tr><th scope="row">จุดเน้น</th><td>การจัดวาง การโต้ตอบ และการเข้าถึง</td><td>การเชื่อมต่อ ข้อมูล และการทำงานของระบบ</td></tr>
                <tr><th scope="row">เครื่องมือ</th><td>${data.skills.filter((s) => ['frontend', 'creative'].includes(s.category.toLowerCase())).map((s) => s.name).join(' · ') || 'เลือกให้เหมาะกับโปรเจกต์'}</td><td>${data.skills.filter((s) => ['backend', 'database'].includes(s.category.toLowerCase())).map((s) => s.name).join(' · ') || 'เลือกให้เหมาะกับโปรเจกต์'}</td></tr>
                <tr><th scope="row">เป้าหมาย</th><td>ประสบการณ์ที่ใช้งานง่ายและเป็นธรรมชาติ</td><td>ระบบพื้นฐานที่รองรับการใช้งาน</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  `;
}

function projectCard(p: Project, i: number, rail: boolean): SafeHtml {
  const repo = safeUrl(p.repoLink || p.link);
  const demo = safeUrl(p.demoLink);
  const image = safeUrl(p.image);
  const primary = demo || repo;
  return html`
    <article class="project ${rail ? 'project--rail' : 'project--stack'}" style="--i:${i}">
      <div class="project__inner">
        <a class="project__media" ${primary ? raw(`href="${escapeHtml(primary)}" target="_blank" rel="noopener"`) : ''} aria-label="${p.title}" ${primary ? html`data-cursor="เปิด"` : ''}>
          ${image ? html`<img src="${image}" alt="${p.title}" loading="lazy" decoding="async" width="1440" height="900" />` : html`<span class="project__placeholder">${p.title.slice(0, 2)}</span>`}
        </a>
        <span class="project__badge glass">${demo ? 'โปรเจกต์ที่เปิดใช้งาน' : 'ผลงานที่คัดสรร'}</span>
        <div class="project__info glass">
          <span class="eyebrow">โปรเจกต์ ${pad(i + 1)}</span>
          <h3>${p.title}</h3>
          <p class="project__desc">${p.description}</p>
          <div class="project__bottom"><span class="tag">${p.tech}</span>
            <div class="project__links">
              ${repo ? html`<a href="${repo}" target="_blank" rel="noopener" aria-label="${p.title} ที่เก็บซอร์สโค้ด">${raw(GITHUB_SVG)}<span>ซอร์สโค้ด</span></a>` : ''}
              ${demo ? html`<a href="${demo}" target="_blank" rel="noopener" aria-label="เปิด ${p.title}">ดูเว็บไซต์ <i data-lucide="arrow-up-right"></i></a>` : ''}
            </div>
          </div>
        </div>
      </div>
    </article>
  `;
}

export function projectsSection(data: PortfolioData): SafeHtml {
  const stacked = data.projects.slice(0, 3);
  const remaining = data.projects.slice(3);
  return html`
    <section id="projects" class="section projects" data-scene="projects">
      <div class="container-x">
        <div class="section-head">
          <div>${sectionLabel(3, 'ผลงานที่คัดสรร')}<h2 class="display" data-reveal>สิ่งที่ผมสร้าง<br /><span class="chrome">สิ่งที่ผมเรียนรู้</span></h2></div>
          <a href="https://github.com/Ph4tZ4" class="text-link" target="_blank" rel="noopener">ดูทั้งหมดบน GitHub <span aria-hidden="true">→</span></a>
        </div>
        <div class="project-stack">${stacked.map((p, i) => projectCard(p, i, false))}</div>
        ${!stacked.length ? html`<p class="muted">กำลังเตรียมโปรเจกต์ใหม่ ระหว่างนี้ดูผลงานของผมบน GitHub ได้ครับ</p>` : ''}
      </div>
      ${remaining.length ? html`
        <div class="project-rail-wrap">
          <div class="container-x rail-controls"><span class="muted">ผลงานอื่น ๆ ของผม</span><div>
            <button type="button" class="round glass" data-rail-prev aria-label="โปรเจกต์ก่อนหน้า" aria-controls="project-rail">←</button>
            <button type="button" class="round glass" data-rail-next aria-label="โปรเจกต์ถัดไป" aria-controls="project-rail">→</button>
          </div></div>
          <div id="project-rail" class="project-rail" tabindex="0" role="region" aria-label="โปรเจกต์เพิ่มเติม" data-project-rail>${remaining.map((p, i) => projectCard(p, i + 3, true))}</div>
        </div>
      ` : ''}
    </section>
  `;
}

export function certificatesSection(data: PortfolioData): SafeHtml {
  const certs = data.certificates ?? [];
  return html`
    <section id="certificates" class="section" data-scene="certificates">
      <div class="container-x">
        ${sectionLabel(4, 'เรียนรู้อย่างต่อเนื่อง')}
        <div class="section-head"><h2 class="display" data-reveal>ก้าวสำคัญบน<br /><span class="chrome">เส้นทางการเรียนรู้</span></h2><p class="muted section-head__note">หลักสูตร เกียรติบัตร และประสบการณ์ที่ช่วยให้ผมเติบโต เลือกเกียรติบัตรเพื่อดูรายละเอียด</p></div>
        ${certs.length ? html`<div class="certs">${certs.map((c, i) => {
          const image = safeUrl(c.image);
          return html`
            <button type="button" class="cert" data-cert="${i}" data-reveal data-cursor="ดูรายละเอียด">
              <span class="cert__media">${image ? html`<img src="${image}" alt="" loading="lazy" decoding="async" width="640" height="400" />` : html`<i data-lucide="award"></i>`}<span class="cert__date glass">${c.date}</span></span>
              <span class="cert__body"><span class="cert__issuer">${c.issuer}</span><span class="cert__title">${c.title}</span><span class="text-link">ดูเกียรติบัตร <span aria-hidden="true">→</span></span></span>
            </button>
          `;
        })}</div>` : html`<p class="muted">จะมีผลงานการเรียนรู้เพิ่มเติมเร็ว ๆ นี้</p>`}
      </div>
    </section>
  `;
}

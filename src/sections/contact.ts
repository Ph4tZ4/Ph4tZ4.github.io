import { html, type SafeHtml } from '../lib/dom';

export const EMAIL = 'pikanomwaan.code@gmail.com';
const SOCIALS = [
  { name: 'Instagram', href: 'https://www.instagram.com/k._.kttp.q' },
  { name: 'TikTok', href: 'https://www.tiktok.com/@k._.kttp.q' },
  { name: 'X / Twitter', href: 'https://x.com/Ph4tZ4' },
  { name: 'GitHub', href: 'https://github.com/Ph4tZ4' },
] as const;

export function contactSection(): SafeHtml {
  return html`
    <section id="contact" class="contact" data-scene="contact">
      <div class="container-x contact__inner" data-reveal>
        <span class="eyebrow">มาเรียนรู้และสร้างผลงานไปด้วยกัน</span>
        <h2 class="contact__title">มีไอเดียอยากลองทำไหมครับ?<br /><span class="chrome">มาคุยกันครับ</span></h2>
        <p class="lead muted">หากมีโปรเจกต์ อยากร่วมงาน หรือมีเรื่องที่อยากแนะนำให้ผมเรียนรู้ ยินดีพูดคุยครับ</p>
        <div class="contact__actions"><a href="mailto:${EMAIL}" class="btn btn--primary">เริ่มพูดคุย <i data-lucide="arrow-up-right"></i></a><a href="Docs/KittiphatCV.pdf" class="btn btn--glass glass" download target="_blank" rel="noopener">ดาวน์โหลดประวัติส่วนตัว <i data-lucide="download"></i></a></div>
        <button type="button" class="copy-btn glass" data-copy="${EMAIL}" aria-live="polite"><i data-lucide="copy"></i><span>คัดลอกอีเมล</span></button>
      </div>
    </section>
    <footer class="footer">
      <div class="container-x">
        <div class="footer__top">
          <div class="footer__brand"><a href="#home" class="logo" data-scroll-to><span class="logo__mark" aria-hidden="true">pk<span>↗</span></span><span>pikanomwaan<span class="muted">.code</span></span></a><p>นักศึกษาที่เรียนรู้จากการลงมือทำ<br />เว็บไซต์ ซอฟต์แวร์ และบทเรียนระหว่างทาง</p><a href="mailto:${EMAIL}" class="footer__email">${EMAIL}</a></div>
          <div class="footer__column"><h3>สำรวจเว็บไซต์</h3><a href="#about" data-scroll-to>เกี่ยวกับผม</a><a href="#projects" data-scroll-to>ผลงานที่คัดสรร</a><a href="#skills" data-scroll-to>ทักษะ</a><a href="#journey" data-scroll-to>เส้นทางของผม</a><a href="#certificates" data-scroll-to>เกียรติบัตร</a></div>
          <div class="footer__column"><h3>ช่องทางติดตาม</h3>${SOCIALS.map((s) => html`<a href="${s.href}" target="_blank" rel="noopener">${s.name} ↗</a>`)}</div>
          <div class="footer__column"><h3>ทักทายกัน</h3><a href="mailto:${EMAIL}">ส่งอีเมล ↗</a><a href="Docs/KittiphatCV.pdf" target="_blank" rel="noopener">ดาวน์โหลดประวัติส่วนตัว ↗</a><p class="muted">ประเทศไทย · <span data-clock>--:--</span> GMT+7</p></div>
        </div>
        <div class="footer__base"><span>© ${new Date().getFullYear()} กิตติภัทร สุวรรณศรี</span><span>เรียนรู้ไปทีละโปรเจกต์</span><button type="button" data-scroll-top>กลับด้านบน ↑</button></div>
      </div>
    </footer>
  `;
}

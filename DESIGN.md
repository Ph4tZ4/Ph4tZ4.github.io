# Monochrome Glass — Design System

คู่มือสร้างธีมดำ–เงินแบบ cinematic: ตัวอักษรใหญ่ กระจกสีดำโปร่งแสง ขอบสะท้อนแสงบาง ๆ และการเคลื่อนไหวที่นุ่มนวล อ้างอิงจากธีมที่ทำไว้ใน PIKANOMWAAN.CODE และแนวภาพของ [AW Media & Marketing](https://awmedia.marketing/)

ไฟล์นี้ใช้ได้ด้วยตัวเองในโปรเจกต์อื่น ไม่ผูกกับ Vite, Tailwind, React หรือข้อมูลของเจ้าของเว็บไซต์เดิม ชื่อธีม `Monochrome Glass` ใช้เรียกทิศทางเดียวกันระหว่างคนออกแบบ คนพัฒนา และ AI

## 1. วิธีใช้ในโปรเจกต์ใหม่

1. อ่านกติกาธีมและนำ CSS ตั้งต้นในข้อ 3 ไปใส่ในระบบสไตล์ของโปรเจกต์ ถ้ามี design tokens อยู่แล้ว ให้จับคู่ชื่อกับค่าที่ระบุ
2. ใช้ชื่อแบรนด์ เนื้อหา รูปภาพ และการกระทำหลักของโปรเจกต์ปลายทาง เลือกเฉพาะรูปแบบคอมโพเนนต์ที่ตอบโจทย์หน้านั้น
3. ทำโครงสร้างและ responsive ให้ครบก่อนเพิ่มแอนิเมชัน โดยใช้ค่าขนาดและพฤติกรรมจากตารางด้านล่าง
4. ตรวจตาม checklist ในข้อ 11 และบอกให้ชัดว่าส่วนใดทดสอบแล้วหรือยังไม่ได้ทดสอบ

**สิ่งที่กำหนดอัตลักษณ์:** พื้นดำจริง ฟอนต์ sans-serif สีขาวกับเงิน ลำดับขนาดตัวอักษรชัดเจน พื้นผิวกระจกมืด ขอบบาง ปุ่มหลักสีขาว และองค์ประกอบที่มีพื้นที่หายใจ

**สิ่งที่ปรับตามงาน:** เนื้อหา จำนวน section รูปภาพ โลโก้ การมีวิดีโอ hero, project stack, marquee, ตัวเลขสถิติ หรือ custom cursor ธีมนี้ไม่บังคับให้ทุกโปรเจกต์เป็นหน้า portfolio

## 2. ภาษาภาพและลำดับความสำคัญ

| องค์ประกอบ | กติกา |
| --- | --- |
| พื้นหลัง | ดำ `#000000` เป็นพื้นที่หลัก แยกส่วนด้วยช่องว่างและพื้นผิว มากกว่าการเปลี่ยนสีพื้นทุก section |
| จุดเด่น | สร้างจากขนาดตัวอักษร ความสว่าง และองค์ประกอบภาพ ใช้สีขาวเป็น action หลัก |
| มิติ | ใช้กระจกมืด ขอบสะท้อนแสง และเงาดำที่ฟุ้งอย่างพอดี |
| Gradient | จำกัดไว้ที่ข้อความเงิน ผิวกระจก ปุ่มขาว และแสงบรรยากาศจาง ๆ |
| รูปทรง | ปุ่มและ navigation เป็น capsule; panel เป็นสี่เหลี่ยมมุมโค้ง; icon action เป็นวงกลม |
| การจัดวาง | ข้อความใหญ่สลับกับข้อมูลที่กระชับ แต่ละ section มีหน้าที่และจุดเด่นของตัวเอง |
| เนื้อหา | ใช้ข้อความจริงและ CTA ที่บอกการกระทำชัดเจน แสดงเฉพาะตัวเลขหรือความสามารถที่มีข้อมูลรองรับ |

รักษาโทนขาว–เทา–ดำเป็นหลัก สีสถานะของระบบ เช่น error หรือ success ใช้ได้เมื่อช่วยให้ผู้ใช้เข้าใจผลลัพธ์ และต้องมีข้อความหรือไอคอนประกอบ

## 3. Design tokens และ CSS ตั้งต้น

ค่าต่อไปนี้ถอดจากธีมที่ทำไว้ ใช้เป็นฐานสำหรับการนำไปใช้ใหม่ โค้ดชุดนี้ไม่มี dependency และเป็นเพียงแกนของธีม; component layouts และ interactions ต้องทำตามข้อ 5–9 เพิ่มเติม

```css
:root {
  color-scheme: dark;
  --bg: #000000;
  --surface: #101012;
  --ink: #f5f5f7;
  --muted: #b0b0b6;
  --quiet: #95959d;
  --line: #ffffff20;
  --gutter: clamp(20px, 4.6vw, 64px);
  --max-width: 1280px;
  --radius: 32px;
  --ease: cubic-bezier(.16, 1, .3, 1);
  font-family: 'Rethink Sans', 'IBM Plex Sans Thai', system-ui, sans-serif;
  background: var(--bg);
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
}

* { box-sizing: border-box; }
body { margin: 0; font-size: 17px; line-height: 1.5; }
img, video { display: block; max-width: 100%; }
button, input, textarea, select { font: inherit; }
button, a { -webkit-tap-highlight-color: transparent; }
[hidden] { display: none !important; }
:focus-visible { outline: 2px solid #ffffff; outline-offset: 5px; }
::selection { background: #ffffff; color: #000000; }

.container {
  width: 100%;
  max-width: calc(var(--max-width) + var(--gutter) * 2);
  margin-inline: auto;
  padding-inline: var(--gutter);
}
.section { padding-block: 10vh; }
.display {
  font-size: clamp(40px, 6.2vw, 96px);
  font-weight: 600;
  line-height: .98;
  letter-spacing: -.045em;
}
.chrome {
  color: transparent;
  background: linear-gradient(#ffffff 8%, #d4d4d9 46%, #8a8a90 96%);
  background-clip: text;
  -webkit-background-clip: text;
  padding-bottom: .1em;
}
.glass {
  position: relative;
  isolation: isolate;
  background: linear-gradient(#ffffff10, #ffffff05);
  border: 1px solid #ffffff1f;
  box-shadow: inset 0 1px #ffffff18, 0 20px 60px -30px #00000099;
}
.glass::before {
  content: '';
  position: absolute;
  z-index: -1;
  inset: -1px;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg, #ffffff65, #ffffff12 26%, #ffffff04 55%, #ffffff35);
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask-composite: exclude;
  pointer-events: none;
}
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 52px;
  padding: 17px 30px;
  border: 0;
  border-radius: 999px;
  font: inherit;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: transform .5s var(--ease), box-shadow .5s var(--ease);
}
.btn:hover { transform: translateY(-2px); }
.btn--primary {
  color: #080808;
  background: linear-gradient(#ffffff, #e6e6eb);
  box-shadow: inset 0 1px #ffffff, 0 14px 40px -12px #ffffff73;
}
.btn--glass {
  color: var(--ink);
  background: linear-gradient(#28282c8c, #12121480);
  border: 1px solid var(--line);
  backdrop-filter: blur(22px);
}
@media (max-width: 760px) {
  :root { --radius: 24px; }
  body { font-size: 16px; }
  .display { font-size: clamp(32px, 9.4vw, 58px); }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
```

โหลด `Rethink Sans` น้ำหนัก 400, 500, 600, 700, 800 และ `IBM Plex Sans Thai` น้ำหนัก 400, 500, 600 ผ่านระบบ font ของโปรเจกต์ ใช้ `font-display: swap` และเก็บ system fallback ไว้เสมอ การประกาศชื่อใน `font-family` อย่างเดียวไม่ได้โหลดไฟล์ฟอนต์

## 4. Typography และระยะห่าง

| ระดับ | ขนาด desktop / fluid | น้ำหนัก / line-height / tracking |
| --- | --- | --- |
| Hero H1 | `clamp(54px, 9.5vw, 158px)` | 700 / `.92` / `-.055em` |
| Section heading | `clamp(40px, 6.2vw, 96px)` | 600 / `.98` / `-.045em` |
| Statement | `clamp(34px, 5.4vw, 86px)` | 600 / `1.05` / `-.042em` |
| Split-layout heading | `clamp(38px, 4.3vw, 66px)` | 600 / ประมาณ `1` / tracking แบบ display |
| Card heading | 20–28px; featured card สูงสุด 46px | 600 / `1.1–1.25` / `-.025em` ถึง `-.04em` |
| Lead paragraph | `clamp(17px, 1.32vw, 20px)` | 400 / `1.65` / ปกติ |
| Body | 17px desktop, 16px mobile | 400 / `1.5–1.75` / ปกติ |
| Eyebrow | 12px | 600 / `1.5` / `.2em`; uppercase สำหรับภาษาอังกฤษ |
| Navigation / utility | 14–15px | 400–600 / ปกติ |

- ให้หนึ่งหน้ามี H1 เดียว และเรียง H2/H3 ตามโครงสร้างเนื้อหา
- ใช้สีเงิน `.chrome` เน้นหนึ่งบรรทัดหรือวลีใน heading ข้อความเนื้อหาปกติใช้สีทึบ
- จำกัดเนื้อหาที่ต้องอ่านต่อเนื่องประมาณ 560–680px; คำโปรยด้านข้างประมาณ 330–460px
- ภาษาไทยใช้ tracking ปกติ และเพิ่ม line-height ของ heading ประมาณ `1.2–1.4` ตามฟอนต์จริง; ย่อหน้าประมาณ `1.7–1.8` ให้สระและวรรณยุกต์มีพื้นที่
- การขึ้นบรรทัด hero บน desktop ตั้งใจให้เป็นสองบรรทัด แต่บนมือถือให้ข้อความจริงและความอ่านง่ายเป็นตัวกำหนดขนาด ปรับสูตร `vw` เมื่อข้อความยาวกว่าต้นแบบ
- ระดับระยะห่างหลัก: 8/12px ภายใน control, 16/20/24px ระหว่างองค์ประกอบ, 26/32/38px ภายใน panel และ 5/7/10vh ระหว่างกลุ่มเนื้อหาของหน้า marketing
- มุมโค้ง: 999px สำหรับ capsule, 22–24px สำหรับ card เล็ก, 28px สำหรับ panel, 32px สำหรับกลุ่มใหญ่ ลดมุมโค้งใหญ่เหลือ 24px บนมือถือ

## 5. พื้นผิว แสง และภาพ

**Glass panel:** ใช้ gradient โปร่งแสงและ border จาก CSS ตั้งต้น กำหนด `border-radius` ที่ตัวคอมโพเนนต์เอง

**Glass overlay:** navigation และ caption ที่ทับภาพใช้พื้นเข้มเพิ่ม เช่น `linear-gradient(#18181ac7, #0a0a0cb0)` กับ `backdrop-filter: blur(22px) saturate(150%)` เพื่อให้อ่านได้บนภาพหลายแบบ ส่วน card จำนวนมากที่อยู่บนพื้นดำใช้ผิวกระจกธรรมดาโดยไม่ต้อง blur ทุกใบ

**Ambient light:** ใช้ radial gradient สีขาว opacity ต่ำ เช่น `#ffffff0d` ถึง `#ffffff12` ฟุ้งรอบ hero/contact เป็นฉากหลัง ปิด pointer events ของ decoration

**Hero media:** ใช้ภาพหรือวิดีโอของโปรเจกต์ ตั้ง `object-fit: cover` พร้อม `grayscale(1) contrast(1.12) brightness(.62)` และ dark overlay เพื่อคุม contrast ของข้อความ

**Editorial media:** ภาพบทความ/ผลงานใน rail ใช้ grayscale แล้วคืนสีเมื่อ hover พร้อม scale ประมาณ `1.025–1.04` ภาพผลงานหลักแสดงสีจริงได้ ภาพใบรับรองหรือเอกสารเต็มใน modal ใช้ `object-fit: contain`

กำหนด width/height หรือ aspect ratio ล่วงหน้า รูปด้านล่างใช้ lazy loading และให้ poster ของ hero แสดงได้ทันทีเมื่อวิดีโอไม่พร้อมใช้

## 6. Component recipes

| Component | รูปแบบและขนาด | พฤติกรรม |
| --- | --- | --- |
| Floating navigation | กว้างสูงสุด 1180px, สูง 60px, ห่างขอบบน 14px, capsule, glass blur 22px | โลโก้ซ้าย ลิงก์กลาง CTA ขวา; anchor ต้องเผื่อ header ประมาณ 100–110px |
| Primary button | พื้นขาวไล่เทาอ่อน ตัวอักษรเกือบดำ, padding `17px 30px`, icon 18px | Hover ยก 2px เพิ่ม glow; ใช้หนึ่ง action หลักต่อกลุ่ม |
| Secondary button | Glass capsule ขอบขาวโปร่งแสง | ความเด่นรองจากปุ่มขาว มีข้อความบอกการกระทำ |
| Compact button | Font 14px, padding `11px 20px`, สูงประมาณ 42–44px | ใช้ใน navigation; พื้นที่กดบนจอสัมผัสอย่างน้อย 44px |
| Eyebrow / badge | Uppercase 10–12px, tracking `.15–.2em`; dot สีขาว 6–7px | ใช้ระบุประเภท/สถานะสั้น ๆ; ภาษาไทยใช้ tracking ปกติ |
| Expertise cells | Grid 3 คอลัมน์ใน panel เดียว, สูงอย่างน้อย 230px, padding ประมาณ 32px | เลข/ประเภทด้านบน ชื่อด้านล่าง ลูกศรวงกลมมุมขวาบน; hover สว่างขึ้นเล็กน้อย |
| Featured browser | กว้างสูงสุด 1240px, radius 30px, toolbar 48px, จุด 11px, screen `1440 / 900` | ใช้โชว์หน้าเว็บจริง URL/ลิงก์ต้องตรงกับผลงาน |
| Project stack | 3 panel แรก, สูง `min(76vh, 780px)`, sticky top `94px + index * 16px` | Caption กระจกซ้ายล่าง inset 22px, กว้างสูงสุด 600px; panel ก่อนหน้าลด scale ถึง `.94` เมื่อใบถัดไปเข้ามา |
| Project rail | Card กว้าง `clamp(272px, 32vw, 460px)`, gap 20px, ภาพ `4 / 3` | Native horizontal overflow + scroll snap มีปุ่มก่อน/ถัดไป และใช้ keyboard/touch ได้ |
| Comparison table | Glass radius 32px, label column 24%, cell padding `22px 28px` | ใช้เส้นแบ่งบาง; บนมือถือเรียงค่าของแต่ละหัวข้อพร้อมชื่อคอลัมน์กำกับ |
| Process / timeline | Desktop สองคอลัมน์ `1fr 1.1fr`, gap 6vw; หัวข้อและเลข sticky ที่ 16vh | Card radius 28px, padding `34px 38px 38px`; อัปเดตเลขและ progress ตามรายการที่อ่าน |
| Stats strip | 4 คอลัมน์ใน glass panel เดียว, ตัวเลข 44–66px | คั่นด้วยเส้นบาง; ใช้ตัวเลขที่มีข้อมูลจริง |
| Editorial card | ภาพ `16 / 10`, radius 24px, gap 22px, heading ประมาณ 21px | เนื้อหาใต้ภาพไม่ต้องใส่พื้น/เงารอบทุก card เหมาะกับบทความ ใบรับรอง หรือ resource |
| Accordion | Radius 22px, summary padding `24px 28px`, font 18px | ใช้ `<details>/<summary>` มีเครื่องหมาย + เปลี่ยนเป็น − เมื่อเปิด; deep link เปิดรายการเป้าหมายได้ |
| Modal | กว้างสูงสุด 1120px, สูงไม่เกิน `100svh - 48px`, radius 28px | Native dialog หรือ dialog เดิมของโปรเจกต์; backdrop ดำและ blur; รูป contain; ปิดด้วย Escape และคืน focus |
| Contact section | จัดกลาง, heading `clamp(34px, 6vw, 108px)`, padding `17vh 0 15vh` | คำอธิบายกว้างสูงสุด 620px ปุ่มหลักและปุ่มรองวางเป็นกลุ่ม |
| Footer / contact dock | Footer เส้นบนบางและหลายคอลัมน์; dock เป็น glass capsule ห่างขอบ 18px | Dock ต้องไม่บังข้อความ control วิดีโอ หรือปุ่มปิดบนหน้าจอเล็ก |

ฟอร์มและหน้าที่มีข้อมูลหนาแน่นเป็นแนวทางขยายธีม ไม่ใช่ส่วนที่มีตัวอย่างครบในหน้า portfolio: ใช้พื้น `--surface`, border `--line`, label ชัดเจน, focus สีขาว, error พร้อมข้อความ และ action loading ที่ป้องกันการส่งซ้ำ

## 7. Responsive rules

ใช้ความกว้าง viewport หน่วย CSS pixel เป็นเกณฑ์ ปรับตามความยาวเนื้อหาจริงเมื่อพบการชนกันขององค์ประกอบ

| Breakpoint | การเปลี่ยนแปลง |
| --- | --- |
| มากกว่า 1200px | Layout desktop เต็ม, navigation และ footer หลายคอลัมน์ |
| ไม่เกิน 1200px | ย่อรายละเอียดโลโก้/จัด footer ใหม่ตามพื้นที่ |
| ไม่เกิน 1100px | ซ่อนลิงก์ navigation แถวกลาง แสดง menu toggle และแผงเมนูใต้แถบลอย |
| ไม่เกิน 1024px | Grid 3 คอลัมน์เป็น 2; stats 4 เป็น 2; process และ accordion layout เป็นคอลัมน์เดียว; ยกเลิก sticky ของหัวข้อ process |
| ไม่เกิน 760px | Body 16px, radius หลัก 24px, nav สูง 56px ห่างขอบ 10px; hero/contact CTA เรียงลง; expertise/editorial/profile เป็นคอลัมน์เดียว |
| ไม่เกิน 400px | Skill grid เป็นคอลัมน์เดียว ลดรายละเอียดรองที่ชนกัน พร้อมคง action และข้อมูลสำคัญ |

ค่ามือถือเพิ่มเติม: section heading `clamp(32px, 9.4vw, 58px)`, browser toolbar 38px, project caption inset 12px/padding 18px/radius 20px และ rail card กว้าง 78vw

Project stack บนมือถือใช้ top `84px + index * 10px`, สูง `min(70svh, 600px)` และ min-height 420px ได้เฉพาะเมื่อเนื้อหาพอดี ถ้า caption ยาวหรือจอเตี้ยให้แสดง card ตาม flow ปกติเพื่อให้ทุกบรรทัดและทุกลิงก์เข้าถึงได้

## 8. Motion และ interaction

แอนิเมชันเป็นชั้นเสริม หน้าเว็บและการกระทำหลักต้องยังใช้งานได้เมื่อปิด motion

| เอฟเฟกต์ | ค่าเริ่มต้น |
| --- | --- |
| CSS easing | `cubic-bezier(.16, 1, .3, 1)` |
| Hero intro | Fade + translateY 28px → 0, 1.2s, stagger .12s, `expo.out` |
| Section reveal | Fade + translateY 28px → 0, 1s, stagger .07s, เริ่มเมื่อ top เข้าถึงประมาณ 92% ของ viewport, เล่นครั้งเดียว |
| Hover | .3–.5s; รูป scale ใช้ 1.2–1.4s; button shine ใช้ .9s |
| Marquee | 38s ต่อรอบ linear สองแถวสวนทางกัน; duplicate content เป็น decoration และซ่อนจาก screen reader |
| Browser frame | Scale .92 → 1 และ rotateX 6deg → 0 ตาม scroll, perspective 1800px |
| Sticky cards | Scale 1 → .94 และลดความสว่างของใบก่อนหน้าเมื่อใบถัดไปเข้ามา |
| Smooth anchor | ประมาณ 1.2s, easing `1 - (1 - t)^4`, offset ประมาณ −100px |
| Hero parallax | เคลื่อนภาพพื้นหลังแนวตั้งได้ประมาณ 18% ตลอดช่วงออกจาก hero |

- เลือก motion เฉพาะจุดที่ช่วยลำดับการอ่าน ใช้ CSS สำหรับ hover และใช้ animation library เดิมของโปรเจกต์เมื่อจำเป็นต้องผูกกับ scroll
- ถ้าใช้ GSAP แบบโปรเจกต์นี้ ให้จัดการ cleanup ของ context/listener เมื่อ unmount หรือ render ข้อมูลใหม่ และ refresh ตำแหน่งเมื่อภาพหรือ accordion เปลี่ยนความสูง
- Smooth scrolling เป็นตัวเลือก ถ้าไม่มี dependency เดิม ใช้ native scrolling ได้; keyboard และ touch ต้องทำงานตามปกติ
- เมนูมือถือมี `aria-expanded`/`aria-controls`; เมนูที่ปิดต้องไม่รับ focus; Escape ปิดและคืน focus ไปที่ toggle; ขณะเปิดต้องควบคุมลำดับ focus และหยุดการเลื่อนพื้นหลัง
- ปุ่ม filter ใช้ `aria-pressed`; เมื่อกรองให้ซ่อนรายการจริงพร้อมอัปเดต layout ไม่เหลือช่องว่างของรายการที่ซ่อน
- Autoplay ใช้ `muted`, `playsinline`, poster และปุ่ม pause; `prefers-reduced-motion` หรือ save-data ใช้ภาพนิ่ง; เล่นไม่สำเร็จให้คง poster และพักวิดีโอเมื่อออกนอก viewport
- CSS reduced-motion เพียงอย่างเดียวไม่หยุด animation library หรือวิดีโอ ต้องตรวจ preference ใน JavaScript ก่อนเริ่มด้วย
- Custom cursor เป็นตัวเลือกบน fine pointer ใช้วงหลัก 40px, hover 56px, media label 88px; ปิดบน touch/reduced motion และคง native cursor เมื่อเอฟเฟกต์ไม่พร้อม

## 9. ปรับธีมให้เข้ากับประเภทโปรเจกต์

**Landing page / portfolio / studio:** ใช้ hero, visual proof, expertise, featured work, process, FAQ และ CTA ตามเนื้อหาที่มี ลำดับตัวอย่างคือ Navigation → Hero → Featured preview → Tools/clients → Intro → Work → Comparison → Process → Stats → Editorial content → Accordion → CTA → Footer

**Dashboard / SaaS / internal tool:** คงสี ฟอนต์ surface, border และปุ่มของธีม แต่เริ่มจากหัวข้อหน้า toolbar และข้อมูลหลัก ใช้ระยะภายในประมาณ 16–24px และ heading ประมาณ 24–40px แทน section สูง 10vh เพื่อให้ทำงานกับข้อมูลได้สะดวก

**ร้านค้า / booking / form flow:** ให้ราคา ตัวเลือก สถานะ และ CTA อ่านชัดบนพื้นทึบ เพิ่ม empty/loading/error/success states ให้ครบ ลดภาพเคลื่อนไหวในขั้นตอนที่ผู้ใช้ต้องตัดสินใจหรือกรอกข้อมูล

## 10. คำสั่งพร้อมใช้สำหรับ AI

คัดลอกไฟล์นี้ไปยัง root ของโปรเจกต์ใหม่ แล้วแนบคำสั่งนี้พร้อมระบุหน้าหรือ flow ที่ต้องการ:

```text
อ่าน DESIGN.md และใช้ธีม Monochrome Glass กับ [หน้า/flow ที่ต้องการ]
นำสี ฟอนต์ typography, glass surfaces, button hierarchy และ responsive rules
จากเอกสารมาใช้กับ component และ stack ที่โปรเจกต์นี้มีอยู่

ใช้แบรนด์ เนื้อหา และข้อมูลจริงของโปรเจกต์นี้ เลือก layout ให้เหมาะกับหน้าที่ของหน้า
รักษาการทำงานเดิมและทำ empty/loading/error states ที่เกี่ยวข้องให้ครบ
เพิ่ม motion ตามความจำเป็น พร้อม keyboard access และ reduced-motion fallback
ตรวจ desktop/mobile, text overflow, focus และ controls ก่อนส่งงาน
รายงานสิ่งที่ตรวจผ่านและส่วนที่ยังตรวจไม่ได้ตามจริง
```

ถ้าต้องการให้ agent ของ repository อ่านธีมนี้ทุกครั้งที่ทำ UI ให้เพิ่มข้อความนี้ในไฟล์คำสั่งของโปรเจกต์นั้นด้วยตนเอง: `เมื่อสร้างหรือแก้ UI ให้อ่าน DESIGN.md และใช้กติกา Monochrome Glass`

## 11. Checklist ก่อนส่งงาน

- [ ] พื้นดำ โทนเงิน ผิวกระจก typography และปุ่มหลักตรงตามธีม
- [ ] เนื้อหา/รูปภาพ/CTA เป็นของโปรเจกต์ปลายทาง และลิงก์ทำงานจริง
- [ ] ตรวจอย่างน้อยที่ความกว้าง 360, 390, 768, 1024 และ 1440px พร้อมจอเตี้ยและ browser zoom 200%
- [ ] ภาษาไทย ข้อความยาว ข้อมูลว่าง และจำนวนรายการมากไม่ถูกตัดหรือทับกัน
- [ ] ไม่มี horizontal overflow นอก rail ที่ตั้งใจให้เลื่อน; sticky card ไม่ซ่อนเนื้อหา
- [ ] เมนู accordion, filter, rail และ modal ใช้ keyboard ได้ มี focus ที่มองเห็น และคืน focus ถูกต้อง
- [ ] ตรวจ contrast บนพื้นหลังจริง รวมถึงข้อความที่ทับภาพ ข้อความรอง และสถานะ disabled
- [ ] Reduced motion หยุดทั้ง CSS/JS animation และ autoplay; วิดีโอถูกบล็อกแล้วยังมีภาพนิ่ง
- [ ] Fixed header/dock, ปุ่ม pause และ modal controls ไม่บังกันหรือบังเนื้อหาบนมือถือ
- [ ] รูปมีขนาดที่จองไว้ การโหลดข้อมูลไม่ทำให้หน้าเสีย และ cleanup interaction เมื่อเปลี่ยนหน้าแล้ว
- [ ] รัน build/checks ของโปรเจกต์และระบุขอบเขตการตรวจจริง; checklist นี้เป็นเกณฑ์ ไม่ใช่หลักฐานว่าทุกข้อผ่านแล้ว

## 12. ที่มาและตัวอย่างใน repository นี้

ตัวอย่างที่ใช้ศึกษาต่อได้เมื่ออยู่ใน repository ต้นทาง:

- [CSS ของธีม](src/styles/main.css)
- [Hero, browser preview และ marquee](src/sections/hero.ts)
- [Project stack, skills และ editorial cards](src/sections/works.ts)
- [Process, profile และ accordion](src/sections/about.ts)
- [Contact และ footer](src/sections/contact.ts)
- [Scroll animations](src/fx/motion.ts) และ [UI interactions](src/ui.ts)

ลิงก์ไฟล์ในส่วนนี้เป็นตัวอย่างเพิ่มเติม คู่มือข้อ 1–11 ไม่ต้องใช้ไฟล์เหล่านี้จึงจะอ่านรู้เรื่อง เมื่อนำไปโปรเจกต์อื่นให้เตรียมภาพและวิดีโอของโปรเจกต์นั้นแยกต่างหาก

สื่อฉากหลังที่ใช้ในตัวอย่างปัจจุบันมาจาก reference:

- `images/studio-background.webp` ← https://awmedia.marketing/glass/img/hero-poster.webp
- `images/studio-background.mp4` ← https://awmedia.marketing/glass/video/hero-cinematic.webm

สถานะการตรวจของหน้า portfolio ต้นทาง: `npm test` และ production build ผ่าน; มีการตรวจ interaction ใน jsdom และภาพ hero บน Safari desktop แล้ว การตรวจภาพมือถือและ interaction ครบทุก flow ในเบราว์เซอร์จริงยังไม่ครบ สถานะนี้ไม่ใช่ผลตรวจของโปรเจกต์ที่นำธีมไปใช้ใหม่

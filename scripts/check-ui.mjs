import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { runInNewContext } from 'node:vm';

// Render the real sections without a browser or extra test dependencies.
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const [{ defaultData }, hero, about, works, contact] = await Promise.all([
    server.ssrLoadModule('/src/data/defaults.ts'),
    server.ssrLoadModule('/src/sections/hero.ts'),
    server.ssrLoadModule('/src/sections/about.ts'),
    server.ssrLoadModule('/src/sections/works.ts'),
    server.ssrLoadModule('/src/sections/contact.ts'),
  ]);
  const shell = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const render = (data) => shell.replace('<main id="app" tabindex="-1"></main>', `<main id="app">${[
    hero.heroSection(data), hero.featuredSection(data), hero.marqueeBand(data), about.aboutSection(data),
    works.projectsSection(data), works.skillsSection(data), about.journeySection(data),
    works.certificatesSection(data), about.expertiseSection(data), contact.contactSection(),
  ].join('')}</main>`);
  const checkLinks = (page) => {
    const ids = [...page.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
    assert.equal(new Set(ids).size, ids.length, 'IDs must be unique');
    for (const [, target] of page.matchAll(/href="#([^"]+)"/g)) {
      assert.ok(ids.includes(target), `Missing anchor target: ${target}`);
    }
    assert.equal([...page.matchAll(/<h1\b/g)].length, 1, 'One page heading');
    assert.doesNotMatch(page, /(?:href|src)="(?:javascript|data):/i, 'Unsafe URLs must not reach the page');
  };
  const { thaiContent, thaiLabel } = await server.ssrLoadModule('/src/data/thai.ts');
  const english = structuredClone(defaultData);
  english.about.status = 'Open for Freelance';
  english.about.interests = ['Web Development & Programming', 'Custom interest'];
  english.about.expertise[0].area = 'Frontend Development';
  const snapshot = structuredClone(english);
  const translated = thaiContent(english);
  assert.equal(translated.about.status, 'พร้อมรับงานอิสระ');
  assert.deepEqual(translated.about.interests, ['การพัฒนาเว็บไซต์และการเขียนโปรแกรม', 'Custom interest']);
  assert.equal(translated.about.expertise[0].area, 'การพัฒนาส่วนติดต่อผู้ใช้');
  assert.deepEqual(english, snapshot, 'Display translation must not overwrite saved content');
  assert.equal(thaiLabel('All'), 'ทั้งหมด');
  assert.match(String(works.skillsSection(defaultData)), /data-filter="Frontend">ส่วนติดต่อผู้ใช้/);
  assert.match(String(hero.heroSection(defaultData)), /เรียนรู้จากการลงมือทำ/);
  assert.doesNotMatch(String(contact.contactSection()), /Copy email address|Download CV|Back to top/);
  const currentPage = render(defaultData);
  checkLinks(currentPage);
  assert.match(currentPage, /มหาวิทยาลัยศรีปทุม/, 'Current university must be visible');
  assert.match(currentPage, /ชั้นปีที่ 3/, 'Current year of study must be visible');
  assert.match(currentPage, /คณะเทคโนโลยีสารสนเทศ \(SIT\)/, 'Current faculty must be visible');
  assert.match(currentPage, /สาขาเทคโนโลยีสารสนเทศและการสื่อสาร \(ICT\)/, 'Current major must be visible');
  assert.doesNotMatch(currentPage, /นักศึกษาปวส\.2/, 'The old student biography must not be shown');
  const { refreshLegacyProfile } = await server.ssrLoadModule('/src/data/store.ts');
  const legacyManager = runInNewContext(`${await readFile(new URL('../data-manager.js', import.meta.url), 'utf8')}; DataManager;`);
  assert.deepEqual(JSON.parse(JSON.stringify(legacyManager.getDefaultData())), defaultData, 'Admin and frontend defaults must agree');
  for (const refresh of [refreshLegacyProfile, legacyManager.refreshLegacyProfile.bind(legacyManager)]) {
    const old = structuredClone(defaultData);
    old.about.description = 'สวัสดีครับ นักศึกษาปวส.2 สาขานักพัฒนาซอฟต์แวร์ขั้นสูง';
    old.about.education = old.about.education.slice(1);
    const snapshot = structuredClone(old);
    const updated = refresh(old);
    assert.match(render(updated), /มหาวิทยาลัยศรีปทุม/);
    assert.doesNotMatch(render(updated), /นักศึกษาปวส\.2/);
    assert.equal(updated.about.education.length, snapshot.about.education.length + 1);
    assert.strictEqual(updated.projects, old.projects, 'Saved projects must be preserved');
    assert.strictEqual(updated.certificates, old.certificates, 'Saved certificates must be preserved');
    assert.deepEqual(old, snapshot, 'Reading saved content must not mutate it');
    assert.strictEqual(refresh(updated), updated, 'Profile refresh must be idempotent');
    const edited = structuredClone(defaultData);
    edited.about.description = 'My updated university biography';
    assert.strictEqual(refresh(edited), edited, 'Later admin edits must remain intact');
    const existing = structuredClone(old);
    existing.about.education.unshift({ ...defaultData.about.education[0], degree: 'Custom degree' });
    assert.equal(refresh(existing).about.education[0].degree, 'Custom degree', 'Existing university details must be preserved');
    const provisional = structuredClone(defaultData);
    provisional.about.description = 'สวัสดีครับ ผมกิตติภัทร สุวรรณศรี ปัจจุบันกำลังศึกษาอยู่ชั้นปีที่ 3 มหาวิทยาลัยศรีปทุม ผมสนใจการพัฒนาเว็บไซต์และซอฟต์แวร์';
    provisional.about.education[0].degree = 'ระดับปริญญาตรี · ชั้นปีที่ 3';
    provisional.about.education[0].description = 'ต่อยอดพื้นฐานจากสายอาชีพ';
    const complete = refresh(provisional);
    assert.match(complete.about.description, /คณะเทคโนโลยีสารสนเทศ \(SIT\)/);
    assert.match(complete.about.education[0].degree, /เทคโนโลยีสารสนเทศและการสื่อสาร \(ICT\)/);
    assert.equal(complete.about.education.length, provisional.about.education.length, 'Adding faculty details must not duplicate education');
    assert.strictEqual(refresh(complete), complete, 'Completed faculty details must not be refreshed again');
  }
  const empty = { about: { ...defaultData.about, expertise: [], experience: [], education: [], interests: [] }, skills: [], projects: [] };
  checkLinks(render(empty));
  const hostile = structuredClone(defaultData);
  hostile.projects = Array.from({ length: 7 }, (_, i) => ({ title: `Project ${i} <script>alert(1)</script>`, tech: 'TypeScript', description: 'A "quoted" description', image: 'javascript:alert(1)', demoLink: 'javascript:alert(1)' }));
  hostile.skills[0].name = '<img src=x onerror=alert(1)>';
  hostile.skills[0].level = 999;
  const page = render(hostile);
  checkLinks(page);
  assert.doesNotMatch(page, /<script>alert\(1\)<\/script>|<img src=x/);
  assert.equal([...page.matchAll(/class="project project--/g)].length, 7, 'Every project appears once in the work section');
  assert.equal([...page.matchAll(/class="project project--stack"/g)].length, 3, 'First three projects form the stack');
  assert.equal([...page.matchAll(/class="project project--rail"/g)].length, 4, 'Remaining projects stay accessible in the rail');
  assert.doesNotMatch(String(works.skillsSection(hostile)), /skill__bar|role="meter"|999%/, 'Skill cards must not show proficiency bars or percentages');
  assert.match(page, /aria-pressed="true" data-filter="All"/, 'Active filter is announced');
  assert.match(page, /data-video-toggle aria-pressed="false" hidden/, 'Video controls stay hidden until playback succeeds');
  console.log('UI checks passed: current profile, legacy migration, admin parity, links, escaping and accessibility.');
} finally {
  await server.close();
}

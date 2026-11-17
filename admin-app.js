import { collections, categories, escape as e, imageUrl, items, validData } from './admin-model.js';
const manager = DataManager;
const $ = selector => document.querySelector(selector);
const notice = (text, error = false) => { $('#notice').textContent = text; $('#notice').classList.toggle('error', error); };
const authorized = () => manager.isSessionValid() && sessionStorage.getItem('admin_secret_access');
if (!sessionStorage.getItem('admin_secret_access')) location.replace('index.html');
else if (document.body.dataset.screen === 'login') {
    if (manager.isSessionValid()) location.replace('dashboard.html');
    $('#login-form').addEventListener('submit', event => {
        event.preventDefault();
        try {
            if (!manager.verifyPassword($('#password').value)) { notice('รหัสผ่านไม่ถูกต้อง กรุณาลองอีกครั้ง', true); $('#password').focus(); return; }
            manager.createSession(); location.assign('dashboard.html');
        } catch { notice('ไม่สามารถเข้าสู่ระบบได้ กรุณาตรวจสอบการอนุญาตพื้นที่จัดเก็บของเบราว์เซอร์', true); }
    });
} else if (!authorized()) location.replace('admin.html');
else void init();

async function init() {
    $('.workspace').hidden = false;
    let data = manager.loadData();
    const draftKey = 'pikanomwaan_admin_draft';
    let dirty = false;
    try {
        const stored = localStorage.getItem(draftKey);
        if (stored) { const draft = JSON.parse(stored); if (validData(draft)) { data = draft; dirty = true; } else notice('แบบร่างในเครื่องมีรูปแบบไม่ถูกต้อง จึงเปิดข้อมูลเว็บไซต์แทน', true); }
    } catch { notice('อ่านแบบร่างในเครื่องไม่สำเร็จ', true); }
    let savedData = structuredClone(data);
    let busy = false;
    let route = '';
    let editing = null;
    let analyticsRequest = 0;
    const names = { overview:'ภาพรวม', about:'ตัวตนและเรื่องราว', ...Object.fromEntries(Object.entries(collections).map(([key, value]) => [key, value.title])), analytics:'สถิติการเข้าชม', settings:'ตั้งค่าและข้อมูล' };
    $('#navigation').innerHTML = Object.entries(names).map(([key, title], i) => `<a href="#${key}"><span class="nav-number">${String(i + 1).padStart(2,'0')}</span>${title}</a>`).join('');
    const requireSession = () => { if (authorized()) return true; notice('เซสชันหมดอายุ กรุณาเข้าสู่ระบบอีกครั้ง แบบร่างที่บันทึกในเครื่องยังอยู่', true); return false; };
    const state = text => { $('#save-state').textContent = text; };
    const save = () => {
        if (!requireSession()) throw new Error('กรุณาเข้าสู่ระบบอีกครั้ง');
        try { localStorage.setItem(draftKey, JSON.stringify(data)); }
        catch { data = structuredClone(savedData); throw new Error('บันทึกแบบร่างไม่สำเร็จ พื้นที่จัดเก็บอาจเต็ม กรุณาสำรองข้อมูลและลองอีกครั้ง'); }
        savedData = structuredClone(data);
        dirty = true;
        state('บันทึกแบบร่างในเครื่องแล้ว · รอเผยแพร่');
    };
    const field = (key, label, type = 'text', value = '', required = false) => `<label for="field-${key}">${e(label)}</label>${type === 'textarea' ? `<textarea id="field-${key}" name="${key}" rows="5">${e(value)}</textarea>` : type === 'category' ? `<select id="field-${key}" name="${key}">${Object.entries({...categories, ...(value && !categories[value] ? {[value]:value} : {})}).map(([k,v]) => `<option value="${e(k)}" ${value === k ? 'selected' : ''}>${e(v)}</option>`).join('')}</select>` : `<input id="field-${key}" name="${key}" type="${type}" value="${e(value)}" ${required ? 'required' : ''} ${type === 'url' ? 'placeholder="https://…"' : ''}>`}`;
    const heading = (title, description, action = '') => `<div class="page-head"><div><p class="eyebrow">สตูดิโอ / ${e(names[route])}</p><h1>${title}</h1><p class="muted">${description}</p></div>${action}</div>`;
    function render(focus = false) {
        analyticsRequest++;
        const key = location.hash.slice(1);
        route = Object.hasOwn(names, key) ? key : 'overview';
        $('#navigation').querySelectorAll('a').forEach(link => { if (link.hash === '#'+route) link.setAttribute('aria-current','page'); else link.removeAttribute('aria-current'); });
        document.title = `${names[route]} · สตูดิโอ`;
        let content;
        if (route === 'overview') {
            const total = Object.keys(collections).reduce((sum,k) => sum + items(data,k).length,0);
            content = heading('พื้นที่สำหรับผลงานชิ้นต่อไป<span class="accent">.</span>', 'ภาพรวมเรื่องราวและเนื้อหาทั้งหมดบนเว็บไซต์ของคุณ') + `<section class="overview-banner"><div><span class="eyebrow">เว็บไซต์ของคุณ</span><h2>เรียนรู้ สร้างสรรค์<br>แล้วเล่าเรื่องราวของคุณ</h2><a href="index.html" target="_blank" rel="noopener">เปิดดูเว็บไซต์ ↗</a></div><div class="total-count"><strong>${total}</strong><span>รายการเนื้อหาทั้งหมด</span></div></section><div class="summary-grid">${['projects','skills','certificates'].map(k => `<a class="summary" href="#${k}"><span>${names[k]} ↗</span><strong>${items(data,k).length.toString().padStart(2,'0')}</strong><small>จัดการ${names[k]}</small></a>`).join('')}</div><section class="section-block"><div class="section-line"><h2>ผลงานล่าสุดในรายการ</h2><a href="#projects">ดูทั้งหมด →</a></div><div class="project-grid">${items(data,'projects').slice(0,3).map((item,i) => card('projects',item,i)).join('') || empty('projects')}</div></section><section class="workflow-note"><span>เริ่มต้นอย่างไร?</span><p>เลือกหมวดเนื้อหาเพื่อแก้ไข บันทึกแบบร่าง แล้วกด “เผยแพร่การแก้ไข” เพื่อส่งขึ้นเว็บไซต์</p></section>`;
        } else if (collections[route]) {
            const config = collections[route];
            content = heading(config.title, `${items(data,route).length} รายการ · จัดลำดับ แก้ไข และเพิ่มเนื้อหาที่อยากแบ่งปัน`, `<button class="primary" data-add="${route}">＋ เพิ่ม${config.singular}</button>`) + `<label class="search-label" for="search">ค้นหา${config.title}</label><input id="search" class="search" type="search" placeholder="ค้นหาจากชื่อหรือรายละเอียด…"><div class="${['projects','certificates'].includes(route) ? 'project-grid' : 'entry-list'}" id="item-list">${items(data,route).map((item,i) => card(route,item,i)).join('') || empty(route)}</div><p id="no-results" class="empty" hidden>ไม่พบรายการที่ตรงกับคำค้นหา</p>`;
        } else if (route === 'about') {
            content = heading('ตัวตนและเรื่องราว', 'บอกเล่าตัวตน แนวคิด และเส้นทางการเรียนรู้ผ่านคำพูดของคุณ') + `<form id="about-form" class="panel profile-form"><div class="section-line"><h2>แนะนำตัว</h2><span class="muted">เนื้อหาบนหน้าเว็บไซต์</span></div>${[['description','แนะนำตัวแบบย่อ','textarea'],['detail','เรื่องราวเพิ่มเติม','textarea'],['philosophy','แนวคิดในการทำงาน','textarea'],['years','จำนวนปีที่เรียนรู้และลงมือทำ'],['location','ที่อยู่'],['status','สถานะการรับงาน']].map(([k,l,t]) => field(k,l,t,data.about[k])).join('')}<button class="primary" type="submit">บันทึกแบบร่าง</button></form>`;
        } else if (route === 'analytics') {
            content = heading('ผู้คนที่แวะมาทักทาย', 'ข้อมูลการเข้าชมจริงล่าสุด สูงสุด 100 เซสชัน') + '<section class="panel" id="analytics-results" role="status">กำลังโหลดข้อมูลการเข้าชม…</section>';
        } else {
            content = heading('ดูแลพื้นที่ทำงาน', 'สำรองข้อมูล ย้ายเนื้อหา และจัดการรหัสผ่านสำหรับเบราว์เซอร์นี้') + `<section class="panel"><h2>ข้อมูลของคุณ</h2><p class="muted">ดาวน์โหลดไฟล์สำรองก่อนนำเข้าข้อมูลใหม่ การนำเข้าจะแทนที่แบบร่างในเครื่อง และยังไม่เผยแพร่จนกว่าจะกดเผยแพร่</p><div class="settings-actions"><button class="secondary" data-export>ดาวน์โหลดข้อมูล JSON ↓</button><label class="file-label" for="import-file">นำเข้าข้อมูล JSON ↑</label><input id="import-file" type="file" accept=".json,application/json"></div></section><form class="panel" id="password-form"><h2>เปลี่ยนรหัสผ่าน</h2><p class="muted">รหัสผ่านนี้ใช้กับการเข้าสู่ระบบบนเบราว์เซอร์นี้</p>${field('current','รหัสผ่านปัจจุบัน','password','',true)}${field('next','รหัสผ่านใหม่ อย่างน้อย 6 ตัวอักษร','password','',true)}${field('confirm','ยืนยันรหัสผ่านใหม่','password','',true)}<button type="submit" class="secondary">เปลี่ยนรหัสผ่าน</button></form>`;
        }
        $('#content').innerHTML = content;
        if (focus) { $('#content').focus(); window.scrollTo(0,0); }
        if (route === 'analytics') void analytics(analyticsRequest);
    }
    function empty(key) { return `<div class="empty"><span class="empty-symbol">＋</span><h2>เริ่มเล่าเรื่องราวของคุณ</h2><p>ยังไม่มี${collections[key].singular}ในหมวดนี้</p><button class="secondary" data-add="${key}">เพิ่มรายการแรก</button></div>`; }
    function card(key,item,i) {
        const title = typeof item === 'string' ? item : item.title || item.name || item.degree || item.role || item.area;
        const detail = typeof item === 'string' ? '' : item.description || categories[item.category] || item.category || '';
        const media = imageUrl(item.image);
        return `<article class="entry ${['projects','certificates'].includes(key) ? 'visual-entry' : ''}" data-entry data-search="${e(title+' '+detail).toLowerCase()}">${['projects','certificates'].includes(key) ? `<div class="entry-cover">${media ? `<img src="${e(media)}" alt="" loading="lazy">` : `<span>${String(i+1).padStart(2,'0')}</span>`}</div>` : `<span class="entry-index">${String(i+1).padStart(2,'0')}</span>`}<div class="entry-body"><p class="entry-meta">${e(item.tech || item.issuer || item.institution || item.company || item.year || item.period || collections[key].singular)}</p><h2>${e(title)}</h2><p class="entry-description">${e(detail)}</p><div class="entry-actions"><button class="edit-button" data-edit="${key}" data-index="${i}">แก้ไข ↗</button><div><button class="icon-button" data-move="-1" data-key="${key}" data-index="${i}" aria-label="เลื่อน ${e(title)} ขึ้น" ${i===0?'disabled':''}>↑</button><button class="icon-button" data-move="1" data-key="${key}" data-index="${i}" aria-label="เลื่อน ${e(title)} ลง" ${i===items(data,key).length-1?'disabled':''}>↓</button><button class="icon-button delete-button" data-delete="${key}" data-index="${i}" aria-label="ลบ ${e(title)}">×</button></div></div></div></article>`;
    }
    async function analytics(request) {
        try {
            if (!manager.db) throw new Error();
            const result = await manager.db.collection('analytics_sessions').orderBy('startTime','desc').limit(100).get();
            if (request !== analyticsRequest) return;
            const sessions = result.docs.map(doc => doc.data());
            const duration = sessions.reduce((sum,s) => sum + (Number(s.totalDuration) || 0),0);
            const devices = {};
            sessions.forEach(s => { const name = s.device?.deviceType || 'ไม่ระบุ'; devices[name] = (devices[name] || 0)+1; });
            $('#analytics-results').innerHTML = sessions.length ? `<div class="section-line"><div><p class="muted">จำนวนการเข้าชมในชุดข้อมูลล่าสุด</p><strong class="metric">${sessions.length}</strong></div><div><p class="muted">ระยะเวลาเฉลี่ย</p><strong class="metric">${Math.round(duration/sessions.length)} <small>วินาที</small></strong></div></div><h2>อุปกรณ์ที่ใช้งาน</h2>${Object.entries(devices).map(([name,count]) => `<div class="device-row"><span>${e(({Mobile:'มือถือ',Desktop:'คอมพิวเตอร์',Tablet:'แท็บเล็ต'})[name] || name)}</span><strong>${count} ครั้ง</strong></div>`).join('')}` : '<h2>ยังไม่มีข้อมูลการเข้าชม</h2><p class="muted">เมื่อมีการบันทึกเซสชัน ข้อมูลจะแสดงที่นี่</p>';
        } catch { if (request === analyticsRequest) $('#analytics-results').textContent = 'โหลดสถิติไม่สำเร็จ ตรวจสอบการเชื่อมต่อและสิทธิ์เข้าถึงข้อมูล แล้วเปิดหน้านี้อีกครั้ง'; }
    }
    function openEditor(key,index = null) {
        if (!requireSession()) return;
        const config = collections[key]; const item = index === null ? {} : items(data,key)[index];
        editing = {key,index};
        $('#editor-title').textContent = (index === null ? 'เพิ่ม' : 'แก้ไข')+config.singular;
        $('#editor-fields').innerHTML = config.fields.map(([k,l,t],i) => field(k,l,t,typeof item === 'string' ? item : item[k] || (k==='repoLink' ? item.link : '') || '', i===0)).join('');
        $('#editor-error').textContent = '';
        $('#editor').showModal();
    }
    $('#content').addEventListener('click', event => {
        const button = event.target.closest('button'); if (!button || busy) return;
        const d = button.dataset;
        try {
            if (d.add) openEditor(d.add);
            if (d.edit) openEditor(d.edit,Number(d.index));
            if (d.delete && requireSession() && confirm('ลบรายการนี้จากแบบร่างหรือไม่? กรุณาสำรองข้อมูลหากต้องการเก็บไว้')) { items(data,d.delete).splice(Number(d.index),1); save(); render(); }
            if (d.move && requireSession()) { const list = items(data,d.key), from = Number(d.index), to = from+Number(d.move); if (to>=0 && to<list.length) { [list[from],list[to]]=[list[to],list[from]]; save(); render(); } }
            if (button.hasAttribute('data-export')) exportDraft();
        } catch (error) { notice(error.message,true); }
    });
    $('#content').addEventListener('input', event => {
        if (event.target.id !== 'search') return;
        const query = event.target.value.trim().toLowerCase(); let visible=0;
        document.querySelectorAll('[data-entry]').forEach(card => { card.hidden = !card.dataset.search.includes(query); if (!card.hidden) visible++; });
        $('#no-results').hidden = visible>0 || items(data,route).length===0;
    });
    $('#edit-form').addEventListener('submit', event => {
        event.preventDefault(); if (!editing || !requireSession()) return;
        try {
            const {key,index}=editing; const list=items(data,key); const values=Object.fromEntries(new FormData(event.target));
            if (!String(values[collections[key].fields[0][0]]).trim()) throw new Error('กรุณากรอกชื่อรายการ');
            const item = key==='interests' ? values.name.trim() : {...(index===null ? (key==='skills' ? {level:0} : {}) : list[index]),...values};
            if (index===null) list.push(item); else list[index]=item;
            save(); $('#editor').close(); render(); notice('บันทึกแบบร่างแล้ว กดเผยแพร่เมื่อพร้อม');
        } catch(error) { $('#editor-error').textContent=error.message; }
    });
    $('#close-editor').onclick = $('#cancel-editor').onclick = () => $('#editor').close();
    $('#content').addEventListener('submit', event => {
        event.preventDefault(); if (!requireSession() || busy) return;
        const values=Object.fromEntries(new FormData(event.target));
        try {
            if (event.target.id==='about-form') { Object.assign(data.about,values); save(); event.target.removeAttribute('data-edited'); notice('บันทึกเรื่องราวเป็นแบบร่างแล้ว'); }
            if (event.target.id==='password-form') {
                if (!manager.verifyPassword(values.current)) throw new Error('รหัสผ่านปัจจุบันไม่ถูกต้อง');
                if (values.next.length<6) throw new Error('รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร');
                if (values.next!==values.confirm) throw new Error('รหัสผ่านใหม่ไม่ตรงกัน');
                manager.setPassword(values.next); event.target.reset(); event.target.removeAttribute('data-edited'); notice('เปลี่ยนรหัสผ่านแล้ว');
            }
        } catch(error) { notice(error.message,true); }
    });
    $('#content').addEventListener('change', async event => {
        if (event.target.id!=='import-file' || busy || !requireSession()) return;
        try {
            const file=event.target.files[0]; if (!file) return;
            if (file.size>10*1024*1024) throw new Error('ไฟล์ต้องมีขนาดไม่เกิน 10 เมกะไบต์');
            const imported=JSON.parse(await file.text());
            if (!validData(imported)) throw new Error('โครงสร้างไฟล์ไม่ถูกต้อง กรุณาใช้ไฟล์สำรองข้อมูลเว็บไซต์');
            if (!requireSession() || !confirm('แทนที่แบบร่างทั้งหมดด้วยข้อมูลในไฟล์นี้หรือไม่?')) return;
            data=imported; save(); render(); notice('นำเข้าแบบร่างแล้ว ยังไม่ได้เผยแพร่ขึ้นคลาวด์');
        } catch(error) { notice(error.message,true); }
    });
    function exportDraft() {
        const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));
        const link=document.createElement('a'); link.href=url; link.download=`portfolio-backup-${Date.now()}.json`; link.click(); setTimeout(()=>URL.revokeObjectURL(url),1000);
    }
    $('#export').onclick=exportDraft;
    $('#publish').onclick=async () => {
        if (busy || !requireSession()) return;
        if ($('#content').querySelector('[data-edited]') || $('#editor').open) { notice('กรุณาบันทึกหรือปิดแบบฟอร์มที่กำลังแก้ไขก่อนเผยแพร่', true); return; }
        busy=true; $('#publish').disabled=true; $('#content').inert=true; $('#editor').inert=true; state('กำลังเผยแพร่…');
        try {
            localStorage.setItem(draftKey, JSON.stringify(data));
            const result=await manager.pushData(data);
            if (!result.success) throw new Error(result.message);
            localStorage.removeItem(draftKey);
            dirty=false; state('เผยแพร่แล้ว · '+new Intl.DateTimeFormat('th-TH',{hour:'2-digit',minute:'2-digit',timeZone:'Asia/Bangkok'}).format(new Date())); notice('เผยแพร่เนื้อหาขึ้นคลาวด์แล้ว');
        } catch(error) { state('ยังไม่ได้เผยแพร่ · แบบร่างอยู่ในเครื่อง'); notice(error.message,true); }
        finally { busy=false; $('#publish').disabled=false; $('#content').inert=false; $('#editor').inert=false; }
    };
    $('#logout').onclick=() => { if (!busy && confirm('ออกจากระบบหรือไม่? แบบร่างที่บันทึกไว้จะยังอยู่ในเครื่อง')) { manager.logout(); location.assign('admin.html'); } };
    window.addEventListener('hashchange',() => {
        if (busy || (($('#editor').open || $('#content').querySelector('[data-edited]')) && !confirm('ออกจากหน้านี้และทิ้งข้อความที่ยังไม่ได้บันทึกหรือไม่?'))) {
            history.replaceState(null, '', '#'+route); return;
        }
        if ($('#editor').open) $('#editor').close(); render(true);
    });
    window.addEventListener('beforeunload',event => { if ($('#content').querySelector('form')?.matches('[data-edited]') || $('#editor').open) { event.preventDefault(); event.returnValue=''; } });
    $('#content').addEventListener('input',event => { event.target.closest('form')?.setAttribute('data-edited',''); });
    render();
    if (dirty) { state('เปิดแบบร่างในเครื่อง · รอเผยแพร่'); return; }
    $('#content').inert=true; $('#publish').disabled=true; busy=true;
    try {
        const fresh=await manager.fetchData();
        if (!validData(fresh)) throw new Error('ข้อมูลเว็บไซต์มีรูปแบบไม่ถูกต้อง กรุณาตรวจสอบไฟล์สำรอง');
        data=fresh; savedData=structuredClone(data); render(); state('พร้อมจัดการ · แบบร่างยังไม่มีการแก้ไข');
    } catch(error) { state('ใช้ข้อมูลในเครื่อง'); notice(error.message,true); }
    finally { $('#content').inert=false; $('#publish').disabled=false; busy=false; }
}

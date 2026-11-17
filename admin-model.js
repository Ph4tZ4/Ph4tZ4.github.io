export const collections = {
    projects: { title: 'ผลงาน', singular: 'โปรเจกต์', path: 'projects', fields: [['title','ชื่อโปรเจกต์'],['tech','เทคโนโลยี'],['description','รายละเอียด','textarea'],['image','ลิงก์รูปภาพ','url'],['repoLink','ลิงก์ซอร์สโค้ด','url'],['demoLink','ลิงก์เว็บไซต์','url']] },
    skills: { title: 'ทักษะ', singular: 'ทักษะ', path: 'skills', fields: [['name','ชื่อทักษะ'],['category','หมวดหมู่','category']] },
    certificates: { title: 'เกียรติบัตร', singular: 'เกียรติบัตร', path: 'certificates', fields: [['title','ชื่อเกียรติบัตร'],['issuer','ผู้ออกเกียรติบัตร'],['date','ปี / วันที่'],['description','รายละเอียด','textarea'],['image','ลิงก์รูปภาพ','url']] },
    education: { title: 'การศึกษา', singular: 'ประวัติการศึกษา', path: 'about.education', fields: [['degree','วุฒิ / หลักสูตร'],['institution','สถาบัน'],['year','ปี / ช่วงเวลา'],['description','รายละเอียด','textarea']] },
    experience: { title: 'ประสบการณ์', singular: 'ประสบการณ์', path: 'about.experience', fields: [['role','ตำแหน่ง'],['company','องค์กร'],['period','ช่วงเวลา'],['description','รายละเอียด','textarea']] },
    expertise: { title: 'ความถนัด', singular: 'ความถนัด', path: 'about.expertise', fields: [['area','ด้านความถนัด'],['description','รายละเอียด','textarea']] },
    interests: { title: 'ความสนใจ', singular: 'ความสนใจ', path: 'about.interests', fields: [['name','ความสนใจ']] },
};
export const categories = { Frontend:'ส่วนติดต่อผู้ใช้', Backend:'ระบบเบื้องหลัง', Creative:'งานสร้างสรรค์', Database:'ฐานข้อมูล', DevOps:'ดูแลระบบ', Other:'อื่น ๆ' };
export const escape = (value) => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function imageUrl(value) {
    if (typeof value !== 'string') return '';
    return /^(https?:\/\/|images\/|\.\/images\/|\/images\/)/i.test(value) ? value : '';
}
export function items(data, key) {
    const config = collections[key];
    return config.path.startsWith('about.') ? (data.about[config.path.split('.')[1]] ??= []) : (data[config.path] ??= []);
}
export function validData(data) {
    if (!data || typeof data !== 'object' || !data.about || typeof data.about !== 'object' || Array.isArray(data.about)) return false;
    if (!['years','location','status','description','detail'].every(k => typeof data.about[k] === 'string')) return false;
    if (data.about.philosophy !== undefined && typeof data.about.philosophy !== 'string') return false;
    return Object.entries(collections).every(([key, config]) => {
        const list = config.path.startsWith('about.') ? data.about[config.path.split('.')[1]] : data[config.path];
        if (list === undefined) return !['skills','projects'].includes(key);
        return Array.isArray(list) && list.every(item => key === 'interests' ? typeof item === 'string' : item && typeof item === 'object' && !Array.isArray(item) && config.fields.every(([field, , type]) => (type === 'url' && item[field] === undefined) || typeof item[field] === 'string'));
    });
}

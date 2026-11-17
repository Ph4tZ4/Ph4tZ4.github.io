/**
 * PIKANOMWAAN Portfolio - Data Manager
 * Centralized data management for portfolio content
 */

const DataManager = {
    // Firebase Configuration
    firebaseConfig: {
        apiKey: "AIzaSyBBbmATSJ6cWQrauTycpFVbVXOW_ZJiNbY",
        authDomain: "kittiphat-protfolio-3882c.firebaseapp.com",
        projectId: "kittiphat-protfolio-3882c",
        storageBucket: "kittiphat-protfolio-3882c.firebasestorage.app",
        messagingSenderId: "295019642338",
        appId: "1:295019642338:web:3a2ade99f7ba649d150dbb",
        measurementId: "G-SYHRGCKB0F"
    },

    // Firebase Instances
    app: null,
    db: null,
    storage: null,

    // Storage Keys (Legacy / Session)
    KEYS: {
        PASSWORD: 'vantage_admin_password',
        SESSION: 'vantage_admin_session',
        DATA: 'vantage_portfolio_data', // Keep for backup/offline
        VERSION: 'vantage_portfolio_version'
    },

    // App Version - Change this to force local storage clear on client browsers
    VERSION: '2.0',

    // Default Data Structure
    getDefaultData() {
        return {
            about: {
                years: "5+",
                location: "กรุงเทพมหานคร ประเทศไทย",
                status: "พร้อมรับงานอิสระ",
                description: "สวัสดีครับ ผมกิตติภัทร สุวรรณศรี ปัจจุบันกำลังศึกษาอยู่ชั้นปีที่ 3 คณะเทคโนโลยีสารสนเทศ (SIT) สาขาเทคโนโลยีสารสนเทศและการสื่อสาร (ICT) มหาวิทยาลัยศรีปทุม ผมสนใจการพัฒนาเว็บไซต์และซอฟต์แวร์ ตั้งแต่การออกแบบหน้าจอไปจนถึงระบบเบื้องหลัง และชอบนำสิ่งที่เรียนมาทดลองสร้างเป็นโปรเจกต์ที่ใช้งานได้จริง",
                detail: "ผมเติบโตจากการเรียนสายอาชีพและประสบการณ์ฝึกงาน สู่การเรียนในระดับมหาวิทยาลัย ทุกโปรเจกต์เป็นโอกาสให้ผมฝึกคิดอย่างเป็นระบบ รับฟังความคิดเห็น และปรับงานให้ดีขึ้น ผมให้ความสำคัญกับโค้ดที่อ่านเข้าใจง่าย การทำงานร่วมกับผู้อื่น และประสบการณ์ของคนที่ใช้งาน",
                education: [
                    {
                        degree: "เทคโนโลยีสารสนเทศและการสื่อสาร (ICT) · ชั้นปีที่ 3",
                        institution: "มหาวิทยาลัยศรีปทุม",
                        year: "กำลังศึกษา",
                        description: "กำลังศึกษาระดับปริญญาตรี คณะเทคโนโลยีสารสนเทศ (SIT) สาขาเทคโนโลยีสารสนเทศและการสื่อสาร (ICT) ต่อยอดพื้นฐานจากสายอาชีพสู่การเรียนในระดับมหาวิทยาลัย พร้อมฝึกพัฒนาซอฟต์แวร์ผ่านการลงมือทำโปรเจกต์และการเรียนรู้ร่วมกับผู้อื่น"
                    },
                    {
                        degree: "การพัฒนาเว็บ แอปพลิเคชัน และระบบ IoT",
                        institution: "วิทยาลัยเทคนิคชัยภูมิ / วิทยาลัยเทคนิคเลย",
                        year: "2021 - 2023",
                        description: "เริ่มต้นเรียนด้าน IT ผ่านหลักสูตรของสองสถาบัน ได้ฝึกทั้งการพัฒนาเว็บและระบบ IoT เข้าร่วมการแข่งขันทักษะวิชาชีพ และฝึกงานที่บริษัท น้ำตาลมิตรผล จำกัด"
                    },
                    {
                        degree: "นักพัฒนาซอฟต์แวร์ขั้นสูง",
                        institution: "วิทยาลัยเทคนิคเลย",
                        year: "2024 - 2025",
                        description: "ศึกษาการพัฒนาซอฟต์แวร์ขั้นสูง พร้อมเรียนรู้ด้านเครือข่าย AI และการพัฒนาแอปทั้ง Hybrid และ Native เพื่อเข้าใจการเลือกใช้เทคโนโลยีให้เหมาะกับงาน"
                    }
                ],
                experience: [
                    {
                        role: "หัวหน้าทีมนักศึกษาฝึกงานด้านไอที",
                        company: "ICONNEX THAILAND (ปัจจุบันคือ ICONNEX WORLD) ",
                        period: "มีนาคม - มิถุนายน 2568",
                        description: "รับผิดชอบการบริหารจัดการนักศึกษาฝึกงาน IT ภายในทีมและมอบหมายงานตามความถนัด พัฒนาเว็บไซต์และระบบภายในสำหรับใช้งานในองค์กร ห้างสรรพสินค้า และงาน Event ต่างๆ โดยใช้เทคโนโลยี HTML, CSS, JavaScript (และ Frameworks), PHP, SQL, Python และเครื่องมืออย่าง Docker, GitHub, MongoDB เพื่อปรับปรุงคุณภาพงาน พร้อมทั้งตรวจสอบคุณภาพและความถูกต้องของโค้ด (Code Review) ก่อนนำขึ้น Production เพื่อให้ระบบมีความเสถียรและปลอดภัย รวมถึงเพิ่มประสิทธิภาพระบบ ลดข้อผิดพลาด และทำให้การใช้งานง่ายขึ้นสำหรับผู้ใช้จริง"
                    },
                    {
                        role: "นักศึกษาฝึกงานด้านไอที",
                        company: "บริษัท น้ำตาลมิตรผล จำกัด",
                        period: "มีนาคม - เมษายน 2566",
                        description: "ดูแลและสนับสนุนระบบเครือข่ายและอุปกรณ์คอมพิวเตอร์ในองค์กร พัฒนาและแก้ไขระบบงานพื้นฐานเพื่อเพิ่มประสิทธิภาพการทำงาน พัฒนาเว็บไซต์หลักของบริษัทและเว็บไซต์ที่ใช้ในการสัมมนาในงานต่างๆ พร้อมทั้งเรียนรู้การทำงานแบบมืออาชีพและการทำงานร่วมกับทีม IT ในองค์กรขนาดใหญ่"
                    },
                    {
                        role: "นักพัฒนาซอฟต์แวร์ส่วนติดต่อผู้ใช้",
                        company: "วิทยาลัยเทคนิคเลย",
                        period: "2024 - ปัจจุบัน",
                        description: "รับผิดชอบการดูแล ออกแบบ และพัฒนาส่วนหน้าบ้าน (Frontend) ของเว็บไซต์ทั้งหมดที่เกี่ยวข้องกับวิทยาลัยตามที่ได้รับมอบหมาย โดยเน้นการสร้างประสบการณ์ผู้ใช้งานที่ดี (User Experience) และออกแบบส่วนติดต่อผู้ใช้ (User Interface) ให้มีความสวยงาม ใช้งานง่าย และตอบสนองได้ดีบนทุกอุปกรณ์ (Responsive Design) พร้อมทั้งทำงานร่วมกับทีมพัฒนาเพื่อให้มั่นใจว่าเว็บไซต์มีประสิทธิภาพและตรงตามความต้องการของวิทยาลัยและผู้ใช้งาน"
                    }
                ],
                philosophy: "เริ่มจากเข้าใจปัญหา ลงมือทำให้ชัดเจน แล้วค่อย ๆ ปรับให้ดีขึ้น ผมอยากให้ทุกโปรเจกต์เป็นทั้งงานที่มีประโยชน์กับคนใช้ และบทเรียนที่ทำให้ผมเป็นนักพัฒนาที่ดีขึ้น",
                interests: [
                    "การพัฒนาเว็บไซต์และการเขียนโปรแกรม",
                    "การเรียนรู้เทคโนโลยีและเฟรมเวิร์กใหม่",
                    "ปัญญาประดิษฐ์และการเรียนรู้ของเครื่อง",
                    "การสอนและให้คำแนะนำด้านไอที",
                    "การทำพอดแคสต์และสร้างเนื้อหา",
                    "การมีส่วนร่วมในชุมชนเทคโนโลยี",
                    "การพูดในที่สาธารณะและการนำเสนอ",
                    "การแก้ปัญหาและสร้างนวัตกรรม",
                    "สถาปัตยกรรมระบบและรูปแบบการออกแบบ",
                    "การอ่านบทความด้านเทคโนโลยี",
                    "การร่วมพัฒนาซอฟต์แวร์โอเพนซอร์ส",
                    "การออกแบบประสบการณ์และส่วนติดต่อผู้ใช้",
                    "เกมและการพัฒนาเกม",
                    "ดนตรีและความบันเทิง",
                    "การถ่ายภาพและวิดีโอ",
                    "การสร้างเครือข่ายและพัฒนาวิชาชีพ",
                    "การเข้าร่วมงานประชุมและเวิร์กช็อปเทคโนโลยี",
                    "การเขียนเอกสารทางเทคนิค",
                    "การปรับปรุงโค้ดและประสิทธิภาพ",
                    "การสำรวจเทคโนโลยีคลาวด์",
                    "ความปลอดภัยไซเบอร์และแนวปฏิบัติที่ดี",
                    "การพัฒนาแอปพลิเคชันมือถือ",
                    "การดูแลระบบและงานอัตโนมัติ",
                    "การสร้างโปรเจกต์ส่วนตัว",
                    "การท่องเที่ยวและแลกเปลี่ยนวัฒนธรรม"
                ],
                expertise: [
                    {
                        area: "การพัฒนาส่วนติดต่อผู้ใช้",
                        description: "พัฒนาเว็บด้วย HTML, CSS, JavaScript และเฟรมเวิร์กที่เหมาะกับงาน โดยฝึกออกแบบหน้าจอที่ใช้งานง่าย รองรับหลายขนาดจอ และใส่ใจประสิทธิภาพ"
                    },
                    {
                        area: "การพัฒนาระบบเบื้องหลัง",
                        description: "มีประสบการณ์ใช้ PHP, Python และ SQL พัฒนา API และระบบภายในองค์กร สนใจการเชื่อมต่อข้อมูลและออกแบบการทำงานเบื้องหลังให้เข้าใจง่าย"
                    },
                    {
                        area: "การจัดการฐานข้อมูล",
                        description: "ทำงานกับฐานข้อมูล SQL และ MongoDB ตั้งแต่จัดโครงสร้างข้อมูล เขียน Query ไปจนถึงเชื่อมต่อกับแอปพลิเคชัน พร้อมฝึกออกแบบข้อมูลให้เหมาะกับการใช้งาน"
                    },
                    {
                        area: "การดูแลระบบและควบคุมเวอร์ชัน",
                        description: "ใช้ GitHub จัดการเวอร์ชันโค้ดและทำงานร่วมกับทีม รวมถึงใช้ Docker เตรียมสภาพแวดล้อมสำหรับพัฒนาและทดลองระบบ"
                    },
                    {
                        area: "คุณภาพและการตรวจทานโค้ด",
                        description: "เรียนรู้การตรวจทานโค้ดจากประสบการณ์ฝึกงาน ให้ความสำคัญกับความถูกต้อง โค้ดที่อ่านรู้เรื่อง และการตรวจสอบก่อนนำระบบไปใช้งาน"
                    },
                    {
                        area: "การดูแลทีมและบริหารโปรเจกต์",
                        description: "เคยดูแลและมอบหมายงานให้ทีมนักศึกษาฝึกงาน IT ประสบการณ์นี้ช่วยให้ผมเห็นความสำคัญของการสื่อสาร การรับฟัง และการวางแผนร่วมกัน"
                    },
                    {
                        area: "การแก้ปัญหาและปรับปรุงระบบ",
                        description: "ฝึกแยกปัญหาเป็นส่วนเล็ก ๆ หาสาเหตุ และตรวจสอบผลหลังแก้ไข โดยใช้ทั้งข้อเสนอแนะจากผู้ใช้และสิ่งที่พบระหว่างพัฒนา"
                    },
                    {
                        area: "การพัฒนาฮาร์ดแวร์และอุปกรณ์เชื่อมต่ออินเทอร์เน็ต",
                        description: "มีพื้นฐาน Arduino และภาษา C/C++ จากการเรียนสายอาชีพ เคยฝึกเขียนโปรแกรมควบคุมอุปกรณ์และพัฒนาโปรเจกต์ IoT เบื้องต้น"
                    }
                ]
            },
            skills: [
                { name: "HTML/CSS", level: 95, category: "Frontend" },
                { name: "JavaScript (ES6+)", level: 90, category: "Frontend" },
                { name: "React.js", level: 85, category: "Frontend" },
                { name: "TailwindCSS", level: 95, category: "Frontend" },
                { name: "Node.js", level: 80, category: "Backend" },
                { name: "GSAP Animation", level: 85, category: "Creative" },
                { name: "Three.js", level: 70, category: "Creative" },
                { name: "MongoDB", level: 75, category: "Database" }
            ],
            projects: [
                {
                    title: "Neon Verse",
                    tech: "Three.js / WebGL",
                    description: "เว็บไซต์สามมิติที่เปิดให้สำรวจเมืองแนวไซเบอร์พังก์ผ่านเบราว์เซอร์ พร้อมเอฟเฟกต์ภาพประสิทธิภาพสูงและการตอบสนองต่อเสียง",
                    image: "https://images.unsplash.com/photo-1618172193622-ae2d025f4032?w=800&h=600&fit=crop"
                },
                {
                    title: "Flux Finance",
                    tech: "React / Node.js",
                    description: "หน้ารวมข้อมูลคริปโทเคอร์เรนซีแบบเรียลไทม์ พร้อมการวิเคราะห์คาดการณ์ด้วยปัญญาประดิษฐ์ รองรับการเชื่อมต่อพร้อมกันกว่า 50,000 รายการ",
                    image: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&h=600&fit=crop"
                },
                {
                    title: "Aero System",
                    tech: "Vue / Firebase",
                    description: "ระบบจัดการสินค้าคงคลังสำหรับองค์กรด้านโลจิสติกส์การบิน ช่วยลดข้อผิดพลาดในการติดตามลง 40%",
                    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop"
                },
                {
                    title: "Vantage UI",
                    tech: "Vanilla JS / CSS",
                    description: "ชุดส่วนติดต่อผู้ใช้ขนาดเล็กที่ไม่พึ่งไลบรารีอื่น เน้นรูปแบบล้ำสมัยและการตอบสนองต่อการใช้งาน",
                    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop"
                }
            ],
            certificates: [
                {
                    title: "AWS Certified Solutions Architect",
                    issuer: "Amazon Web Services",
                    date: "2024",
                    description: "ประกาศนียบัตรวิชาชีพด้านการออกแบบระบบแบบกระจายบน AWS",
                    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop"
                },
                {
                    title: "Google Cloud Professional Developer",
                    issuer: "Google Cloud",
                    date: "2023",
                    description: "ความเชี่ยวชาญในการพัฒนาแอปพลิเคชันที่รองรับการขยายตัวบน Google Cloud Platform",
                    image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=600&h=400&fit=crop"
                },
                {
                    title: "Meta Front-End Developer",
                    issuer: "Meta (Facebook)",
                    date: "2023",
                    description: "ประกาศนียบัตรวิชาชีพด้านการพัฒนาส่วนติดต่อผู้ใช้สมัยใหม่ด้วย React",
                    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop"
                }
            ]
        };
    },

    // Initialize Data Manager
    initialize() {
        // Version Check & Cache Clearing
        const currentVersion = localStorage.getItem(this.KEYS.VERSION);
        if (currentVersion !== this.VERSION) {
            console.log(`New version detected (${this.VERSION}). Clearing legacy data...`);
            localStorage.removeItem(this.KEYS.DATA);
            localStorage.setItem(this.KEYS.VERSION, this.VERSION);
        }

        // Initialize Firebase
        if (typeof firebase !== 'undefined' && !this.app) {
            this.app = firebase.initializeApp(this.firebaseConfig);
            this.db = firebase.firestore();
            // Note: Storage removed - using GitHub for images
            console.log('✓ Firebase initialized (Firestore only)');
        }

        // Set default password if not exists (password: "admin123")
        const existingPassword = localStorage.getItem(this.KEYS.PASSWORD);
        if (!existingPassword) {
            this.setPassword('P@ssw0rd');
            console.log('✓ Default password set: P@ssw0rd');
        }
    },

    // --- FIREBASE OPERATIONS ---

    // Helper: Timeout Promise
    timeout(ms) {
        return new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out')), ms));
    },

    // Fetch Data from Firestore
    async fetchData() {
        if (!this.db) return this.loadData(); // Fallback to LocalStorage

        try {
            // Race between Firestore get() and 5s timeout
            const docRef = this.db.collection('portfolio').doc('main');
            const doc = await Promise.race([
                docRef.get(),
                this.timeout(5000)
            ]);

            if (doc.exists) {
                const data = this.refreshLegacyProfile(doc.data());
                // Update LocalStorage as cache
                this.saveDataLocally(data);
                return data;
            } else {
                console.log('No cloud data found. Using default/local.');
                return this.loadData();
            }
        } catch (error) {
            console.error('Error fetching cloud data:', error);
            // Fallback to local data on error/timeout
            return this.loadData();
        }
    },

    // Push Data to Firestore
    async pushData(data) {
        if (!this.db) return { success: false, message: 'ระบบฐานข้อมูลยังไม่พร้อมใช้งาน' };

        try {
            // Save to Cloud with timeout
            await Promise.race([
                this.db.collection('portfolio').doc('main').set(data),
                this.timeout(5000)
            ]);

            // Save to Local Cache
            this.saveDataLocally(data);

            return { success: true, message: 'บันทึกข้อมูลขึ้นคลาวด์แล้ว' };
        } catch (error) {
            console.error('Error pushing data to cloud:', error);

            // Even if cloud fails, save locally so user doesn't lose work
            this.saveDataLocally(data);
            return { success: false, message: 'บันทึกในเครื่องแล้ว แต่ซิงค์ขึ้นคลาวด์ไม่สำเร็จ: ' + error.message };
        }
    },

    // Keep saved portfolios current without clearing projects or certificates.
    refreshLegacyProfile(data) {
        if (typeof data.about?.description !== 'string' || (!data.about.description.includes('นักศึกษาปวส.2') && !data.about.description.includes('ชั้นปีที่ 3 มหาวิทยาลัยศรีปทุม ผมสนใจการพัฒนาเว็บไซต์'))) return data;
        const current = this.getDefaultData().about;
        const education = (data.about.education ?? []).map((e) => e.institution.includes('ศรีปทุม') && e.degree === 'ระดับปริญญาตรี · ชั้นปีที่ 3' ? current.education[0] : e);
        return { ...data, about: { ...data.about,
            description: current.description,
            detail: current.detail,
            philosophy: current.philosophy,
            education: education.some((e) => e.institution.includes('ศรีปทุม')) ? education : [current.education[0], ...education],
        } };
    },

    // Load Data from LocalStorage (Legacy/Fallback)
    loadData() {
        try {
            const data = localStorage.getItem(this.KEYS.DATA);
            return data ? this.refreshLegacyProfile(JSON.parse(data)) : this.getDefaultData();
        } catch (error) {
            console.error('Error loading local data:', error);
            return this.getDefaultData();
        }
    },

    // Save Data to LocalStorage (Cache)
    saveDataLocally(data) {
        try {
            localStorage.setItem(this.KEYS.DATA, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving local data:', error);
        }
    },

    // Load Data from localStorage
    loadData() {
        try {
            const data = localStorage.getItem(this.KEYS.DATA);
            return data ? JSON.parse(data) : this.getDefaultData();
        } catch (error) {
            console.error('Error loading data:', error);
            return this.getDefaultData();
        }
    },

    // Save Data to localStorage
    saveData(data) {
        try {
            localStorage.setItem(this.KEYS.DATA, JSON.stringify(data));
            return { success: true, message: 'บันทึกข้อมูลแล้ว' };
        } catch (error) {
            console.error('Error saving data:', error);
            return { success: false, message: 'บันทึกข้อมูลไม่สำเร็จ' };
        }
    },

    // Validate Data Structure
    validateData(data) {
        if (!data || typeof data !== 'object') return false;
        if (!data.about || !data.skills || !data.projects) return false;
        if (!Array.isArray(data.skills) || !Array.isArray(data.projects)) return false;
        // Certificates is optional for backward compatibility
        if (data.certificates && !Array.isArray(data.certificates)) return false;
        return true;
    },

    // Export Data as JSON
    exportData() {
        const data = this.loadData();
        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `pikanomwaan-portfolio-backup-${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },

    // Import Data from JSON File
    importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    if (this.validateData(data)) {
                        this.saveData(data);
                        resolve({ success: true, message: 'นำเข้าข้อมูลแล้ว' });
                    } else {
                        reject({ success: false, message: 'โครงสร้างข้อมูลไม่ถูกต้อง' });
                    }
                } catch (error) {
                    reject({ success: false, message: 'อ่านข้อมูลในไฟล์ JSON ไม่สำเร็จ' });
                }
            };
            reader.onerror = () => reject({ success: false, message: 'อ่านไฟล์ไม่สำเร็จ' });
            reader.readAsText(file);
        });
    },

    // Authentication Methods
    hashPassword(password) {
        // Simple hash for demo purposes (use bcrypt or similar in production)
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(36);
    },

    setPassword(password) {
        const hashed = this.hashPassword(password);
        localStorage.setItem(this.KEYS.PASSWORD, hashed);
    },

    verifyPassword(password) {
        const stored = localStorage.getItem(this.KEYS.PASSWORD);
        const hashed = this.hashPassword(password);
        return stored === hashed;
    },

    createSession() {
        const sessionToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
        const sessionData = {
            token: sessionToken,
            timestamp: Date.now()
        };
        localStorage.setItem(this.KEYS.SESSION, JSON.stringify(sessionData));
        return sessionToken;
    },

    isSessionValid() {
        try {
            const sessionData = localStorage.getItem(this.KEYS.SESSION);
            if (!sessionData) return false;

            const session = JSON.parse(sessionData);
            const now = Date.now();
            const sessionAge = now - session.timestamp;

            // Session expires after 24 hours
            const MAX_AGE = 24 * 60 * 60 * 1000;
            return sessionAge < MAX_AGE;
        } catch (error) {
            return false;
        }
    },

    logout() {
        localStorage.removeItem(this.KEYS.SESSION);
    },

    // CRUD Operations for Skills
    addSkill(skill) {
        const data = this.loadData();
        data.skills.push(skill);
        return this.saveData(data);
    },

    updateSkill(index, skill) {
        const data = this.loadData();
        if (index >= 0 && index < data.skills.length) {
            data.skills[index] = skill;
            return this.saveData(data);
        }
        return { success: false, message: 'ไม่พบรายการทักษะที่ระบุ' };
    },

    deleteSkill(index) {
        const data = this.loadData();
        if (index >= 0 && index < data.skills.length) {
            data.skills.splice(index, 1);
            return this.saveData(data);
        }
        return { success: false, message: 'ไม่พบรายการทักษะที่ระบุ' };
    },

    // CRUD Operations for Projects
    addProject(project) {
        const data = this.loadData();
        data.projects.push(project);
        return this.saveData(data);
    },

    updateProject(index, project) {
        const data = this.loadData();
        if (index >= 0 && index < data.projects.length) {
            data.projects[index] = project;
            return this.saveData(data);
        }
        return { success: false, message: 'ไม่พบรายการโปรเจกต์ที่ระบุ' };
    },

    deleteProject(index) {
        const data = this.loadData();
        if (index >= 0 && index < data.projects.length) {
            data.projects.splice(index, 1);
            return this.saveData(data);
        }
        return { success: false, message: 'ไม่พบรายการโปรเจกต์ที่ระบุ' };
    },

    // CRUD Operations for Certificates
    addCertificate(certificate) {
        const data = this.loadData();
        if (!data.certificates) data.certificates = [];
        data.certificates.push(certificate);
        return this.saveData(data);
    },

    updateCertificate(index, certificate) {
        const data = this.loadData();
        if (!data.certificates) data.certificates = [];
        if (index >= 0 && index < data.certificates.length) {
            data.certificates[index] = certificate;
            return this.saveData(data);
        }
        return { success: false, message: 'ไม่พบรายการเกียรติบัตรที่ระบุ' };
    },

    deleteCertificate(index) {
        const data = this.loadData();
        if (!data.certificates) data.certificates = [];
        if (index >= 0 && index < data.certificates.length) {
            data.certificates.splice(index, 1);
            return this.saveData(data);
        }
        return { success: false, message: 'ไม่พบรายการเกียรติบัตรที่ระบุ' };
    },

    // Update About Section
    updateAbout(aboutData) {
        const data = this.loadData();
        data.about = { ...data.about, ...aboutData };
        return this.saveData(data);
    }
};

// Auto-initialize on load
if (typeof window !== 'undefined') {
    DataManager.initialize();
}

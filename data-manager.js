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
                location: "Loei, Thailand",
                status: "Open for Freelance",
                description: "สวัสดีครับ ผมนายกิตติภัทร สุวรรณศรี นักศึกษาปวส.2 สาขานักพัฒนาซอฟต์แวร์ขั้นสูง แผนกเทคโนโลยีสารสนเทศ ผมเชื่อว่าเทคโนโลยีที่ดี ควรช่วยให้ชีวิตผู้คนดีขึ้นได้จริง งานของผมจึงไม่ได้เน้นแค่ “ทำงานได้” แต่ต้อง “สร้างประสบการณ์ที่ดีให้ผู้ใช้” ไปพร้อมกัน",
                detail: "ผมหลงใหลการสร้างสรรค์แอปและซอฟต์แวร์ใหม่ ๆ ที่ตอบโจทย์การใช้งาน และมีลูกเล่นที่สะท้อนความเป็นตัวเอง และยังมีอีกหลายโปรเจกต์ที่กำลังพัฒนาอยู่บน GitHub ซึ่งเติบโตไปพร้อมกับผมในทุกวัน",
                education: [
                    {
                        degree: "นักพัฒนาซอฟต์แวร์เว็บ และอุปกรณ์เคลื่อนที / นักพัฒนางานระบบสมองกลฝังตัว และ IoT",
                        institution: "วิทยาลัยเทคนิคชัยภูมิ / วิทยาลัยเทคนิคเลย",
                        year: "2021 - 2023",
                        description: "นี่เป็นการเริ่มเรียนเกี่ยวกับ IT อย่างจริงจัง จากการที่ผมย้ายไป 2 สถาบัน ที่มีหลักสูตรขั้นพื้นฐานที่แตกต่างกัน ทำให้ผมได้รับความรู้ทั้งสองด้านเข้ามา และในช่วงนี้ผมก็ยังได้เข้าร่วมการแข่งขันทักษะวิชาชีพ แล้วก็ยังมีการได้เข้าฝึกงานกับบริษัท น้ำตาลมิตรผล จำกัด อีกด้วย"
                    },
                    {
                        degree: "นักพัฒนาซอฟต์แวร์ขั้นสูง",
                        institution: "วิทยาลัยเทคนิคเลย",
                        year: "2024 - 2025",
                        description: "นี่เป็นปีที่ผมได้รู้ตัวเองแล้วว่าตัวเองเหมาะกับอะไร และชอบทำอะไร ผมจึงเรื่องที่จะมาเรียนการเป็นนักพัฒนาซอฟต์แวร์ขั้นสูง เพื่อให้ตัวเองได้รับความรู้เชิงลึกในด้านนี้ แม้ว่าจะเลือกเรียนเป็นนักพัฒนาซอฟต์แวร์ แต่ผมก็เรียนวิชาเสริมที่เกี่ยวกับด้าน Network, AI และแม้ว่าในหลักสูตรจะมีวิชา Hybrid App อยู่แล้ว แต่ผมก็เลือกที่จะเรียน Native App ด้วย เพื่อที่จะได้รู้ในทุก ๆ ด้าน และเพื่อจะได้นำไปปรับใช้ในอนาคต"
                    }
                ],
                experience: [
                    {
                        role: "IT INTERN SUPERVISOR",
                        company: "ICONNEX THAILAND (ปัจจุบันคือ ICONNEX WORLD) ",
                        period: "มีนาคม - มิถุนายน 2568",
                        description: "รับผิดชอบการบริหารจัดการนักศึกษาฝึกงาน IT ภายในทีมและมอบหมายงานตามความถนัด พัฒนาเว็บไซต์และระบบภายในสำหรับใช้งานในองค์กร ห้างสรรพสินค้า และงาน Event ต่างๆ โดยใช้เทคโนโลยี HTML, CSS, JavaScript (และ Frameworks), PHP, SQL, Python และเครื่องมืออย่าง Docker, GitHub, MongoDB เพื่อปรับปรุงคุณภาพงาน พร้อมทั้งตรวจสอบคุณภาพและความถูกต้องของโค้ด (Code Review) ก่อนนำขึ้น Production เพื่อให้ระบบมีความเสถียรและปลอดภัย รวมถึงเพิ่มประสิทธิภาพระบบ ลดข้อผิดพลาด และทำให้การใช้งานง่ายขึ้นสำหรับผู้ใช้จริง"
                    },
                    {
                        role: "IT INTERN",
                        company: "Mitr Phol Sugar Co., Ltd.",
                        period: "มีนาคม - เมษายน 2566",
                        description: "ดูแลและสนับสนุนระบบเครือข่ายและอุปกรณ์คอมพิวเตอร์ในองค์กร พัฒนาและแก้ไขระบบงานพื้นฐานเพื่อเพิ่มประสิทธิภาพการทำงาน พัฒนาเว็บไซต์หลักของบริษัทและเว็บไซต์ที่ใช้ในการสัมมนาในงานต่างๆ พร้อมทั้งเรียนรู้การทำงานแบบมืออาชีพและการทำงานร่วมกับทีม IT ในองค์กรขนาดใหญ่"
                    },
                    {
                        role: "FRONTEND SOFTWARE DEVELOPER",
                        company: "วิทยาลัยเทคนิคเลย",
                        period: "2024 - ปัจจุบัน",
                        description: "รับผิดชอบการดูแล ออกแบบ และพัฒนาส่วนหน้าบ้าน (Frontend) ของเว็บไซต์ทั้งหมดที่เกี่ยวข้องกับวิทยาลัยตามที่ได้รับมอบหมาย โดยเน้นการสร้างประสบการณ์ผู้ใช้งานที่ดี (User Experience) และออกแบบส่วนติดต่อผู้ใช้ (User Interface) ให้มีความสวยงาม ใช้งานง่าย และตอบสนองได้ดีบนทุกอุปกรณ์ (Responsive Design) พร้อมทั้งทำงานร่วมกับทีมพัฒนาเพื่อให้มั่นใจว่าเว็บไซต์มีประสิทธิภาพและตรงตามความต้องการของวิทยาลัยและผู้ใช้งาน"
                    }
                ],
                philosophy: "ผมเชื่อว่าการพัฒนาซอฟต์แวร์ที่ดีไม่ได้เกิดจากเทคโนโลยีเพียงอย่างเดียว แต่ต้องมาพร้อมกับความเข้าใจในความต้องการของผู้ใช้งานจริงและการทำงานเป็นทีมอย่างมีประสิทธิภาพ ในการทำงานทุกโปรเจกต์ ผมมุ่งเน้นการสร้างโซลูชันที่ไม่เพียงแค่ทำงานได้ แต่ต้องใช้งานง่าย มีเสถียรภาพ และสามารถขยายงานได้ในอนาคต ผมให้ความสำคัญกับคุณภาพของโค้ดผ่านการทำ Code Review อย่างสม่ำเสมอ เพราะเชื่อว่าการป้องกันปัญหาตั้งแต่ต้นทางดีกว่าการแก้ไขภายหลัง ในฐานะหัวหน้าทีมฝึกงาน ผมได้เรียนรู้ว่าการมอบหมายงานตามจุดแข็งของแต่ละคนและการสื่อสารที่ชัดเจนเป็นกุญแจสำคัญของความสำเร็จ ผมมุ่งมั่นพัฒนาตนเองอย่างต่อเนื่อง ติดตามเทคโนโลยีใหม่ๆ และแบ่งปันความรู้ผ่านการบรรยายและพอดแคสต์ เพราะเชื่อว่าการเติบโตของตัวเองและทีมเกิดขึ้นพร้อมกัน ด้วยเป้าหมายในการก้าวสู่ตำแหน่ง Project Manager ผมจึงพัฒนาทักษะทั้งด้านเทคนิคและการบริหารจัดการอย่างสมดุล เพื่อเป็นผู้นำที่สามารถเชื่อมโยงระหว่างทีมพัฒนาและวัตถุประสงค์ทางธุรกิจได้อย่างมีประสิทธิภาพ",
                interests: [
                    "Web Development & Programming",
                    "Learning New Technologies & Frameworks",
                    "Artificial Intelligence & Machine Learning",
                    "IT Education & Mentoring",
                    "Podcasting & Content Creation",
                    "Tech Community Involvement",
                    "Public Speaking & Presentations",
                    "Problem Solving & Innovation",
                    "System Architecture & Design Patterns",
                    "Reading Tech Blogs & Articles",
                    "Open Source Contribution",
                    "UI/UX Design",
                    "Gaming & Game Development",
                    "Music & Entertainment",
                    "Photography & Videography",
                    "Networking & Professional Development",
                    "Attending Tech Conferences & Workshops",
                    "Writing Technical Documentation",
                    "Code Optimization & Performance Tuning",
                    "Exploring Cloud Technologies",
                    "Cybersecurity & Best Practices",
                    "Mobile App Development",
                    "DevOps & Automation",
                    "Building Side Projects",
                    "Traveling & Cultural Exchange"
                ],
                expertise: [
                    {
                        area: "Frontend Development",
                        description: "มีความเชี่ยวชาญในการพัฒนาส่วนหน้าบ้านของเว็บแอปพลิเคชันด้วย HTML, CSS, JavaScript และ Frameworks ต่างๆ โดยเน้นการสร้าง User Interface ที่สวยงาม ใช้งานง่าย และรองรับการแสดงผลบนหลากหลายอุปกรณ์ (Responsive Design) พร้อมทั้งปรับปรุงประสิทธิภาพการทำงานให้รวดเร็วและราบรื่น"
                    },
                    {
                        area: "Backend Development",
                        description: "มีประสบการณ์ในการพัฒนาระบบฝั่ง Backend โดยใช้ PHP, Python, และ SQL ในการสร้าง API, จัดการฐานข้อมูล และพัฒนาระบบภายในองค์กร สามารถออกแบบสถาปัตยกรรมระบบที่มีประสิทธิภาพ ปลอดภัย และรองรับการขยายงานในอนาคตได้"
                    },
                    {
                        area: "Database Management",
                        description: "เชี่ยวชาญในการออกแบบและจัดการฐานข้อมูลทั้งแบบ Relational (SQL) และ NoSQL (MongoDB) สามารถเขียน Query ที่มีประสิทธิภาพ ปรับแต่งโครงสร้างฐานข้อมูลให้เหมาะสม และรักษาความสมบูรณ์ของข้อมูลได้อย่างมีประสิทธิภาพ"
                    },
                    {
                        area: "DevOps & Version Control",
                        description: "มีความชำนาญในการใช้เครื่องมือสำหรับการพัฒนาและการทำงานร่วมกันในทีม เช่น Docker สำหรับ Containerization และ GitHub สำหรับ Version Control และ Collaboration สามารถจัดการ Workflow การพัฒนาตั้งแต่ Development จนถึง Production ได้อย่างเป็นระบบ"
                    },
                    {
                        area: "Code Quality & Review",
                        description: "มีประสบการณ์ในการตรวจสอบคุณภาพโค้ด (Code Review) และ Quality Assurance ก่อนนำขึ้น Production เพื่อให้มั่นใจว่าระบบมีความเสถียร ปลอดภัย และมีประสิทธิภาพสูง พร้อมทั้งลดข้อผิดพลาดและปัญหาที่อาจเกิดขึ้นในอนาคต"
                    },
                    {
                        area: "Team Leadership & Project Management",
                        description: "มีประสบการณ์ในการบริหารจัดการทีมนักศึกษาฝึกงาน IT ในฐานะหัวหน้าทีม สามารถมอบหมายงานตามความถนัดของแต่ละคน วางแผนการทำงาน และประสานงานระหว่างทีมพัฒนากับความต้องการทางธุรกิจได้อย่างมีประสิทธิภาพ"
                    },
                    {
                        area: "Problem Solving & System Optimization",
                        description: "สามารถวิเคราะห์และแก้ไขปัญหาเชิงเทคนิคได้อย่างรวดเร็ว เพิ่มประสิทธิภาพระบบ ลดข้อผิดพลาด และปรับปรุงประสบการณ์ผู้ใช้งานให้ดีขึ้นผ่านการใช้เทคโนโลยีและแนวทางที่เหมาะสม"
                    },
                    {
                        area: "Hardware & IoT Development",
                        description: "มีพื้นฐานในการเขียนโปรแกรมควบคุม Hardware ด้วย Arduino และภาษา C/C++ สามารถพัฒนาโปรเจกต์ IoT และระบบฝังตัว (Embedded System) เบื้องต้นได้"
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
                    description: "An immersive 3D web experience allowing users to explore a cyberpunk city in the browser. Features high-performance shaders and audio reactivity.",
                    image: "https://images.unsplash.com/photo-1618172193622-ae2d025f4032?w=800&h=600&fit=crop"
                },
                {
                    title: "Flux Finance",
                    tech: "React / Node.js",
                    description: "Real-time cryptocurrency dashboard with predictive analytics powered by AI. Handles over 50k websocket connections simultaneously.",
                    image: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&h=600&fit=crop"
                },
                {
                    title: "Aero System",
                    tech: "Vue / Firebase",
                    description: "Enterprise-grade inventory management system designed for aerospace logistics. Reduced tracking errors by 40%.",
                    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop"
                },
                {
                    title: "Vantage UI",
                    tech: "Vanilla JS / CSS",
                    description: "A lightweight, dependency-free UI library focused on futuristic aesthetics and micro-interactions.",
                    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop"
                }
            ],
            certificates: [
                {
                    title: "AWS Certified Solutions Architect",
                    issuer: "Amazon Web Services",
                    date: "2024",
                    description: "Professional certification for designing distributed systems on AWS.",
                    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop"
                },
                {
                    title: "Google Cloud Professional Developer",
                    issuer: "Google Cloud",
                    date: "2023",
                    description: "Expertise in building scalable applications on Google Cloud Platform.",
                    image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=600&h=400&fit=crop"
                },
                {
                    title: "Meta Front-End Developer",
                    issuer: "Meta (Facebook)",
                    date: "2023",
                    description: "Professional certificate in modern front-end development with React.",
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
                const data = doc.data();
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
        if (!this.db) return { success: false, message: 'Firebase not initialized' };

        try {
            // Save to Cloud with timeout
            await Promise.race([
                this.db.collection('portfolio').doc('main').set(data),
                this.timeout(5000)
            ]);

            // Save to Local Cache
            this.saveDataLocally(data);

            return { success: true, message: 'Data saved to cloud successfully' };
        } catch (error) {
            console.error('Error pushing data to cloud:', error);

            // Even if cloud fails, save locally so user doesn't lose work
            this.saveDataLocally(data);
            return { success: false, message: 'Saved locally, but Cloud sync failed: ' + error.message };
        }
    },

    // Load Data from LocalStorage (Legacy/Fallback)
    loadData() {
        try {
            const data = localStorage.getItem(this.KEYS.DATA);
            return data ? JSON.parse(data) : this.getDefaultData();
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
            return { success: true, message: 'Data saved successfully' };
        } catch (error) {
            console.error('Error saving data:', error);
            return { success: false, message: 'Failed to save data' };
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
                        resolve({ success: true, message: 'Data imported successfully' });
                    } else {
                        reject({ success: false, message: 'Invalid data structure' });
                    }
                } catch (error) {
                    reject({ success: false, message: 'Failed to parse JSON file' });
                }
            };
            reader.onerror = () => reject({ success: false, message: 'Failed to read file' });
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
        return { success: false, message: 'Invalid skill index' };
    },

    deleteSkill(index) {
        const data = this.loadData();
        if (index >= 0 && index < data.skills.length) {
            data.skills.splice(index, 1);
            return this.saveData(data);
        }
        return { success: false, message: 'Invalid skill index' };
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
        return { success: false, message: 'Invalid project index' };
    },

    deleteProject(index) {
        const data = this.loadData();
        if (index >= 0 && index < data.projects.length) {
            data.projects.splice(index, 1);
            return this.saveData(data);
        }
        return { success: false, message: 'Invalid project index' };
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
        return { success: false, message: 'Invalid certificate index' };
    },

    deleteCertificate(index) {
        const data = this.loadData();
        if (!data.certificates) data.certificates = [];
        if (index >= 0 && index < data.certificates.length) {
            data.certificates.splice(index, 1);
            return this.saveData(data);
        }
        return { success: false, message: 'Invalid certificate index' };
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

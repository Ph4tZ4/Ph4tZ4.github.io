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
        DATA: 'vantage_portfolio_data' // Keep for backup/offline
    },

    // Default Data Structure
    getDefaultData() {
        return {
            about: {
                years: "5+",
                location: "Bangkok, Thailand",
                status: "Open for Freelance",
                description: "I am a creative technologist bridging the gap between design and engineering. My philosophy is simple: technology should feel magical.",
                detail: "With a background in Computer Science and a passion for Motion Design, I build applications that are not only functional but emotionally resonant.",
                education: [
                    {
                        degree: "Bachelor of Science in Computer Science",
                        institution: "Chulalongkorn University",
                        year: "2018 - 2022",
                        description: "Specialized in Software Engineering and Human-Computer Interaction. Graduated with First Class Honors."
                    },
                    {
                        degree: "Full-Stack Web Development Bootcamp",
                        institution: "Le Wagon Bangkok",
                        year: "2021",
                        description: "Intensive 9-week coding bootcamp focusing on Ruby on Rails, JavaScript, and modern web technologies."
                    }
                ],
                experience: [
                    {
                        role: "Senior Frontend Developer",
                        company: "Digital Innovations Co.",
                        period: "2022 - Present",
                        description: "Leading the development of enterprise-level web applications with React and Next.js. Mentoring junior developers and establishing coding standards."
                    },
                    {
                        role: "Full-Stack Developer",
                        company: "StartupHub Thailand",
                        period: "2020 - 2022",
                        description: "Built and maintained multiple client projects using modern JavaScript frameworks. Collaborated with designers to create pixel-perfect implementations."
                    },
                    {
                        role: "Junior Web Developer",
                        company: "Creative Agency Bangkok",
                        period: "2019 - 2020",
                        description: "Developed responsive websites and interactive web experiences. Gained expertise in CSS animations and JavaScript libraries."
                    }
                ],
                philosophy: "I believe that great software is born at the intersection of aesthetics and functionality. Every line of code should serve a purpose, and every interface should tell a story. My approach combines technical excellence with creative vision, ensuring that the applications I build are not just tools, but experiences that users genuinely enjoy.",
                interests: [
                    "3D Graphics & WebGL",
                    "Motion Design & Animation",
                    "UI/UX Design Systems",
                    "Open Source Contribution",
                    "Photography & Visual Arts",
                    "Electronic Music Production"
                ],
                expertise: [
                    {
                        area: "Frontend Architecture",
                        description: "Expert in building scalable, maintainable frontend applications using modern frameworks and design patterns."
                    },
                    {
                        area: "Performance Optimization",
                        description: "Specialized in optimizing web applications for speed, implementing lazy loading, code splitting, and efficient rendering strategies."
                    },
                    {
                        area: "Creative Coding",
                        description: "Passionate about pushing the boundaries of web technology with WebGL, Canvas API, and creative animation libraries."
                    },
                    {
                        area: "Design Systems",
                        description: "Experienced in creating and maintaining comprehensive design systems that ensure consistency across large-scale applications."
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
        // Initialize Firebase
        if (typeof firebase !== 'undefined' && !this.app) {
            this.app = firebase.initializeApp(this.firebaseConfig);
            this.db = firebase.firestore();
            this.storage = firebase.storage();
            console.log('✓ Firebase initialized');
        }

        // Set default password if not exists (password: "admin123")
        const existingPassword = localStorage.getItem(this.KEYS.PASSWORD);
        if (!existingPassword) {
            this.setPassword('admin123');
            console.log('✓ Default password set: admin123');
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

    // Upload Image to Firebase Storage
    async uploadImage(file, path = 'uploads') {
        if (!this.storage) throw new Error('Firebase Storage not initialized');

        const fileName = `${Date.now()}_${file.name}`;
        const storageRef = this.storage.ref(`${path}/${fileName}`);

        const snapshot = await storageRef.put(file);
        const downloadURL = await snapshot.ref.getDownloadURL();

        return downloadURL;
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

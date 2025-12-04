/**
 * PIKANOMWAAN Portfolio - Analytics Manager
 * Handles user tracking, session management, and data collection
 */

const AnalyticsManager = {
    // Firebase Collection
    COLLECTION: 'analytics_sessions',

    // Session State
    sessionId: null,
    startTime: null,
    pageStartTime: null,
    isActive: true,

    // Initialize Analytics
    async initialize() {
        // Wait for Firebase to be ready (from DataManager or global)
        if (typeof firebase === 'undefined') {
            console.warn('Firebase not loaded, analytics disabled');
            return;
        }

        this.db = firebase.firestore();
        this.sessionId = this.getOrCreateSessionId();
        this.startTime = Date.now();
        this.pageStartTime = Date.now();

        // Start Tracking
        await this.trackSessionStart();
        this.setupEventListeners();

        console.log('✓ Analytics initialized');
    },

    // Generate or Retrieve Session ID
    getOrCreateSessionId() {
        let sid = sessionStorage.getItem('analytics_session_id');
        if (!sid) {
            sid = 'sess_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
            sessionStorage.setItem('analytics_session_id', sid);
        }
        return sid;
    },

    // Get Device Information
    getDeviceInfo() {
        const ua = navigator.userAgent;
        let deviceType = 'Desktop';
        if (/Mobi|Android/i.test(ua)) deviceType = 'Mobile';
        else if (/Tablet|iPad/i.test(ua)) deviceType = 'Tablet';

        return {
            userAgent: ua,
            deviceType: deviceType,
            platform: navigator.platform,
            language: navigator.language,
            screenResolution: `${window.screen.width}x${window.screen.height}`
        };
    },

    // Get Geo-location (using free API)
    async getGeoLocation() {
        try {
            const response = await fetch('https://ipapi.co/json/');
            if (!response.ok) throw new Error('Geo-IP request failed');
            const data = await response.json();
            return {
                ip: data.ip,
                city: data.city,
                region: data.region,
                country: data.country_name,
                country_code: data.country_code
            };
        } catch (error) {
            console.warn('Geo-location failed:', error);
            return {
                city: 'Unknown',
                country: 'Unknown'
            };
        }
    },

    // Track Session Start
    async trackSessionStart() {
        const deviceInfo = this.getDeviceInfo();
        const location = await this.getGeoLocation();

        const sessionData = {
            sessionId: this.sessionId,
            startTime: firebase.firestore.Timestamp.now(),
            lastActive: firebase.firestore.Timestamp.now(),
            device: deviceInfo,
            location: location,
            pages: [window.location.pathname],
            totalDuration: 0,
            pageViews: 1
        };

        // Save to Firestore
        try {
            await this.db.collection(this.COLLECTION).doc(this.sessionId).set(sessionData, { merge: true });
        } catch (error) {
            console.error('Analytics Error:', error);
        }
    },

    // Update Session Heartbeat (Time on Page)
    async updateHeartbeat() {
        if (!this.isActive) return;

        const now = Date.now();
        const duration = Math.floor((now - this.startTime) / 1000);

        try {
            await this.db.collection(this.COLLECTION).doc(this.sessionId).update({
                lastActive: firebase.firestore.Timestamp.now(),
                totalDuration: duration
            });
        } catch (error) {
            // Ignore errors (e.g., offline)
        }
    },

    // Event Listeners
    setupEventListeners() {
        // Heartbeat every 10 seconds
        setInterval(() => this.updateHeartbeat(), 10000);

        // Visibility Change (Pause/Resume)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.isActive = false;
                this.updateHeartbeat(); // Final update before background
            } else {
                this.isActive = true;
                // Adjust start time logic if needed, but for simple duration, we just resume
            }
        });

        // Page Unload
        window.addEventListener('beforeunload', () => {
            this.updateHeartbeat();
        });
    }
};

// Auto-initialize if Firebase is present
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Wait a bit for Firebase to initialize in DataManager or main script
        setTimeout(() => AnalyticsManager.initialize(), 1000);
    });
} else {
    setTimeout(() => AnalyticsManager.initialize(), 1000);
}

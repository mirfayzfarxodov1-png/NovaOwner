// ============================================
// NOVA - STORAGE.JS (LocalStorage boshqaruvi)
// ============================================

(function() {
    "use strict";
    
    // ===== STORAGE KEYS =====
    window.STORAGE_KEYS = {
        USER: 'nova_user',
        POSTS: 'nova_posts',
        SUBS: 'nova_subs',
        NOTIFICATIONS: 'nova_notifications',
        SETTINGS: 'nova_settings'
    };
    
    // ===== GET DATA =====
    window.getData = function(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch(e) {
            console.error('Storage get error:', e);
            return defaultValue;
        }
    };
    
    // ===== SET DATA =====
    window.setData = function(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch(e) {
            console.error('Storage set error:', e);
            return false;
        }
    };
    
    // ===== REMOVE DATA =====
    window.removeData = function(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch(e) {
            console.error('Storage remove error:', e);
            return false;
        }
    };
    
    // ===== CLEAR ALL =====
    window.clearAllData = function() {
        try {
            Object.values(window.STORAGE_KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
            return true;
        } catch(e) {
            console.error('Storage clear error:', e);
            return false;
        }
    };
    
})();

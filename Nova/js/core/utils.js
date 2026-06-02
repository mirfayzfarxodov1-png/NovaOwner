// ============================================
// NOVA - UTILS.JS (Yordamchi funksiyalar)
// ============================================

(function() {
    "use strict";
    
    // ===== ESCAPE HTML =====
    window.escapeHtml = function(str) {
        if(!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if(m === '&') return '&amp;';
            if(m === '<') return '&lt;';
            if(m === '>') return '&gt;';
            return m;
        });
    };
    
    // ===== SHOW TOAST =====
    window.showToast = function(message, duration = 3000) {
        let toast = document.getElementById('toast');
        if(!toast) {
            toast = document.createElement('div');
            toast.id = 'toast';
            toast.className = 'toast';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.style.display = 'block';
        setTimeout(() => {
            toast.style.display = 'none';
        }, duration);
    };
    
    // ===== FORMAT TIME =====
    window.formatTime = function(timestamp) {
        if(!timestamp) return 'hozir';
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        if(diff < 60000) return 'hozir';
        if(diff < 3600000) return Math.floor(diff / 60000) + ' min';
        if(diff < 86400000) return date.getHours() + ':' + String(date.getMinutes()).padStart(2, '0');
        return date.toLocaleDateString();
    };
    
    // ===== FORMAT NUMBER =====
    window.formatNumber = function(num) {
        if(!num) return '0';
        if(num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if(num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };
    
    // ===== GENERATE ID =====
    window.generateId = function() {
        return Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    };
    
    // ===== DEBOUNCE =====
    window.debounce = function(func, delay) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    };
    
})();

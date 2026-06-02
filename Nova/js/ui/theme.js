// ============================================
// NOVA - THEME.JS (Mavzu tizimi)
// ============================================

(function() {
    "use strict";
    
    // ===== APPLY SETTINGS =====
    window.applySettings = function() {
        const settings = window.appState.settings;
        
        // Dark mode
        document.body.style.background = settings.darkMode ? '#000' : '#fff';
        document.body.style.color = settings.darkMode ? '#fff' : '#000';
        
        // Theme color
        let accent = settings.themeColor === 'red' ? '#ff0000' : 
                     settings.themeColor === 'blue' ? '#0066ff' : '#00cc00';
        document.documentElement.style.setProperty('--primary', accent);
        
        // Font size
        let fontSize = settings.fontSize === 'small' ? '12px' : 
                       settings.fontSize === 'large' ? '16px' : '14px';
        document.body.style.fontSize = fontSize;
        
        // Theme icon
        const themeIcon = document.getElementById('themeToggle');
        if(themeIcon) {
            themeIcon.className = settings.darkMode ? 'fas fa-moon' : 'fas fa-sun';
        }
    };
    
    // ===== TOGGLE THEME =====
    window.toggleTheme = function() {
        window.appState.settings.darkMode = !window.appState.settings.darkMode;
        window.applySettings();
        window.saveData();
        window.showToast(window.appState.settings.darkMode ? "Dark mode yoqildi" : "Light mode yoqildi");
    };
    
    // Theme toggle button
    const themeToggle = document.getElementById('themeToggle');
    if(themeToggle) {
        themeToggle.onclick = () => window.toggleTheme();
    }
    
})();

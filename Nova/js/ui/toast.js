// ============================================
// NOVA - TOAST.JS (Bildirishnomalar)
// ============================================

(function() {
    "use strict";
    
    // showToast funksiyasi utils.js da allaqachon bor
    // Bu fayl qo'shimcha funksiyalar uchun
    
    // ===== ADD NOTIFICATION =====
    window.addNotification = function(message) {
        const notifications = window.appState.notifications;
        notifications.unshift({
            id: Date.now(),
            message: message,
            time: new Date().toLocaleString(),
            read: false
        });
        
        if(notifications.length > 50) notifications.pop();
        
        window.saveData();
        window.updateNotifBadge();
        window.showToast(message);
    };
    
    // ===== UPDATE NOTIFICATION BADGE =====
    window.updateNotifBadge = function() {
        const unread = window.appState.notifications.filter(n => !n.read).length;
        const badge = document.getElementById('notifBadge');
        if(badge) {
            badge.textContent = unread;
            badge.style.display = unread > 0 ? 'inline-block' : 'none';
        }
    };
    
})();

// ============================================
// NOVA - MODAL.JS (Modal oynalar)
// ============================================

(function() {
    "use strict";
    
    // ===== CLOSE MODALS =====
    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if(modal) modal.style.display = 'none';
    };
    
    // ===== CLOSE ALL MODALS =====
    window.closeAllModals = function() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    };
    
    // ===== SETUP MODAL CLOSE BUTTONS =====
    document.querySelectorAll('.close-modal').forEach(btn => {
        const modal = btn.closest('.modal');
        if(modal) {
            btn.onclick = () => {
                modal.style.display = 'none';
            };
        }
    });
    
    // ===== CLOSE MODAL ON OUTSIDE CLICK =====
    window.onclick = (e) => {
        if(e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    };
    
})();

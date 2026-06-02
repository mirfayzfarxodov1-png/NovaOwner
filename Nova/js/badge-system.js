// ============================================
// NOVA - BADGE SYSTEM (Galichka tizimi)
// Qizil doira ichida NOVA animatsiyali galichka
// Yangi foydalanuvchilarga 1 oy tekin, keyin 1$/oy
// ============================================

(function() {
    "use strict";
    
    console.log("🎖️ NOVA Galichka tizimi ishga tushdi");
    
    // ===== KONFIGURATSIYA =====
    const CONFIG = {
        BADGE_PRICE: 1,  // 1$/oy
        FREE_TRIAL_DAYS: 30,
        STORAGE_KEYS: {
            HAS_BADGE: 'nova_has_badge',
            BADGE_EXPIRY: 'nova_badge_expiry',
            FREE_BADGE_RECEIVED: 'nova_free_badge_received'
        }
    };
    
    // ===== STATE =====
    let badgeState = {
        hasBadge: false,
        expiryDate: null,
        isFreeTrial: false,
        daysLeft: 0
    };
    
    // ===== LOCALSTORAGE DAN YUKLASH =====
    function loadBadgeState() {
        const hasBadge = localStorage.getItem(CONFIG.STORAGE_KEYS.HAS_BADGE) === 'true';
        const expiry = localStorage.getItem(CONFIG.STORAGE_KEYS.BADGE_EXPIRY);
        const freeReceived = localStorage.getItem(CONFIG.STORAGE_KEYS.FREE_BADGE_RECEIVED) === 'true';
        
        badgeState.hasBadge = hasBadge;
        badgeState.isFreeTrial = freeReceived && !hasBadge;
        
        if(expiry) {
            badgeState.expiryDate = new Date(expiry);
            const now = new Date();
            if(badgeState.expiryDate > now) {
                badgeState.daysLeft = Math.ceil((badgeState.expiryDate - now) / (1000 * 60 * 60 * 24));
                badgeState.hasBadge = true;
            } else {
                badgeState.hasBadge = false;
                badgeState.daysLeft = 0;
            }
        }
        
        updateBadgeDisplay();
        return badgeState.hasBadge;
    }
    
    // ===== SAVE TO LOCALSTORAGE =====
    function saveBadgeState() {
        localStorage.setItem(CONFIG.STORAGE_KEYS.HAS_BADGE, badgeState.hasBadge);
        if(badgeState.expiryDate) {
            localStorage.setItem(CONFIG.STORAGE_KEYS.BADGE_EXPIRY, badgeState.expiryDate.toISOString());
        }
    }
    
    // ===== YANGI FOYDALANUVCHIGA 1 OY TEKIN GALICHKA =====
    function giveFreeBadgeToNewUser() {
        const freeReceived = localStorage.getItem(CONFIG.STORAGE_KEYS.FREE_BADGE_RECEIVED);
        
        if(!freeReceived) {
            // Birinchi marta kirgan foydalanuvchi
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + CONFIG.FREE_TRIAL_DAYS);
            
            badgeState.hasBadge = true;
            badgeState.expiryDate = expiryDate;
            badgeState.isFreeTrial = true;
            badgeState.daysLeft = CONFIG.FREE_TRIAL_DAYS;
            
            localStorage.setItem(CONFIG.STORAGE_KEYS.FREE_BADGE_RECEIVED, 'true');
            saveBadgeState();
            updateBadgeDisplay();
            
            // Bildirishnoma ko'rsatish
            if(window.showToast) {
                window.showToast(`🎉 Tabriklaymiz! Sizga 1 oylik bepul NOVA galichka berildi!`);
            } else {
                alert("🎉 Tabriklaymiz! Sizga 1 oylik bepul NOVA galichka berildi!");
            }
            
            return true;
        }
        
        return false;
    }
    
    // ===== GALICHKA SOTIB OLISH =====
    function purchaseBadge() {
        if(badgeState.hasBadge && badgeState.daysLeft > 0) {
            if(window.showToast) {
                window.showToast(`✅ Sizda galichka mavjud! ${badgeState.daysLeft} kun qoldi`);
            }
            return false;
        }
        
        // To'lov modalini ochish
        showPaymentModal();
        return true;
    }
    
    // ===== TO'LOV MODALI =====
    function showPaymentModal() {
        let modal = document.getElementById('badgePaymentModal');
        if(!modal) {
            modal = createPaymentModal();
        }
        modal.style.display = 'flex';
    }
    
    function createPaymentModal() {
        const modal = document.createElement('div');
        modal.id = 'badgePaymentModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 450px;">
                <div class="modal-header">
                    <h3><i class="fas fa-crown"></i> NOVA Animatsiyali galichka</h3>
                    <button class="close-modal" id="closeBadgePaymentModal">&times;</button>
                </div>
                <div class="modal-body">
                    <div style="text-align:center;padding:20px;background:#1a1a1a;border-radius:16px;margin-bottom:20px">
                        <div class="nova-badge-animation" style="width:80px;height:80px;background:#ff0000;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto;animation:badgeGlow 1.5s infinite">
                            <span style="font-size:28px;color:#fff;font-weight:bold">NOVA</span>
                        </div>
                    </div>
                    <p style="font-size:24px;text-align:center;font-weight:bold">1$ / oy</p>
                    <p style="text-align:center;font-size:12px;color:#888">Chek Mirfayzga yuboriladi: +998938138110</p>
                    <input type="text" id="badgePaymentContact" class="form-input" placeholder="Telefon yoki email" style="margin-top:15px">
                    <button id="confirmBadgePayment" class="btn" style="margin-top:15px">To'lov qilish</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        document.getElementById('closeBadgePaymentModal').onclick = () => {
            modal.style.display = 'none';
        };
        
        document.getElementById('confirmBadgePayment').onclick = () => {
            const contact = document.getElementById('badgePaymentContact').value;
            if(!contact) {
                if(window.showToast) window.showToast("❌ Kontakt kiriting!");
                else alert("❌ Kontakt kiriting!");
                return;
            }
            
            modal.style.display = 'none';
            
            // Tasdiqlash modalini ko'rsatish
            showVerifyModal();
        };
        
        return modal;
    }
    
    function showVerifyModal() {
        let modal = document.getElementById('badgeVerifyModal');
        if(!modal) {
            modal = document.createElement('div');
            modal.id = 'badgeVerifyModal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content" style="max-width: 400px;">
                    <div class="modal-header">
                        <h3><i class="fas fa-shield-alt"></i> Galichkani tasdiqlash</h3>
                        <button class="close-modal" id="closeBadgeVerifyModal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <p>💰 To'lov kelib tushdi!</p>
                        <p>Foydalanuvchi: <span id="badgeVerifyUser">Foydalanuvchi</span></p>
                        <div style="display:flex;gap:12px;margin-top:15px">
                            <button id="approveBadgePayment" style="flex:1;background:#00cc00;padding:10px;border-radius:30px;border:none;cursor:pointer">✅ Tasdiqlash</button>
                            <button id="rejectBadgePayment" style="flex:1;background:#ff0000;padding:10px;border-radius:30px;border:none;cursor:pointer">❌ Rad etish</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            
            document.getElementById('closeBadgeVerifyModal').onclick = () => {
                modal.style.display = 'none';
            };
            
            document.getElementById('approveBadgePayment').onclick = () => {
                activateBadgeForOneMonth();
                modal.style.display = 'none';
                if(window.showToast) window.showToast("✅ Galichka tasdiqlandi!");
            };
            
            document.getElementById('rejectBadgePayment').onclick = () => {
                modal.style.display = 'none';
                if(window.showToast) window.showToast("❌ Galichka rad etildi.");
            };
        }
        
        const currentUser = JSON.parse(localStorage.getItem('nova_user') || '{}');
        document.getElementById('badgeVerifyUser').textContent = currentUser.name || 'Foydalanuvchi';
        modal.style.display = 'flex';
    }
    
    // ===== 1 OYLIK GALICHKA AKTIVATSIYA =====
    function activateBadgeForOneMonth() {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        
        badgeState.hasBadge = true;
        badgeState.expiryDate = expiryDate;
        badgeState.daysLeft = 30;
        badgeState.isFreeTrial = false;
        
        saveBadgeState();
        updateBadgeDisplay();
        
        if(window.showToast) {
            window.showToast("✅ Galichka 1 oyga aktivlashtirildi!");
        }
    }
    
    // ===== BADGE DISPLAY (QIZIL DOIRA ICHIDA NOVA) =====
    function updateBadgeDisplay() {
        // Sidebardagi galichka tugmasini yangilash
        const badgeBtn = document.getElementById('novaBadgeBtn');
        if(badgeBtn) {
            if(badgeState.hasBadge && badgeState.daysLeft > 0) {
                badgeBtn.style.opacity = '1';
                const statusSpan = badgeBtn.querySelector('.badge-status');
                if(statusSpan) {
                    statusSpan.textContent = `${badgeState.daysLeft} kun qoldi`;
                    statusSpan.style.display = 'inline-block';
                }
            } else {
                const statusSpan = badgeBtn.querySelector('.badge-status');
                if(statusSpan) statusSpan.style.display = 'none';
            }
        }
        
        // Profil rasmi yonida galichka indikatori
        let badgeIndicator = document.getElementById('userBadgeIndicator');
        if(!badgeIndicator && badgeState.hasBadge) {
            const profileAvatar = document.querySelector('.creator-avatar');
            if(profileAvatar) {
                badgeIndicator = document.createElement('div');
                badgeIndicator.id = 'userBadgeIndicator';
                badgeIndicator.className = 'user-badge-indicator';
                badgeIndicator.style.cssText = `
                    position: absolute;
                    bottom: -5px;
                    right: -5px;
                    width: 24px;
                    height: 24px;
                    background: #ff0000;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 2px solid #000;
                    font-size: 10px;
                    font-weight: bold;
                    animation: badgePulse 1.5s infinite;
                `;
                badgeIndicator.innerHTML = 'N';
                profileAvatar.style.position = 'relative';
                profileAvatar.appendChild(badgeIndicator);
            }
        } else if(badgeIndicator && !badgeState.hasBadge) {
            badgeIndicator.remove();
        }
    }
    
    // ===== SIDEBARGA GALICHKA TUGMASINI QO'SHISH =====
    function addBadgeButtonToSidebar() {
        const sidebarFooter = document.querySelector('.sidebar-footer');
        if(sidebarFooter && !document.getElementById('novaBadgeBtn')) {
            const badgeBtn = document.createElement('button');
            badgeBtn.id = 'novaBadgeBtn';
            badgeBtn.className = 'btn';
            badgeBtn.innerHTML = `
                <div style="display:flex;align-items:center;justify-content:center;gap:10px;width:100%">
                    <div style="width:32px;height:32px;background:#ff0000;border-radius:50%;display:flex;align-items:center;justify-content:center;animation:badgePulse 2s infinite">
                        <span style="color:#fff;font-weight:bold;font-size:14px">N</span>
                    </div>
                    <span>NOVA galichka</span>
                    <span class="badge-status" style="font-size:10px;background:#ffd700;color:#000;padding:2px 6px;border-radius:20px;display:none"></span>
                </div>
            `;
            badgeBtn.onclick = () => purchaseBadge();
            
            // Agar oldingi tugmalar bo'lsa, ularni olib tashlash
            const oldBadgeBtn = document.getElementById('badgeBtn');
            if(oldBadgeBtn) oldBadgeBtn.remove();
            
            sidebarFooter.insertBefore(badgeBtn, sidebarFooter.firstChild);
        }
    }
    
    // ===== CSS ANIMATION QO'SHISH =====
    function addBadgeStyles() {
        if(document.getElementById('novaBadgeStyles')) return;
        
        const style = document.createElement('style');
        style.id = 'novaBadgeStyles';
        style.textContent = `
            @keyframes badgePulse {
                0%, 100% { transform: scale(1); box-shadow: 0 0 5px #ff0000; }
                50% { transform: scale(1.05); box-shadow: 0 0 20px #ff0000; }
            }
            @keyframes badgeGlow {
                0%, 100% { box-shadow: 0 0 5px #ff0000; }
                50% { box-shadow: 0 0 25px #ff0000; }
            }
            .user-badge-indicator {
                animation: badgePulse 1.5s infinite;
            }
            #novaBadgeBtn {
                background: linear-gradient(135deg, #1a1a1a, #0a0a0a);
                border: 1px solid #ff0000;
                margin-bottom: 10px;
            }
            #novaBadgeBtn:hover {
                transform: scale(1.02);
                border-color: #ff4444;
            }
        `;
        document.head.appendChild(style);
    }
    
    // ===== GALICHKA HOLATINI TEKSHIRISH (BAJARILGAN POSTLAR UCHUN) =====
    window.hasActiveBadge = function() {
        loadBadgeState();
        return badgeState.hasBadge && badgeState.daysLeft > 0;
    };
    
    window.getBadgeDaysLeft = function() {
        loadBadgeState();
        return badgeState.daysLeft;
    };
    
    // ===== INIT =====
    function init() {
        addBadgeStyles();
        addBadgeButtonToSidebar();
        giveFreeBadgeToNewUser();
        loadBadgeState();
        
        console.log("✅ Galichka tizimi tayyor!");
        console.log(`📌 Galichka holati: ${badgeState.hasBadge ? `Aktiv (${badgeState.daysLeft} kun qoldi)` : 'Aktiv emas'}`);
    }
    
    // Auto-init
    if(document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();

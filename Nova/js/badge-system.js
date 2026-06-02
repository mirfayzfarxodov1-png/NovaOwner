// ============================================
// NOVA - BADGE SYSTEM (Galichka tizimi)
// O'NG TOMONDA (RIGHT PANEL) JOYLASHGAN
// Qizil doira ichida NOVA animatsiyali galichka
// Yangi foydalanuvchilarga 1 oy tekin, keyin 1$/oy
// ============================================

(function() {
    "use strict";
    
    console.log("🎖️ NOVA Galichka tizimi ishga tushdi (O'ng tomonda)");
    
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
        
        badgeState.hasBadge = hasBadge;
        
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
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + CONFIG.FREE_TRIAL_DAYS);
            
            badgeState.hasBadge = true;
            badgeState.expiryDate = expiryDate;
            badgeState.isFreeTrial = true;
            badgeState.daysLeft = CONFIG.FREE_TRIAL_DAYS;
            
            localStorage.setItem(CONFIG.STORAGE_KEYS.FREE_BADGE_RECEIVED, 'true');
            saveBadgeState();
            updateBadgeDisplay();
            
            if(window.showToast) {
                window.showToast(`🎉 Tabriklaymiz! Sizga 1 oylik bepul NOVA galichka berildi!`);
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
    
    // ===== O'NG TOMONDA GALICHKA KARTASINI YARATISH =====
    function createBadgeCard() {
        const rightPanel = document.querySelector('.right-panel');
        if(!rightPanel) return;
        
        // Badge kartasini yaratish
        const badgeCard = document.createElement('div');
        badgeCard.id = 'novaBadgeCard';
        badgeCard.className = 'badge-card';
        badgeCard.style.cssText = `
            background: linear-gradient(135deg, #1a0000, #0a0a0a);
            border: 1px solid #ff0000;
            border-radius: 20px;
            padding: 20px;
            text-align: center;
            margin-bottom: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        
        badgeCard.innerHTML = `
            <div class="badge-header" style="margin-bottom: 15px;">
                <i class="fas fa-crown" style="color: #ffd700; font-size: 24px;"></i>
                <h3 style="display: inline-block; margin-left: 8px;">NOVA Galichka</h3>
            </div>
            <div class="badge-preview" style="margin: 15px 0;">
                <div class="nova-badge-animation" style="width: 70px; height: 70px; background: #ff0000; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto; animation: badgePulse 1.5s infinite">
                    <span style="font-size: 24px; color: #fff; font-weight: bold;">NOVA</span>
                </div>
            </div>
            <div class="badge-status-info" style="margin: 10px 0;">
                <div class="badge-price" style="font-size: 18px; font-weight: bold; color: #ffd700;">1$ / oy</div>
                <div class="badge-days-left" id="badgeDaysLeft" style="font-size: 12px; color: #888; margin-top: 5px;"></div>
            </div>
            <button id="buyBadgeFromCard" class="btn" style="background: linear-gradient(135deg, #ff0000, #cc0000); margin-top: 10px; width: 100%;">
                <i class="fas fa-crown"></i> Sotib olish
            </button>
            <div class="badge-features" style="margin-top: 15px; font-size: 11px; color: #666; text-align: left;">
                <div>✅ Animatsiyali galichka</div>
                <div>✅ Profil yonida ko'rinadi</div>
                <div>✅ Eksklyuziv status</div>
            </div>
        `;
        
        // Eski badge card ni o'chirish (agar mavjud bo'lsa)
        const oldBadgeCard = document.getElementById('novaBadgeCard');
        if(oldBadgeCard) oldBadgeCard.remove();
        
        // Yangi kartani qo'shish (birinchi o'ringa)
        const firstChild = rightPanel.firstChild;
        if(firstChild) {
            rightPanel.insertBefore(badgeCard, firstChild);
        } else {
            rightPanel.appendChild(badgeCard);
        }
        
        // Tugma event listener
        const buyBtn = document.getElementById('buyBadgeFromCard');
        if(buyBtn) {
            buyBtn.onclick = (e) => {
                e.stopPropagation();
                purchaseBadge();
            };
        }
        
        // Karta ustiga bosish
        badgeCard.onclick = () => {
            purchaseBadge();
        };
        
        return badgeCard;
    }
    
    // ===== BADGE DISPLAY YANGILASH =====
    function updateBadgeDisplay() {
        // O'ng tomondagi badge kartasini yangilash
        const daysLeftSpan = document.getElementById('badgeDaysLeft');
        const badgeCard = document.getElementById('novaBadgeCard');
        
        if(daysLeftSpan) {
            if(badgeState.hasBadge && badgeState.daysLeft > 0) {
                daysLeftSpan.innerHTML = `✅ Aktiv | ${badgeState.daysLeft} kun qoldi`;
                daysLeftSpan.style.color = '#00cc00';
            } else if(badgeState.hasBadge && badgeState.isFreeTrial) {
                daysLeftSpan.innerHTML = `🎁 Bepul sinov | ${badgeState.daysLeft} kun qoldi`;
                daysLeftSpan.style.color = '#ffd700';
            } else {
                daysLeftSpan.innerHTML = `⭕ Aktiv emas | 1$/oy`;
                daysLeftSpan.style.color = '#ff0000';
            }
        }
        
        if(badgeCard) {
            if(badgeState.hasBadge && badgeState.daysLeft > 0) {
                badgeCard.style.borderColor = '#00cc00';
                badgeCard.style.boxShadow = '0 0 10px rgba(0,204,0,0.3)';
            } else {
                badgeCard.style.borderColor = '#ff0000';
                badgeCard.style.boxShadow = 'none';
            }
        }
        
        // Profil yonida galichka indikatori (o'ng tomonda ko'rinadi)
        let badgeIndicator = document.getElementById('userBadgeIndicator');
        const creatorAvatar = document.querySelector('.creator-avatar');
        
        if(badgeState.hasBadge && badgeState.daysLeft > 0) {
            if(!badgeIndicator && creatorAvatar) {
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
                creatorAvatar.style.position = 'relative';
                creatorAvatar.appendChild(badgeIndicator);
            } else if(badgeIndicator) {
                badgeIndicator.style.display = 'flex';
            }
        } else if(badgeIndicator) {
            badgeIndicator.style.display = 'none';
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
            .nova-badge-animation {
                animation: badgePulse 1.5s infinite;
                transition: all 0.3s ease;
            }
            .nova-badge-animation:hover {
                transform: scale(1.1);
            }
            #novaBadgeCard {
                transition: all 0.3s ease;
            }
            #novaBadgeCard:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 25px rgba(255,0,0,0.2);
            }
            .badge-features div {
                margin: 5px 0;
            }
        `;
        document.head.appendChild(style);
    }
    
    // ===== GALICHKA HOLATINI TEKSHIRISH =====
    window.hasActiveBadge = function() {
        loadBadgeState();
        return badgeState.hasBadge && badgeState.daysLeft > 0;
    };
    
    window.getBadgeDaysLeft = function() {
        loadBadgeState();
        return badgeState.daysLeft;
    };
    
    // ===== MUTATION OBSERVER (RIGHT PANEL HAZIR BO'LGACHA KUTISH) =====
    function waitForRightPanel() {
        const observer = new MutationObserver((mutations, obs) => {
            const rightPanel = document.querySelector('.right-panel');
            if(rightPanel) {
                obs.disconnect();
                createBadgeCard();
                loadBadgeState();
                updateBadgeDisplay();
            }
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
        
        // Agar allaqachon mavjud bo'lsa
        if(document.querySelector('.right-panel')) {
            observer.disconnect();
            createBadgeCard();
            loadBadgeState();
            updateBadgeDisplay();
        }
    }
    
    // ===== INIT =====
    function init() {
        addBadgeStyles();
        waitForRightPanel();
        giveFreeBadgeToNewUser();
        
        console.log("✅ Galichka tizimi tayyor! (O'ng tomonda)");
        console.log(`📌 Galichka holati: ${badgeState.hasBadge ? `Aktiv (${badgeState.daysLeft} kun qoldi)` : 'Aktiv emas'}`);
    }
    
    // Auto-init
    if(document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();

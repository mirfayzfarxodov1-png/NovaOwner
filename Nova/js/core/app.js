// ============================================
// NOVA - APP.JS (Asosiy ilova)
// ============================================

(function() {
    "use strict";
    
    console.log("🚀 NOVA ishga tushdi | Mirfayz Creator");
    
    // ===== GLOBAL STATE =====
    window.appState = {
        currentUser: null,
        posts: [],
        users: {},
        followers: {},
        notifications: [],
        subscriptions: [],
        settings: {
            darkMode: true,
            themeColor: 'red',
            fontSize: 'medium',
            autoPlay: false,
            hdVideo: true,
            notifSub: true,
            notifLike: true,
            notifComment: true
        },
        isInitialized: false
    };
    
    // ===== LOAD DATA =====
    window.loadData = function() {
        try {
            const savedUser = localStorage.getItem('nova_user');
            if(savedUser) {
                window.appState.currentUser = JSON.parse(savedUser);
            } else {
                window.appState.currentUser = {
                    id: 'user_' + Date.now(),
                    name: 'Foydalanuvchi',
                    bio: 'Nova da yangiman!',
                    avatar: 'https://ui-avatars.com/api/?background=ff0000&color=fff&name=User',
                    coins: 100,
                    level: 1,
                    hasBadge: false,
                    videoCount: 0,
                    followerCount: 0
                };
            }
            
            const savedPosts = localStorage.getItem('nova_posts');
            if(savedPosts) window.appState.posts = JSON.parse(savedPosts);
            
            const savedSubs = localStorage.getItem('nova_subs');
            if(savedSubs) window.appState.subscriptions = JSON.parse(savedSubs);
            
            const savedNotifs = localStorage.getItem('nova_notifications');
            if(savedNotifs) window.appState.notifications = JSON.parse(savedNotifs);
            
            const savedSettings = localStorage.getItem('nova_settings');
            if(savedSettings) window.appState.settings = { ...window.appState.settings, ...JSON.parse(savedSettings) };
            
            // Build users from posts
            window.appState.posts.forEach(post => {
                if(!window.appState.users[post.userId]) {
                    window.appState.users[post.userId] = {
                        id: post.userId,
                        name: post.userName,
                        avatar: post.userAvatar,
                        bio: ''
                    };
                }
            });
            
            window.appState.users[window.appState.currentUser.id] = {
                id: window.appState.currentUser.id,
                name: window.appState.currentUser.name,
                avatar: window.appState.currentUser.avatar,
                bio: window.appState.currentUser.bio
            };
            
            return true;
        } catch(e) {
            console.error("Load error:", e);
            return false;
        }
    };
    
    // ===== SAVE DATA =====
    window.saveData = function() {
        localStorage.setItem('nova_user', JSON.stringify(window.appState.currentUser));
        localStorage.setItem('nova_posts', JSON.stringify(window.appState.posts));
        localStorage.setItem('nova_subs', JSON.stringify(window.appState.subscriptions));
        localStorage.setItem('nova_notifications', JSON.stringify(window.appState.notifications));
        localStorage.setItem('nova_settings', JSON.stringify(window.appState.settings));
    };
    
    // ===== INIT =====
    window.init = function() {
        if(window.loadData()) {
            window.applySettings();
            window.updateUI();
            window.renderFeed();
            window.renderSuggestions();
            window.renderStories();
            window.renderHashtags();
            window.updateNotifBadge();
            window.showToast("NOVA tayyor! 🚀");
        }
    };
    
    // Auto-init
    if(document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();

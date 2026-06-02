// ============================================
// NOVA - LIKES.JS (Layk tizimi)
// ============================================

(function() {
    "use strict";
    
    // ===== TOGGLE LIKE =====
    window.toggleLike = function(postId) {
        const post = window.appState.posts.find(p => p.id === postId);
        if(!post) return;
        
        const wasLiked = post.liked;
        post.liked = !wasLiked;
        post.likes += wasLiked ? -1 : 1;
        
        if(!wasLiked) {
            // NOVA animatsiyasi
            const anim = document.createElement('div');
            anim.className = 'nova-like';
            anim.innerHTML = 'NOVA ❤️';
            document.body.appendChild(anim);
            setTimeout(() => anim.remove(), 800);
            
            // Add coins
            window.addCoins(1, "Layk bosildi");
            
            // Notification
            if(post.userId !== window.appState.currentUser.id) {
                window.addNotification(`${window.appState.currentUser.name} sizning videongizga layk bosdi!`);
            }
        }
        
        window.saveData();
        window.renderFeed();
        
        // Update reels if open
        if(document.getElementById('reelsContainer').style.display === 'block') {
            window.showReels();
        }
    };
    
})();

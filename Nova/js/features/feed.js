// ============================================
// NOVA - FEED.JS (Feed va postlar)
// ============================================

(function() {
    "use strict";
    
    // ===== RENDER FEED =====
    window.renderFeed = function() {
        const container = document.getElementById('feedContainer');
        if(!container) return;
        
        const posts = window.appState.posts;
        const currentUser = window.appState.currentUser;
        const subscriptions = window.appState.subscriptions;
        
        let visiblePosts = posts.filter(p => {
            if(p.privacy === 'public') return true;
            if(p.privacy === 'subscribers' && subscriptions.includes(p.userId)) return true;
            if(p.privacy === 'private' && p.userId === currentUser.id) return true;
            if(p.userId === currentUser.id) return true;
            return false;
        });
        
        if(visiblePosts.length === 0) {
            container.innerHTML = `<div class="empty-feed"><i class="fas fa-video"></i><p>Hech qanday video yo'q.<br>Birinchi videoni yuklang!</p></div>`;
            return;
        }
        
        container.innerHTML = visiblePosts.map(post => window.renderPostHTML(post)).join('');
        window.attachPostEvents();
    };
    
    // ===== RENDER POST HTML =====
    window.renderPostHTML = function(post) {
        const isSubscribed = window.appState.subscriptions.includes(post.userId);
        const commentsCount = post.comments?.length || 0;
        
        return `
            <div class="post" data-post-id="${post.id}">
                <div class="post-header">
                    <div class="post-user" onclick="window.goToChannel('${post.userId}')">
                        <img src="${post.userAvatar}" class="post-avatar">
                        <div>
                            <div class="post-name">${window.escapeHtml(post.userName)}</div>
                            <div class="post-time">${post.time}</div>
                        </div>
                    </div>
                    <div class="post-menu" onclick="window.toggleMenu(this)">
                        <i class="fas fa-ellipsis-h"></i>
                        <div class="post-menu-dropdown">
                            ${post.userId === window.appState.currentUser.id ? 
                                `<div onclick="window.deleteVideo('${post.id}')"><i class="fas fa-trash"></i> O'chirish</div>` : 
                                `<div onclick="window.reportPost()"><i class="fas fa-flag"></i> Shikoyat</div>`
                            }
                            <div onclick="window.sharePost('${post.id}')"><i class="fas fa-share"></i> Ulashish</div>
                            <div onclick="window.copyLink('${post.id}')"><i class="fas fa-link"></i> Havola</div>
                        </div>
                    </div>
                </div>
                <video src="${post.videoUrl}" class="post-video" controls></video>
                <div class="post-actions">
                    <button class="action-btn like-btn ${post.liked ? 'liked' : ''}" onclick="window.toggleLike('${post.id}')">
                        <i class="fas fa-heart"></i> <span>${post.likes}</span>
                    </button>
                    <button class="action-btn" onclick="window.showComments('${post.id}')">
                        <i class="fas fa-comment"></i> <span>${commentsCount}</span>
                    </button>
                    <button class="action-btn" onclick="window.sharePost('${post.id}')">
                        <i class="fas fa-share"></i> <span>${post.shares || 0}</span>
                    </button>
                    <button class="action-btn subscribe-btn ${isSubscribed ? 'liked' : ''}" onclick="window.toggleSubscribe('${post.userId}')">
                        <i class="fas fa-bell"></i> <span>${isSubscribed ? 'Obunada' : 'Obuna'}</span>
                    </button>
                </div>
                <div class="post-caption"><strong>${window.escapeHtml(post.userName)}</strong> ${window.escapeHtml(post.caption)}</div>
                <div class="post-comments" onclick="window.showComments('${post.id}')">
                    ${commentsCount > 0 ? `Barcha ${commentsCount} ta kommentni ko'rish` : 'Komment yozing'}
                </div>
                <div class="comment-input">
                    <input type="text" id="comment_${post.id}" placeholder="Komment yozing...">
                    <button onclick="window.addComment('${post.id}', document.getElementById('comment_${post.id}').value)">Yuborish</button>
                </div>
            </div>
        `;
    };
    
})();

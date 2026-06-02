// ============================================
// NOVA - COMMENTS.JS (Kommentlar tizimi)
// ============================================

(function() {
    "use strict";
    
    // ===== ADD COMMENT =====
    window.addComment = function(postId, text) {
        if(!text.trim()) return;
        
        const post = window.appState.posts.find(p => p.id === postId);
        if(!post) return;
        
        if(!post.comments) post.comments = [];
        
        post.comments.push({
            id: Date.now(),
            userId: window.appState.currentUser.id,
            userName: window.appState.currentUser.name,
            userAvatar: window.appState.currentUser.avatar,
            text: text,
            time: new Date().toLocaleString()
        });
        
        window.addCoins(2, "Komment yozildi");
        
        if(post.userId !== window.appState.currentUser.id) {
            window.addNotification(`${window.appState.currentUser.name} videongizga komment qoldirdi: "${text.slice(0,50)}"`);
        }
        
        window.saveData();
        window.renderFeed();
        
        if(document.getElementById('commentsModal').style.display === 'flex') {
            window.showComments(postId);
        }
    };
    
    // ===== SHOW COMMENTS =====
    window.showComments = function(postId) {
        const post = window.appState.posts.find(p => p.id === postId);
        if(!post) return;
        
        const list = document.getElementById('commentsList');
        
        if(!post.comments || post.comments.length === 0) {
            list.innerHTML = '<div style="text-align:center;padding:20px;color:#888">Hozircha kommentlar yo\'q</div>';
        } else {
            list.innerHTML = post.comments.map(c => `
                <div class="comment-item">
                    <img src="${c.userAvatar}" class="comment-avatar">
                    <div>
                        <div class="comment-name">${c.userName}</div>
                        <div class="comment-text">${c.text}</div>
                        <div class="comment-time">${c.time}</div>
                    </div>
                </div>
            `).join('');
        }
        
        document.getElementById('commentsModal').style.display = 'flex';
        
        const sendBtn = document.getElementById('sendCommentBtn');
        const input = document.getElementById('newComment');
        
        sendBtn.onclick = () => {
            if(input.value.trim()) {
                window.addComment(postId, input.value);
                input.value = '';
                window.showComments(postId);
            }
        };
    };
    
})();

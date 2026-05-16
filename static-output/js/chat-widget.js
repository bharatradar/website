(function () {
    var chatOpen = false;

    document.addEventListener('DOMContentLoaded', function () {
        var fab = document.getElementById('chat-fab');
        var chatWin = document.getElementById('chat-window');
        var closeBtn = document.getElementById('chat-close');
        var sendBtn = document.getElementById('chat-send');
        var input = document.getElementById('chat-input');

        if (!fab || !chatWin) return;

        fab.addEventListener('click', toggleChat);
        if (closeBtn) closeBtn.addEventListener('click', toggleChat);
        if (sendBtn) sendBtn.addEventListener('click', sendMessage);
        if (input) input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') sendMessage();
        });
    });

    function toggleChat() {
        var fab = document.getElementById('chat-fab');
        var chatWin = document.getElementById('chat-window');
        if (!chatOpen) {
            chatWin.classList.add('open');
            fab.classList.add('hidden');
            chatOpen = true;
            var input = document.getElementById('chat-input');
            if (input) input.focus();
            var msgs = document.getElementById('chat-messages');
            if (msgs) msgs.scrollTop = msgs.scrollHeight;
        } else {
            chatWin.classList.remove('open');
            fab.classList.remove('hidden');
            chatOpen = false;
        }
    }

    function getSessionId() {
        var sid = sessionStorage.getItem('br_chat_session');
        if (!sid) {
            sid = 'web_user_' + Math.random().toString(36).substring(2, 9);
            sessionStorage.setItem('br_chat_session', sid);
        }
        return sid;
    }

    function cleanHtml(text) {
        return text.replace(/\n/g, '<br>');
    }

    function addBotMessage(html) {
        var container = document.getElementById('chat-messages');
        if (!container) return;
        var div = document.createElement('div');
        div.className = 'chat-msg-row';
        div.innerHTML =
            '<div class="chat-avatar bot"><i class="fa-solid fa-robot"></i></div>' +
            '<div class="chat-bubble bot">' + cleanHtml(html) + '</div>';
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    }

    function addUserMessage(text) {
        var container = document.getElementById('chat-messages');
        if (!container) return;
        var div = document.createElement('div');
        div.className = 'chat-msg-row user';
        div.innerHTML =
            '<div class="chat-bubble user">' + text.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</div>' +
            '<div class="chat-avatar user"><i class="fa-solid fa-user"></i></div>';
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    }

    function showTyping() {
        var el = document.getElementById('chat-typing');
        if (el) el.classList.add('visible');
    }

    function hideTyping() {
        var el = document.getElementById('chat-typing');
        if (el) el.classList.remove('visible');
    }

    function showError(msg) {
        var container = document.getElementById('chat-messages');
        if (!container) return;
        var div = document.createElement('div');
        div.className = 'chat-msg-row';
        div.innerHTML =
            '<div class="chat-avatar error"><i class="fa-solid fa-triangle-exclamation"></i></div>' +
            '<div class="chat-bubble error">' + msg + '</div>';
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    }

    async function sendMessage() {
        var input = document.getElementById('chat-input');
        var text = input ? input.value.trim() : '';
        if (!text) return;
        input.value = '';

        addUserMessage(text);

        showTyping();

        try {
            var sessionId = getSessionId();
            var res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, session_id: sessionId })
            });
            var data = await res.json();
            var response = data.response || 'No response received.';
            hideTyping();
            addBotMessage(response);
        } catch (e) {
            hideTyping();
            showError('Network error connecting to chat. Please try again.');
        }
    }
})();

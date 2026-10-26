document.addEventListener('DOMContentLoaded', () => {
    // 1. Acordeón FAQ y Búsqueda
    const faqItems = document.querySelectorAll('.faq-item');
    const faqSearchInput = document.getElementById('faqSearchInput');
    const filterCategoryBtns = document.querySelectorAll('.faq-categories-row .filter-btn');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(i => i.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });

    filterCategoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterCategoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.getAttribute('data-category');

            faqItems.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    faqSearchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        faqItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(query)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });

    // 2. Formulario de Soporte (Mailto Real)
    const supportContactForm = document.getElementById('supportContactForm');
    supportContactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('suppName').value.trim();
        const email = document.getElementById('suppEmail').value.trim();
        const subject = document.getElementById('suppSubject').value;
        const message = document.getElementById('suppMessage').value.trim();

        if (!name || !email || !message) {
            alert('Please complete all required fields.');
            return;
        }

        const supportEmail = "support@fiao-app.com";
        const emailSubject = encodeURIComponent(`[Support Ticket] ${subject} - ${name}`);
        const emailBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);

        window.location.href = `mailto:${supportEmail}?subject=${emailSubject}&body=${emailBody}`;
        alert('Support email client prepared. Confirm sending from your mail application.');
        supportContactForm.reset();
    });

    // 3. Widget FIA'O AI Assistant
    const aiChatToggleBtn = document.getElementById('aiChatToggleBtn');
    const aiOpenBannerBtn = document.getElementById('openAiChatBannerBtn');
    const aiChatWindow = document.getElementById('aiChatWindow');
    const aiCloseChatBtn = document.getElementById('aiCloseChatBtn');
    const aiResetChatBtn = document.getElementById('aiResetChatBtn');
    const aiChatInput = document.getElementById('aiChatInput');
    const aiChatSendBtn = document.getElementById('aiChatSendBtn');
    const aiChatMessages = document.getElementById('aiChatMessages');

    function toggleAiChat() {
        aiChatWindow.classList.toggle('active');
        if (aiChatWindow.classList.contains('active')) {
            aiChatInput.focus();
        }
    }

    aiChatToggleBtn.addEventListener('click', toggleAiChat);
    if (aiOpenBannerBtn) aiOpenBannerBtn.addEventListener('click', toggleAiChat);
    aiCloseChatBtn.addEventListener('click', () => aiChatWindow.classList.remove('active'));

    aiResetChatBtn.addEventListener('click', () => {
        aiChatMessages.innerHTML = `
            <div class="ai-msg bot">
                <p>Conversation reset. How can I assist you with FIA’O?</p>
            </div>
        `;
    });

    function handleUserMessage() {
        const text = aiChatInput.value.trim();
        if (!text) return;

        const userDiv = document.createElement('div');
        userDiv.className = 'ai-msg user';
        userDiv.textContent = text;
        aiChatMessages.appendChild(userDiv);
        aiChatInput.value = '';
        aiChatMessages.scrollTop = aiChatMessages.scrollHeight;

        setTimeout(() => {
            const botDiv = document.createElement('div');
            botDiv.className = 'ai-msg bot';
            botDiv.innerHTML = `<p><em>[Backend AI integration pending]:</em> Thank you for your question. Once connected to a secure AI backend model, I will answer questions about your store credits, customers, and reports directly.</p>`;
            aiChatMessages.appendChild(botDiv);
            aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
        }, 600);
    }

    aiChatSendBtn.addEventListener('click', handleUserMessage);
    aiChatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleUserMessage();
    });

    // 4. Traducción y Tema Oscuro
    const langBtn = document.getElementById('lang-btn');
    let currentLang = localStorage.getItem('fia_lang') || 'EN';

    function setLanguage(lang) {
        currentLang = lang;
        if (langBtn) langBtn.textContent = lang === 'EN' ? 'ES' : 'EN';
        localStorage.setItem('fia_lang', lang);

        document.querySelectorAll('[data-en]').forEach(el => {
            const translation = el.getAttribute(`data-${lang.toLowerCase()}`);
            if (translation) {
                if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
                    el.placeholder = translation;
                } else {
                    el.textContent = translation;
                }
            }
        });
    }
    setLanguage(currentLang);

    if (langBtn) {
        langBtn.addEventListener('click', () => setLanguage(currentLang === 'EN' ? 'ES' : 'EN'));
    }

    const themeBtn = document.getElementById('theme-btn');
    if (localStorage.getItem('fia_theme') === 'dark') {
        document.body.classList.add('dark-theme');
    }
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            localStorage.setItem('fia_theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
        });
    }

    const profileToggle = document.getElementById('profileToggle');
    const profileDropdown = document.getElementById('profileDropdown');
    profileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdown.classList.toggle('active');
    });
    window.addEventListener('click', () => profileDropdown.classList.remove('active'));
});
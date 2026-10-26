document.addEventListener('DOMContentLoaded', () => {
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            togglePassword.classList.toggle('fa-eye');
            togglePassword.classList.toggle('fa-eye-slash');
        });
    }

    const forgotLink = document.getElementById('forgot-link');
    const forgotModal = document.getElementById('forgot-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const forgotForm = document.getElementById('forgot-form');

    if (forgotLink && forgotModal) {
        forgotLink.addEventListener('click', (e) => {
            e.preventDefault();
            forgotModal.classList.add('active');
        });
    }

    if (closeModalBtn && forgotModal) {
        closeModalBtn.addEventListener('click', () => {
            forgotModal.classList.remove('active');
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === forgotModal) {
            forgotModal.classList.remove('active');
        }
    });

    if (forgotForm) {
        forgotForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const resetEmail = document.getElementById('reset-email').value;
            alert(`Verification code sent to ${resetEmail} (Firebase simulation).`);
            forgotModal.classList.remove('active');
            forgotForm.reset();
        });
    }

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
        langBtn.addEventListener('click', () => {
            const nextLang = currentLang === 'EN' ? 'ES' : 'EN';
            setLanguage(nextLang);
        });
    }

    const themeBtn = document.getElementById('theme-btn');
    const currentTheme = localStorage.getItem('fia_theme') || 'light';

    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            localStorage.setItem('fia_theme', isDark ? 'dark' : 'light');
        });
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('email').value.trim();
            
            let derivedName = emailInput.split('@')[0];
            derivedName = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);
            
            // Marcamos que es LOGIN (usuario recurrente -> Welcome Back)
            localStorage.setItem('fia_is_new_user', 'false'); 
            localStorage.setItem('fia_user_name', derivedName); 
            
            window.location.href = 'customer-dashboard.html'; 
        });
    }
});
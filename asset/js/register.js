document.addEventListener('DOMContentLoaded', () => {
    const typeOwner = document.getElementById('type-owner');
    const typeCustomer = document.getElementById('type-customer');
    const businessNameGroup = document.getElementById('business-name-group');
    const businessNameInput = document.getElementById('businessname');

    if (typeOwner && typeCustomer && businessNameGroup) {
        typeOwner.addEventListener('click', () => {
            typeOwner.classList.add('active');
            typeCustomer.classList.remove('active');
            businessNameGroup.style.display = 'block';
            businessNameInput.setAttribute('required', 'true');
        });

        typeCustomer.addEventListener('click', () => {
            typeCustomer.classList.add('active');
            typeOwner.classList.remove('active');
            businessNameGroup.style.display = 'none';
            businessNameInput.removeAttribute('required');
            businessNameInput.value = ''; 
        });
    }

    function setupTogglePassword(toggleId, inputId) {
        const toggleBtn = document.getElementById(toggleId);
        const inputField = document.getElementById(inputId);
        if (toggleBtn && inputField) {
            toggleBtn.addEventListener('click', () => {
                const type = inputField.getAttribute('type') === 'password' ? 'text' : 'password';
                inputField.setAttribute('type', type);
                toggleBtn.classList.toggle('fa-eye');
                toggleBtn.classList.toggle('fa-eye-slash');
            });
        }
    }

    setupTogglePassword('togglePassword', 'password');
    setupTogglePassword('toggleConfirmPassword', 'confirmpassword');

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

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const isOwner = typeOwner.classList.contains('active');
            const fullName = document.getElementById('fullname').value.trim();
            
            // Guardamos el nombre tal cual lo escribiste y marcamos que es usuario NUEVO
            localStorage.setItem('fia_user_name', fullName);
            localStorage.setItem('fia_is_new_user', 'true'); 
            
            if (isOwner) {
                window.location.href = 'owner-dashboard.html';
            } else {
                window.location.href = 'customer-dashboard.html';
            }
        });
    }
});
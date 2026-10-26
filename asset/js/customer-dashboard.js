document.addEventListener('DOMContentLoaded', () => {
    const profileToggle = document.getElementById('profileToggle');
    const profileDropdown = document.getElementById('profileDropdown');

    if (profileToggle && profileDropdown) {
        profileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown.classList.toggle('active');
        });
        window.addEventListener('click', () => {
            if (profileDropdown.classList.contains('active')) {
                profileDropdown.classList.remove('active');
            }
        });
    }

    const userNamePlaceholder = document.getElementById('userNamePlaceholder');
    const welcomeHeading = document.getElementById('welcomeHeading');
    const userInitialsSpan = document.getElementById('userInitials');
    
    // Leemos estrictamente lo que se guardó en el registro o login
    const savedUserName = localStorage.getItem('fia_user_name') || 'User';
    const isNewUser = localStorage.getItem('fia_is_new_user') === 'true';

    if (userNamePlaceholder) {
        userNamePlaceholder.textContent = savedUserName;
    }

    // Generar iniciales automáticas (Ej: "Hola Roth" -> "HR")
    if (userInitialsSpan) {
        const nameParts = savedUserName.trim().split(/\s+/);
        let initials = '';
        if (nameParts.length >= 2) {
            initials = (nameParts[0][0] + nameParts[1][0]).toUpperCase();
        } else if (nameParts.length === 1 && nameParts[0].length > 0) {
            initials = nameParts[0].substring(0, 2).toUpperCase();
        } else {
            initials = 'US';
        }
        userInitialsSpan.textContent = initials;
    }

    function updateWelcomeGreeting(lang) {
        if (!welcomeHeading) return;
        if (lang === 'ES') {
            const prefix = isNewUser ? '¡Bienvenida' : '¡Bienvenido de nuevo';
            welcomeHeading.innerHTML = `${prefix}, <span id="userNamePlaceholder">${savedUserName}</span>!`;
        } else {
            const prefix = isNewUser ? 'Welcome' : 'Welcome back';
            welcomeHeading.innerHTML = `${prefix}, <span id="userNamePlaceholder">${savedUserName}</span>!`;
        }
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
                el.textContent = translation;
            }
        });

        updateWelcomeGreeting(lang);
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
});
document.addEventListener('DOMContentLoaded', () => {
    // 1. Selector de Tipo de Cuenta (Business Owner / Customer)
    const typeOwner = document.getElementById('type-owner');
    const typeCustomer = document.getElementById('type-customer');
    const businessGroup = document.getElementById('business-name-group');

    if (typeOwner && typeCustomer) {
        typeOwner.addEventListener('click', () => {
            typeOwner.classList.add('active');
            typeCustomer.classList.remove('active');
            if (businessGroup) businessGroup.style.display = 'block';
        });

        typeCustomer.addEventListener('click', () => {
            typeCustomer.classList.add('active');
            typeOwner.classList.remove('active');
            if (businessGroup) businessGroup.style.display = 'none';
        });
    }

    // 2. Funcionalidad para mostrar/ocultar contraseña (los ojitos)
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

    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const confirmPasswordInput = document.getElementById('confirmpassword');

    if (toggleConfirmPassword && confirmPasswordInput) {
        toggleConfirmPassword.addEventListener('click', () => {
            const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            confirmPasswordInput.setAttribute('type', type);
            toggleConfirmPassword.classList.toggle('fa-eye');
            toggleConfirmPassword.classList.toggle('fa-eye-slash');
        });
    }

    // 3. CAPTURAR REGISTRO, VALIDAR Y REDIRIGIR SEGÚN EL TIPO SELECCIONADO
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Evita que la página se recargue

            const fullName = document.getElementById('fullname').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmpassword').value;
            const businessNameInput = document.getElementById('businessname');
            const businessName = businessNameInput ? businessNameInput.value.trim() : '';

            // Validar que las contraseñas coincidan
            if (password !== confirmPassword) {
                alert('Passwords do not match. Please check them.');
                return;
            }

            // Identificar explícitamente qué opción está activa en pantalla
            const isOwnerActive = typeOwner ? typeOwner.classList.contains('active') : true;

            // Guardar los datos en el localStorage para que el Perfil los lea
            localStorage.setItem('fiao_profile_name', fullName);
            localStorage.setItem('fiao_profile_email', email);
            localStorage.setItem('fiao_profile_phone', phone);
            localStorage.setItem('fiao_profile_store', isOwnerActive ? (businessName || 'Mi Negocio') : 'Customer Account');
            localStorage.setItem('fiao_account_type', isOwnerActive ? 'owner' : 'customer');

            // Redirección inteligente y exacta
            if (isOwnerActive) {
                window.location.href = 'owner-dashboard.html'; // Panel del Dueño
            } else {
                window.location.href = 'index.html'; // O tu vista de cliente si tienes otra página específica
            }
        });
    }

    // 4. Idioma y Tema Oscuro
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
});
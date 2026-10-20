/* ========================================= */
/* LÓGICA GLOBAL - FIA'O                     */
/* ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initLanguage();
    checkUserSession();
});

/* 1. MODO OSCURO / CLARO */
function initTheme() {
    const themeBtn = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('fiao_theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        if (themeBtn) themeBtn.textContent = '☀️';
    }
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            themeBtn.textContent = isDark ? '☀️' : '🌙';
            localStorage.setItem('fiao_theme', isDark ? 'dark' : 'light');
        });
    }
}

/* 2. TRADUCTOR INGLÉS / ESPAÑOL */
function initLanguage() {
    const langBtn = document.getElementById('langToggle');
    let currentLang = localStorage.getItem('fiao_lang') || 'en';
    updateLanguageTexts(currentLang);

    if (langBtn) {
        langBtn.addEventListener('click', () => {
            currentLang = currentLang === 'en' ? 'es' : 'en';
            localStorage.setItem('fiao_lang', currentLang);
            updateLanguageTexts(currentLang);
        });
    }
}

function updateLanguageTexts(lang) {
    const langLabel = document.getElementById('langLabel');
    if (langLabel) langLabel.textContent = lang === 'en' ? 'ES' : 'EN';

    document.querySelectorAll('[data-en]').forEach(el => {
        el.textContent = el.getAttribute(`data-${lang}`);
    });
}

/* 3. CONTROL DE SESIÓN Y PERFIL EN NAVBAR */
function checkUserSession() {
    const userArea = document.getElementById('userNavArea');
    if (!userArea) return;

    const loggedUser = JSON.parse(localStorage.getItem('fiao_user'));

    if (loggedUser) {
        const initials = loggedUser.name ? loggedUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'JP';
        userArea.innerHTML = `
            <div class="profile-circle-container">
                <div class="profile-avatar" onclick="toggleDropdown()">${initials}</div>
                <div class="profile-dropdown" id="profileDropdown">
                    <a href="#">👤 <span data-en="Profile" data-es="Perfil">Profile</span></a>
                    <a href="#" onclick="logout()">🚪 <span data-en="Log Out" data-es="Cerrar Sesión">Log Out</span></a>
                </div>
            </div>
        `;
    } else {
        // Si no está logueado, no muestra nada en la barra superior
        userArea.innerHTML = '';
    }
}

function toggleDropdown() {
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown) dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

function logout() {
    localStorage.removeItem('fiao_user');
    window.location.reload();
}
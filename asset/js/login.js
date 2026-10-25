document.addEventListener('DOMContentLoaded', function() {
    setupCleanThemeToggle();
});

// Configuración del botón de tema limpio sincronizado con idioma
function setupCleanThemeToggle() {
    const themeBtn = document.getElementById('themeToggle');
    if (!themeBtn) return;

    const updateThemeButtonText = () => {
        const currentLang = localStorage.getItem('fiao_lang') || 'es';
        themeBtn.textContent = currentLang === 'es' ? 'Tema' : 'Theme';
    };

    updateThemeButtonText();

    themeBtn.onclick = function() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('fiao_theme', isDark ? 'dark' : 'light');
        updateThemeButtonText();
    };

    const langBtn = document.getElementById('langToggle');
    if (langBtn) {
        langBtn.addEventListener('click', function() {
            setTimeout(updateThemeButtonText, 50);
        });
    }
}

function toggleLoginPassView() {
    const passInput = document.getElementById('loginPassword');
    if (passInput) {
        passInput.type = passInput.type === 'password' ? 'text' : 'password';
    }
}

function showRecoveryModal(e) {
    e.preventDefault();
    const currentLang = localStorage.getItem('fiao_lang') || 'es';
    alert(currentLang === 'es' ? 'Se ha enviado un enlace de recuperación a tu correo.' : 'A recovery link has been sent to your email.');
}

function executeLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();

    const userSession = {
        name: email.includes('@') ? email.split('@')[0] : email,
        email: email,
        role: "owner"
    };

    localStorage.setItem('fiao_user', JSON.stringify(userSession));
    window.location.href = "dashboard.html";
}

/* Atajo para arroba @ en teclados internacionales */
const emailInput = document.getElementById('loginEmail');
if (emailInput) {
    emailInput.addEventListener('keydown', function(e) {
        if ((e.ctrlKey && e.altKey && (e.key === 'q' || e.key === 'Q')) || e.key === 'Dead') {
            e.preventDefault();
            const start = this.selectionStart;
            const end = this.selectionEnd;
            this.value = this.value.substring(0, start) + '@' + this.value.substring(end);
            this.selectionStart = this.selectionEnd = start + 1;
        }
    });
}
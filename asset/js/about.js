document.addEventListener('DOMContentLoaded', function() {
    if (window.self !== window.top) {
        const navbar = document.querySelector('.navbar');
        if (navbar) navbar.style.display = 'none';
    }

    // Cargar idioma y tema guardados al iniciar
    const savedLang = localStorage.getItem('fiao_lang') || 'en';
    applyCurrentLanguage(savedLang);

    if (localStorage.getItem('fiao_theme') === 'dark') {
        document.body.classList.add('dark-mode');
    }
    
    setupMobileCardToggle();
    autoResizeIframe();
});

// ESCUCHAR COMUNICACIÓN EN VIVO DESDE EL INDEX (IDIOMA Y TEMA)
window.addEventListener('message', function(e) {
    if (e.data) {
        if (e.data.fiaoLang) {
            localStorage.setItem('fiao_lang', e.data.fiaoLang);
            applyCurrentLanguage(e.data.fiaoLang);
        }
        if (e.data.fiaoTheme) {
            localStorage.setItem('fiao_theme', e.data.fiaoTheme);
            if (e.data.fiaoTheme === 'dark') {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
        }
    }
});

function applyCurrentLanguage(lang) {
    const currentLang = lang || localStorage.getItem('fiao_lang') || 'en';
    document.querySelectorAll('[data-en]').forEach(el => {
        if (el.hasAttribute('data-es') && el.hasAttribute('data-en')) {
            el.innerHTML = currentLang === 'es' ? el.getAttribute('data-es') : el.getAttribute('data-en');
        } else {
            el.textContent = currentLang === 'es' ? el.getAttribute('data-es') : el.getAttribute('data-en');
        }
    });
}

function setupMobileCardToggle() {
    const interactiveCards = document.querySelectorAll('.creative-mv-card, .benefit-interactive-card');
    
    interactiveCards.forEach(card => {
        card.addEventListener('click', function(e) {
            interactiveCards.forEach(c => {
                if (c !== card) c.classList.remove('touch-active');
            });
            card.classList.toggle('touch-active');
            setTimeout(autoResizeIframe, 300);
        });
    });
}

function autoResizeIframe() {
    if (window.self !== window.top) {
        const height = document.body.scrollHeight;
        window.parent.postMessage({ fiaoHeight: height }, '*');
    }
}
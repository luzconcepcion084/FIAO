document.addEventListener('DOMContentLoaded', function() {
    // Si la página se está ejecutando dentro del iframe del index.html, ocultamos la barra repetida
    if (window.self !== window.top) {
        const navbar = document.querySelector('.navbar');
        if (navbar) navbar.style.display = 'none';
    }

    if (!localStorage.getItem('fiao_lang')) {
        localStorage.setItem('fiao_lang', 'en');
    }
    
    applyCurrentLanguage();
});

function applyCurrentLanguage() {
    const currentLang = localStorage.getItem('fiao_lang') || 'en';
    document.querySelectorAll('[data-en]').forEach(el => {
        if (el.hasAttribute('data-es') && el.hasAttribute('data-en')) {
            el.innerHTML = currentLang === 'es' ? el.getAttribute('data-es') : el.getAttribute('data-en');
        } else {
            el.textContent = currentLang === 'es' ? el.getAttribute('data-es') : el.getAttribute('data-en');
        }
    });
}
const carouselData = [
    {
        image: "asset/img/movil.png",
        en: "Digitize customer, debt, and payment management for convenience stores in Panama.",
        es: "Digitaliza la gestión de clientes, deudas y pagos para minisupermercados en Panamá."
    },
    {
        image: "asset/img/movil.png",
        en: "Track daily collections and manage active credit balances safely and fast.",
        es: "Lleva el control de cobros diarios y administra saldos de crédito activos de forma segura y rápida."
    },
    {
        image: "asset/img/movil.png",
        en: "Transparent statements and direct digital payment gateways for all your customers.",
        es: "Estados de cuenta transparentes y pasarelas de pago digital directas para todos tus clientes."
    }
];

let currentSlideIndex = 0;
let slideInterval;

document.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem('fiao_lang')) {
        localStorage.setItem('fiao_lang', 'en');
    }
    
    initCarousel();
    setupLangAndThemeToggle();
    setupSmoothScrollAnchors();
});

function initCarousel() {
    showSlide(currentSlideIndex);
    slideInterval = setInterval(nextSlide, 5000);
}

function showSlide(index) {
    const subtitleEl = document.getElementById('carouselSubtitle');
    const imageEl = document.getElementById('carouselImage');
    const dots = document.querySelectorAll('.dot');

    if (!subtitleEl || !imageEl) return;

    currentSlideIndex = (index + carouselData.length) % carouselData.length;
    const currentLang = localStorage.getItem('fiao_lang') || 'en';

    imageEl.style.opacity = '0.3';
    setTimeout(() => {
        imageEl.src = carouselData[currentSlideIndex].image;
        imageEl.style.opacity = '1';
    }, 200);

    subtitleEl.setAttribute('data-en', carouselData[currentSlideIndex].en);
    subtitleEl.setAttribute('data-es', carouselData[currentSlideIndex].es);
    subtitleEl.textContent = currentLang === 'es' ? carouselData[currentSlideIndex].es : carouselData[currentSlideIndex].en;

    dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentSlideIndex);
    });
}

function nextSlide() {
    showSlide(currentSlideIndex + 1);
}

function currentSlide(index) {
    clearInterval(slideInterval);
    showSlide(index);
    slideInterval = setInterval(nextSlide, 5000);
}

/* Permite que al tocar 'About Us' baje suavemente hacia el iframe */
function setupSmoothScrollAnchors() {
    document.querySelectorAll('.navbar a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

function setupLangAndThemeToggle() {
    const langBtn = document.getElementById('langToggle');
    const langLabel = document.getElementById('langLabel');
    const currentLang = localStorage.getItem('fiao_lang') || 'en';

    if (currentLang === 'es') {
        applyTranslation('es');
    }

    if (langLabel) {
        langLabel.textContent = currentLang === 'es' ? 'EN' : 'ES';
    }

    if (langBtn) {
        langBtn.addEventListener('click', function() {
            const activeLang = localStorage.getItem('fiao_lang') || 'en';
            const newLang = activeLang === 'en' ? 'es' : 'en';
            localStorage.setItem('fiao_lang', newLang);

            if (langLabel) {
                langLabel.textContent = newLang === 'en' ? 'ES' : 'EN';
            }

            applyTranslation(newLang);
            showSlide(currentSlideIndex);
        });
    }

    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        const updateThemeText = () => {
            const activeLang = localStorage.getItem('fiao_lang') || 'en';
            themeBtn.textContent = activeLang === 'es' ? 'Tema' : 'Theme';
        };

        updateThemeText();

        themeBtn.onclick = function() {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('fiao_theme', isDark ? 'dark' : 'light');
            updateThemeText();
        };

        if (langBtn) {
            langBtn.addEventListener('click', () => setTimeout(updateThemeText, 50));
        }
    }
}

function applyTranslation(lang) {
    document.querySelectorAll('[data-en]').forEach(el => {
        if (el.hasAttribute('data-es') && el.hasAttribute('data-en')) {
            el.innerHTML = lang === 'es' ? el.getAttribute('data-es') : el.getAttribute('data-en');
        } else {
            el.textContent = lang === 'es' ? el.getAttribute('data-es') : el.getAttribute('data-en');
        }
    });
}
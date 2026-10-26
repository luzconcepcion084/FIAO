const carouselData = [
    {
        image: "asset/img/slide1.png",
        en: "Digitize customer, debt, and payment management for convenience stores in Panama.",
        es: "Digitaliza la gestión de clientes, deudas y pagos para minisupermercados en Panamá."
    },
    {
        image: "asset/img/slide2.png",
        en: "Track daily collections and manage active credit balances safely and fast.",
        es: "Lleva el control de cobros diarios y administra saldos de crédito activos de forma segura y rápida."
    },
    {
        image: "asset/img/slide3.png",
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

    if (localStorage.getItem('fiao_theme') === 'dark') {
        document.body.classList.add('dark-mode');
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

            // AVISAR AL IFRAME (ABOUT) DEL CAMBIO DE IDIOMA
            const iframe = document.getElementById('aboutFrame');
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage({ fiaoLang: newLang }, '*');
            }
        });
    }

    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        const updateThemeText = () => {
            const activeLang = localStorage.getItem('fiao_lang') || 'en';
            const isDark = document.body.classList.contains('dark-mode');
            themeBtn.textContent = activeLang === 'es' ? (isDark ? 'Claro' : 'Tema') : (isDark ? 'Light' : 'Theme');
        };

        updateThemeText();

        themeBtn.onclick = function() {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('fiao_theme', isDark ? 'dark' : 'light');
            updateThemeText();

            // AVISAR AL IFRAME (ABOUT) DEL CAMBIO DE TEMA
            const iframe = document.getElementById('aboutFrame');
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage({ fiaoTheme: isDark ? 'dark' : 'light' }, '*');
            }
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

window.addEventListener('message', function(e) {
    if (e.data && e.data.fiaoHeight) {
        const iframe = document.getElementById('aboutFrame');
        if (iframe) {
            iframe.style.height = e.data.fiaoHeight + 'px';
        }
    }
});
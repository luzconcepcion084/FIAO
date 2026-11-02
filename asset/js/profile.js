document.addEventListener('DOMContentLoaded', () => {
    // 1. Cargar datos guardados si existen en localStorage
    const savedName = localStorage.getItem('fiao_profile_name') || "Luz Concepción";
    const savedEmail = localStorage.getItem('fiao_profile_email') || "luz.concepcion@fiao-app.com";
    const savedPhone = localStorage.getItem('fiao_profile_phone') || "+507 6000-0000";
    const savedStore = localStorage.getItem('fiao_profile_store') || "Minisúper El Ahorro";
    const savedPhoto = localStorage.getItem('fiao_profile_photo');

    document.getElementById('profFullName').value = savedName;
    document.getElementById('profEmail').value = savedEmail;
    document.getElementById('profPhone').value = savedPhone;
    document.getElementById('profStoreName').value = savedStore;

    document.getElementById('profileDisplayName').textContent = savedName;
    document.getElementById('profileStoreNameText').textContent = savedStore;

    // Calcular iniciales
    function updateInitials(name) {
        const parts = name.trim().split(' ');
        let initials = parts[0] ? parts[0][0] : 'L';
        if (parts.length > 1) {
            initials += parts[1][0];
        }
        initials = initials.toUpperCase();
        document.getElementById('userInitials').textContent = initials;
        document.getElementById('largeInitials').textContent = initials;
    }
    updateInitials(savedName);

    // Manejo de la foto de perfil
    const profilePhotoInput = document.getElementById('profilePhotoInput');
    const uploadPhotoBtn = document.getElementById('uploadPhotoBtn');
    const removePhotoBtn = document.getElementById('removePhotoBtn');
    const profileImagePreview = document.getElementById('profileImagePreview');
    const largeInitials = document.getElementById('largeInitials');
    const userInitialsNav = document.getElementById('userInitials');

    function applyPhoto(dataUrl) {
        if (dataUrl) {
            profileImagePreview.src = dataUrl;
            profileImagePreview.style.display = 'block';
            largeInitials.style.display = 'none';

            // Actualizar también en la barra de navegación superior
            userInitialsNav.innerHTML = `<img src="${dataUrl}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`;
            removePhotoBtn.style.display = 'inline-block';
        } else {
            profileImagePreview.src = '';
            profileImagePreview.style.display = 'none';
            largeInitials.style.display = 'block';
            updateInitials(document.getElementById('profFullName').value);
            removePhotoBtn.style.display = 'none';
        }
    }

    if (savedPhoto) {
        applyPhoto(savedPhoto);
    }

    uploadPhotoBtn.addEventListener('click', () => {
        profilePhotoInput.click();
    });

    profilePhotoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const base64String = event.target.result;
                localStorage.setItem('fiao_profile_photo', base64String);
                applyPhoto(base64String);
            };
            reader.readAsDataURL(file);
        }
    });

    removePhotoBtn.addEventListener('click', () => {
        localStorage.removeItem('fiao_profile_photo');
        applyPhoto(null);
    });

    // 2. Guardar cambios del perfil
    const profileUpdateForm = document.getElementById('profileUpdateForm');
    profileUpdateForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newName = document.getElementById('profFullName').value.trim();
        const newEmail = document.getElementById('profEmail').value.trim();
        const newPhone = document.getElementById('profPhone').value.trim();
        const newStore = document.getElementById('profStoreName').value.trim();

        localStorage.setItem('fiao_profile_name', newName);
        localStorage.setItem('fiao_profile_email', newEmail);
        localStorage.setItem('fiao_profile_phone', newPhone);
        localStorage.setItem('fiao_profile_store', newStore);
        localStorage.setItem('fia_user_name', newName);

        document.getElementById('profileDisplayName').textContent = newName;
        document.getElementById('profileStoreNameText').textContent = newStore;
        
        if (!localStorage.getItem('fiao_profile_photo')) {
            updateInitials(newName);
        }

        alert('Profile successfully updated!');
    });

    // 3. Sistema de Traducción y Tema Oscuro
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

    const profileToggle = document.getElementById('profileToggle');
    const profileDropdown = document.getElementById('profileDropdown');
    profileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdown.classList.toggle('active');
    });
    window.addEventListener('click', () => profileDropdown.classList.remove('active'));
});
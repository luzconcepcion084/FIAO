document.addEventListener('DOMContentLoaded', function() {
    loadProfileData();
});

function loadProfileData() {
    const fullName = localStorage.getItem('fiao_user_name') || 'Usuario';
    const email = localStorage.getItem('fiao_user_email') || 'correo@fiao.com';
    const phone = localStorage.getItem('fiao_user_phone') || '+507 0000-0000';
    const userType = localStorage.getItem('fiao_user_type') || 'owner';
    const businessName = localStorage.getItem('fiao_business_name') || fullName;

    // 1. Configurar el saludo de bienvenida con el nombre de la persona
    const welcomeTitle = document.getElementById('welcomeTitleDisplay') || document.getElementById('customerWelcomeTitle');
    if (welcomeTitle) {
        welcomeTitle.textContent = `Welcome back, ${fullName}!`;
    }

    // 2. Configurar la barra superior y el perfil según el rol
    if (userType === 'owner') {
        // Dueño: Arriba y en el perfil manda el nombre del negocio
        const storeNameEl = document.getElementById('storeNameDisplay');
        if (storeNameEl) storeNameEl.textContent = businessName;

        const headerNameEl = document.getElementById('profileHeaderName');
        if (headerNameEl) headerNameEl.textContent = businessName;

        const bizSub = document.getElementById('profileHeaderSub');
        if (bizSub) bizSub.textContent = `Dueño: ${fullName}`;

        const bizInput = document.getElementById('profileBusinessName');
        if (bizInput) bizInput.value = businessName;

        // Iniciales basadas en el negocio
        const initials = businessName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        const initialsEl = document.getElementById('storeInitials') || document.getElementById('profileHeaderInitials');
        if (initialsEl) initialsEl.textContent = initials;
        const headerInitials = document.getElementById('profileHeaderInitials');
        if (headerInitials) headerInitials.textContent = initials;

    } else {
        // Cliente: Manda el nombre de la persona en todos lados
        const customerNameEl = document.getElementById('customerNameDisplay');
        if (customerNameEl) customerNameEl.textContent = fullName;

        const headerNameEl = document.getElementById('profileHeaderName');
        if (headerNameEl) headerNameEl.textContent = fullName;

        const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        const initialsEl = document.getElementById('customerInitials');
        if (initialsEl) initialsEl.textContent = initials;
        const headerInitials = document.getElementById('profileHeaderInitials');
        if (headerInitials) headerInitials.textContent = initials;
    }

    // 3. Rellenar campos personales comunes (Nombre, Correo, Teléfono)
    const fullNameInput = document.getElementById('profileFullName');
    if (fullNameInput) fullNameInput.value = fullName;

    const emailInput = document.getElementById('profileEmail');
    if (emailInput) emailInput.value = email;

    const phoneInput = document.getElementById('profilePhone');
    if (phoneInput) phoneInput.value = phone;
}

function switchDashboardView(viewName, event) {
    if (event) event.preventDefault();
    const overview = document.getElementById('overviewSection');
    const profile = document.getElementById('profileSection');
    
    if (viewName === 'profile') {
        if (overview) overview.style.display = 'none';
        if (profile) profile.style.display = 'block';
    } else {
        if (profile) profile.style.display = 'none';
        if (overview) overview.style.display = 'block';
    }
    const menu = document.getElementById('profileDropdown');
    if (menu) menu.classList.remove('show');
}

function toggleProfileDropdown() {
    const menu = document.getElementById('profileDropdown');
    if (menu) menu.classList.toggle('show');
}

function toggleEditMode() {
    const nameInput = document.getElementById('profileFullName');
    const phoneInput = document.getElementById('profilePhone');
    const bizInput = document.getElementById('profileBusinessName');
    const actions = document.getElementById('personalEditActions');
    const btn = document.getElementById('editProfileBtn');

    if (nameInput) nameInput.disabled = false;
    if (phoneInput) phoneInput.disabled = false;
    if (bizInput) bizInput.disabled = false;
    if (actions) actions.style.display = 'flex';
    if (btn) btn.style.display = 'none';
}

function cancelEditMode() {
    loadProfileData();
    const nameInput = document.getElementById('profileFullName');
    const phoneInput = document.getElementById('profilePhone');
    const bizInput = document.getElementById('profileBusinessName');
    
    if (nameInput) nameInput.disabled = true;
    if (phoneInput) phoneInput.disabled = true;
    if (bizInput) bizInput.disabled = true;
    
    const actions = document.getElementById('personalEditActions');
    const btn = document.getElementById('editProfileBtn');
    if (actions) actions.style.display = 'none';
    if (btn) btn.style.display = 'block';
}

function savePersonalChanges(event) {
    event.preventDefault();
    const nameInput = document.getElementById('profileFullName');
    const phoneInput = document.getElementById('profilePhone');
    const bizInput = document.getElementById('profileBusinessName');

    if (nameInput && nameInput.value.trim()) {
        localStorage.setItem('fiao_user_name', nameInput.value.trim());
    }
    if (phoneInput && phoneInput.value.trim()) {
        localStorage.setItem('fiao_user_phone', phoneInput.value.trim());
    }
    if (bizInput && bizInput.value.trim()) {
        localStorage.setItem('fiao_business_name', bizInput.value.trim());
    }

    loadProfileData();
    cancelEditMode();
    alert('¡Cambios guardados con éxito!');
}

function previewAvatar(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const container = document.getElementById('avatarPreviewContainer');
            if (container) {
                container.style.backgroundImage = `url(${e.target.result})`;
                container.style.backgroundSize = 'cover';
                container.style.backgroundPosition = 'center';
            }
            const initEl = document.getElementById('profileHeaderInitials');
            if (initEl) initEl.style.display = 'none';
        }
        reader.readAsDataURL(file);
    }
}

function openPasswordModal() { 
    const modal = document.getElementById('passwordModal');
    if (modal) modal.style.display = 'flex'; 
}
function closePasswordModal() { 
    const modal = document.getElementById('passwordModal');
    if (modal) modal.style.display = 'none'; 
}
function submitPasswordChange() {
    alert('[Simulación] Contraseña actualizada correctamente.');
    closePasswordModal();
}

function openDeleteModal() { 
    const modal = document.getElementById('deleteModal');
    if (modal) modal.style.display = 'flex'; 
}
function closeDeleteModal() { 
    const modal = document.getElementById('deleteModal');
    if (modal) modal.style.display = 'none'; 
}
function confirmDeleteAccount() {
    alert('[Simulación] Solicitud de eliminación registrada.');
    closeDeleteModal();
}

function toggleThemeProfile() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('fiao_theme', isDark ? 'dark' : 'light');
}

function toggleNotifications(event) {
    console.log('Notificaciones:', event.target.checked);
}
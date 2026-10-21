/* ==========================================================================
   FIA'O - DASHBOARD LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
    // 1. Verificar si hay un usuario logueado en localStorage
    const sessionData = localStorage.getItem('fiao_user');
    
    if (!sessionData) {
        window.location.href = 'login.html';
        return;
    }

    const user = JSON.parse(sessionData);

    // 2. Cargar el componente de perfil en la barra superior
    renderUserProfileNav(user);

    // 3. Activar la vista del panel correspondiente al rol
    initRoleDashboard(user);

    // 4. Inicializar el filtro de búsqueda KYC (Cédula/Nombre)
    initKycSearch();
});

/**
 * Renderiza el botón circular con la inicial del usuario y su menú desplegable
 */
function renderUserProfileNav(user) {
    const userNavArea = document.getElementById('userNavArea');
    if (!userNavArea) return;

    const initial = (user.name || user.email || 'U').charAt(0).toUpperCase();
    const currentLang = localStorage.getItem('fiao_lang') || 'en';
    
    const roleLabel = user.role === 'owner' 
        ? (currentLang === 'es' ? 'Dueño de Negocio' : 'Store Owner')
        : (currentLang === 'es' ? 'Cliente' : 'Customer');

    userNavArea.innerHTML = `
        <div class="user-profile-menu">
            <button class="user-avatar-btn" id="userAvatarBtn" onclick="toggleProfileMenu(event)" title="Perfil de usuario">
                ${initial}
            </button>
            <div class="profile-dropdown" id="profileDropdown">
                <div class="dropdown-header">
                    <strong>${user.name || 'Usuario FIA\'O'}</strong>
                    <span>${roleLabel}</span>
                </div>
                <a href="profile.html" data-en="My Profile" data-es="Mi Perfil">👤 <span data-en="My Profile" data-es="Mi Perfil">${currentLang === 'es' ? 'Mi Perfil' : 'My Profile'}</span></a>
                <button onclick="logoutUser()" class="logout-btn">🚪 <span data-en="Log Out" data-es="Cerrar Sesión">${currentLang === 'es' ? 'Cerrar Sesión' : 'Log Out'}</span></button>
            </div>
        </div>
    `;
}

/**
 * Abre o cierra el menú desplegable del perfil de usuario
 */
function toggleProfileMenu(e) {
    e.stopPropagation();
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

// Cierra el desplegable si se hace clic en cualquier otro punto de la pantalla
document.addEventListener('click', function (e) {
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown && dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
    }
});

/**
 * Muestra la sección correspondiente al rol del usuario
 */
function initRoleDashboard(user) {
    const ownerView = document.getElementById('ownerDashboardView');
    const clientView = document.getElementById('clientDashboardView');
    const ownerTitle = document.getElementById('ownerWelcomeTitle');
    const clientTitle = document.getElementById('clientWelcomeTitle');

    if (user.role === 'owner') {
        if (ownerView) ownerView.style.display = 'block';
        if (clientView) clientView.style.display = 'none';
        if (ownerTitle) ownerTitle.innerText = `¡Hola, ${user.name || 'Tendero'}! 👋`;
    } else {
        if (clientView) clientView.style.display = 'block';
        if (ownerView) ownerView.style.display = 'none';
        if (clientTitle) clientTitle.innerText = `¡Hola, ${user.name || 'Cliente'}! 👋`;
    }
}

/**
 * Filtro en tiempo real para la tabla de clientes/cédulas (Buscador KYC)
 */
function initKycSearch() {
    const searchInput = document.getElementById('kycSearchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', function () {
        const filter = this.value.toLowerCase().trim();
        const tableRows = document.querySelectorAll('#ownerDebtsTableBody tr');

        tableRows.forEach(row => {
            const textContent = row.textContent.toLowerCase();
            if (textContent.includes(filter)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
}

/**
 * Destruye la sesión en localStorage y redirige a la pantalla de login
 */
function logoutUser() {
    localStorage.removeItem('fiao_user');
    window.location.href = 'login.html';
}

/**
 * Función provisional para gestionar cobros/abonos desde la tabla del Dueño
 */
function openPaymentModal(customerName, amount) {
    const currentLang = localStorage.getItem('fiao_lang') || 'en';
    const message = currentLang === 'es'
        ? `Abonar o registrar saldo para ${customerName}. Saldo pendiente: $${amount}`
        : `Register payment or charge for ${customerName}. Pending balance: $${amount}`;
    alert(message);
}

/**
 * Función provisional para la pasarela de pago digital en la vista del Cliente
 */
function openDigitalPaymentModal(storeName, amount) {
    const currentLang = localStorage.getItem('fiao_lang') || 'en';
    const message = currentLang === 'es'
        ? `Pasarela de pago digital (Yape / QR) para abonar a ${storeName}. Deuda actual: $${amount}`
        : `Digital payment gateway (Yape / QR) to pay ${storeName}. Current debt: $${amount}`;
    alert(message);
}
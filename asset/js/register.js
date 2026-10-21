/* ========================================= */
/* LÓGICA DE REGISTRO - FIA'O                */
/* ========================================= */

let selectedRegisterRole = 'owner';

function setRegisterRole(role) {
    selectedRegisterRole = role;
    const ownerBtn = document.getElementById('roleOwnerBtn');
    const clientBtn = document.getElementById('roleClientBtn');

    if (ownerBtn) ownerBtn.classList.toggle('active', role === 'owner');
    if (clientBtn) clientBtn.classList.toggle('active', role === 'client');

    const storeGroup = document.getElementById('storeGroup');
    if (storeGroup) {
        storeGroup.style.display = role === 'owner' ? 'block' : 'none';
    }
}

function toggleRegPassView() {
    const passInput = document.getElementById('regPassword');
    const slashLine = document.getElementById('eyeSlashLine');

    if (passInput) {
        if (passInput.type === 'password') {
            passInput.type = 'text';
            if (slashLine) slashLine.style.display = 'none';
        } else {
            passInput.type = 'password';
            if (slashLine) slashLine.style.display = 'block';
        }
    }
}

function executeRegister(e) {
    e.preventDefault();
    const fullName = document.getElementById('regFullName').value.trim();
    const idNumber = document.getElementById('regIdNumber').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const storeName = selectedRegisterRole === 'owner' ? document.getElementById('regStoreName').value.trim() : '';

    const userSession = {
        name: fullName,
        idNumber: idNumber,
        email: email,
        role: selectedRegisterRole,
        store: storeName
    };

    localStorage.setItem('fiao_user', JSON.stringify(userSession));

    // REDIRECCIÓN DIRECTA AL DASHBOARD
    window.location.href = "dashboard.html";
}
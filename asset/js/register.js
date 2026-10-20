/* ========================================= */
/* LÓGICA DE REGISTRO - FIA'O                */
/* ========================================= */

let selectedRegisterRole = 'owner';

function setRegisterRole(role) {
    selectedRegisterRole = role;
    document.getElementById('roleOwnerBtn').classList.toggle('active', role === 'owner');
    document.getElementById('roleClientBtn').classList.toggle('active', role === 'client');

    const storeGroup = document.getElementById('storeGroup');
    if (storeGroup) {
        storeGroup.style.display = role === 'owner' ? 'block' : 'none';
    }
}

function toggleRegPassView() {
    const passInput = document.getElementById('regPassword');
    const slashLine = document.getElementById('eyeSlashLine');

    if (passInput.type === 'password') {
        passInput.type = 'text';
        if (slashLine) slashLine.style.display = 'none'; // Oculta la línea diagonal (ojo abierto)
    } else {
        passInput.type = 'password';
        if (slashLine) slashLine.style.display = 'block'; // Muestra la línea diagonal (ojo tachado)
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

    const currentLang = localStorage.getItem('fiao_lang') || 'en';
    alert(currentLang === 'es' ? '¡Registro exitoso! Bienvenido a FIA\'O.' : 'Registration successful! Welcome to FIA\'O.');

    window.location.href = "index.html";
}
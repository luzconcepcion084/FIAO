/* ========================================= */
/* LÓGICA DE INICIO DE SESIÓN - FIA'O        */
/* ========================================= */

function togglePassView() {
    const passInput = document.getElementById('loginPassword');
    passInput.type = passInput.type === 'password' ? 'text' : 'password';
}

function showRecoveryModal(e) {
    e.preventDefault();
    const currentLang = localStorage.getItem('fiao_lang') || 'en';
    alert(currentLang === 'es' ? 'Se ha enviado un enlace de recuperación a tu correo.' : 'A recovery link has been sent to your email.');
}

function executeLogin(e) {
    e.preventDefault();
    const idNumber = document.getElementById('loginIdNumber').value.trim();
    const email = document.getElementById('loginEmail').value.trim();

    // Guardar sesión en el navegador con los datos ingresados
    const userSession = {
        idNumber: idNumber,
        name: "Juan Pérez", // Nombre simulado basado en el login
        email: email,
        role: "owner"
    };

    localStorage.setItem('fiao_user', JSON.stringify(userSession));

    // Redirigir al index para que la barra muestre automáticamente el círculo de perfil
    window.location.href = "index.html";
}
/* ========================================= */
/* LÓGICA DE INICIO DE SESIÓN - FIA'O        */
/* ========================================= */

function toggleLoginPassView() {
    const passInput = document.getElementById('loginPassword');
    const slashLine = document.getElementById('loginEyeSlashLine');

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

function showRecoveryModal(e) {
    e.preventDefault();
    const currentLang = localStorage.getItem('fiao_lang') || 'en';
    alert(currentLang === 'es' ? 'Se ha enviado un enlace de recuperación a tu correo.' : 'A recovery link has been sent to your email.');
}

function executeLogin(e) {
    e.preventDefault();
    const idNumber = document.getElementById('loginIdNumber').value.trim();
    const email = document.getElementById('loginEmail').value.trim();

    // Guardar la sesión en la memoria local
    const userSession = {
        idNumber: idNumber,
        name: email.split('@')[0], // Nombre temporal extraído del correo si no hay registro
        email: email,
        role: "owner" // Por defecto entra como tendero en login directo
    };

    localStorage.setItem('fiao_user', JSON.stringify(userSession));

    // REDIRECCIÓN DIRECTA AL DASHBOARD
    window.location.href = "dashboard.html";
}
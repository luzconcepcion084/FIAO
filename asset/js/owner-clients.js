document.addEventListener('DOMContentLoaded', () => {
    // --- 1. DATOS COMPARTIDOS CON CREDITS Y PRODUCTS ---
    if (!localStorage.getItem('fia_customers')) {
        const initialCustomers = [
            { id: 1, name: 'Carlos Pérez', phone: '+507 6111-2222', email: 'carlos@example.com', creditLimit: 30.00, currentDebt: 20.00, notes: 'Cliente frecuente', autoBlock: true },
            { id: 2, name: 'María Gómez', phone: '+507 6222-3333', email: 'maria@example.com', creditLimit: 50.00, currentDebt: 12.50, notes: 'Buena paga', autoBlock: true },
            { id: 3, name: 'Ramón Batista', phone: '+507 6333-4444', email: 'ramon@example.com', creditLimit: 25.00, currentDebt: 0.00, notes: '', autoBlock: false }
        ];
        localStorage.setItem('fia_customers', JSON.stringify(initialCustomers));
    }

    if (!localStorage.getItem('fia_credits')) {
        const initialCredits = [
            { id: 101, customerId: 1, customerName: 'Carlos Pérez', description: '1 Sack of Rice & Oil', originalAmount: 20.00, paidAmount: 0.00, balance: 20.00, date: '2026-10-20', dueDate: '2026-10-25', status: 'overdue' },
            { id: 102, customerId: 2, customerName: 'María Gómez', description: 'Canned goods & Soda pack', originalAmount: 32.50, paidAmount: 20.00, balance: 12.50, date: '2026-10-15', dueDate: '2026-11-30', status: 'partial' },
            { id: 103, customerId: 3, customerName: 'Ramón Batista', description: 'Cleaning supplies', originalAmount: 15.00, paidAmount: 15.00, balance: 0.00, date: '2026-10-10', dueDate: '2026-10-25', status: 'paid' }
        ];
        localStorage.setItem('fia_credits', JSON.stringify(initialCredits));
    }

    if (!localStorage.getItem('fia_reminders')) {
        localStorage.setItem('fia_reminders', JSON.stringify([]));
    }

    // --- 2. REFERENCIAS ---
    const statTotalClients = document.getElementById('statTotalClients');
    const statActiveCredits = document.getElementById('statActiveCredits');
    const statOutstandingDebt = document.getElementById('statOutstandingDebt');
    const statAtLimit = document.getElementById('statAtLimit');

    const clientSearch = document.getElementById('clientSearch');
    const clientFilterStatus = document.getElementById('clientFilterStatus');
    const clientSortSelect = document.getElementById('clientSortSelect');
    const clientsGridContainer = document.getElementById('clientsGridContainer');

    // Modales
    const clientModal = document.getElementById('clientModal');
    const openAddClientModal = document.getElementById('openAddClientModal');
    const closeClientModal = document.getElementById('closeClientModal');
    const clientForm = document.getElementById('clientForm');
    const clientModalTitle = document.getElementById('clientModalTitle');

    const clientDetailsModal = document.getElementById('clientDetailsModal');
    const closeDetailsModal = document.getElementById('closeDetailsModal');
    const clientDetailsContent = document.getElementById('clientDetailsContent');

    const reminderModal = document.getElementById('reminderModal');
    const closeReminderModal = document.getElementById('closeReminderModal');
    const channelWhatsAppBtn = document.getElementById('channelWhatsAppBtn');
    const channelEmailBtn = document.getElementById('channelEmailBtn');
    const reminderMessageText = document.getElementById('reminderMessageText');
    const reminderContactInfo = document.getElementById('reminderContactInfo');
    const cancelReminderBtn = document.getElementById('cancelReminderBtn');
    const confirmSendReminderBtn = document.getElementById('confirmSendReminderBtn');

    let activeReminderCustomerId = null;
    let activeReminderChannel = 'whatsapp'; // 'whatsapp' o 'email'

    // Inicializar perfil
    const savedName = localStorage.getItem('fia_user_name') || 'Business Owner';
    const userInitials = document.getElementById('userInitials');
    if (userInitials) {
        const parts = savedName.split(' ');
        userInitials.textContent = parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0].substring(0, 2).toUpperCase();
    }

    renderAll();

    function renderAll() {
        renderStats();
        renderClientsDirectory();
    }

    function getCustomers() { return JSON.parse(localStorage.getItem('fia_customers')) || []; }
    function setCustomers(c) { localStorage.setItem('fia_customers', JSON.stringify(c)); }
    function getCredits() { return JSON.parse(localStorage.getItem('fia_credits')) || []; }
    function getReminders() { return JSON.parse(localStorage.getItem('fia_reminders')) || []; }
    function setReminders(r) { localStorage.setItem('fia_reminders', JSON.stringify(r)); }

    // --- 3. ESTADÍSTICAS ---
    function renderStats() {
        const customers = getCustomers();
        const credits = getCredits();

        let totalClients = customers.length;
        let activeCredCount = 0;
        let totalDebt = 0;
        let atLimitCount = 0;

        customers.forEach(c => {
            if (c.currentDebt > 0) activeCredCount++;
            totalDebt += c.currentDebt;
            if (c.creditLimit > 0 && c.currentDebt >= c.creditLimit) {
                atLimitCount++;
            }
        });

        statTotalClients.textContent = totalClients;
        statActiveCredits.textContent = activeCredCount;
        statOutstandingDebt.textContent = `B/. ${totalDebt.toFixed(2)}`;
        statAtLimit.textContent = atLimitCount;
    }

    // --- 4. DIRECTORIO DE CLIENTES ---
    function renderClientsDirectory() {
        const customers = getCustomers();
        const credits = getCredits();
        clientsGridContainer.innerHTML = '';

        const search = clientSearch.value.toLowerCase();
        const statusFilter = clientFilterStatus.value;
        const sortVal = clientSortSelect.value;

        // Calcular deudas vencidas por cliente
        const now = new Date();
        const overdueCustomerIds = new Set();
        credits.forEach(cr => {
            if (cr.balance > 0 && cr.dueDate && new Date(cr.dueDate) < now) {
                overdueCustomerIds.add(cr.customerId);
            }
        });

        let filtered = customers.filter(c => {
            const matchesSearch = c.name.toLowerCase().includes(search) || c.phone.toLowerCase().includes(search) || (c.email && c.email.toLowerCase().includes(search));
            
            let matchesStatus = true;
            if (statusFilter === 'nodebt') matchesStatus = c.currentDebt === 0;
            else if (statusFilter === 'debt') matchesStatus = c.currentDebt > 0;
            else if (statusFilter === 'nearlimit') matchesStatus = c.creditLimit > 0 && (c.currentDebt / c.creditLimit) >= 0.8;
            else if (statusFilter === 'overdue') matchesStatus = overdueCustomerIds.has(c.id);

            return matchesSearch && matchesStatus;
        });

        // Ordenar
        filtered.sort((a, b) => {
            if (sortVal === 'name') return a.name.localeCompare(b.name);
            if (sortVal === 'debt-desc') return b.currentDebt - a.currentDebt;
            if (sortVal === 'debt-asc') return a.currentDebt - b.currentDebt;
            return 0;
        });

        if (filtered.length === 0) {
            clientsGridContainer.innerHTML = `<div style="grid-column: 1/-1; text-align:center; color:var(--subtext); padding:40px;">No clients found</div>`;
            return;
        }

        filtered.forEach(c => {
            const available = Math.max(0, c.creditLimit - c.currentDebt);
            let percent = c.creditLimit > 0 ? (c.currentDebt / c.creditLimit) * 100 : 0;
            let barColor = 'green';
            if (percent > 40 && percent <= 80) barColor = 'yellow';
            if (percent > 80) barColor = 'red';

            const initials = c.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            const hasOverdue = overdueCustomerIds.has(c.id);

            const card = document.createElement('div');
            card.className = 'client-card-modern';
            card.innerHTML = `
                <div class="client-card-header">
                    <div class="client-avatar-circle">${initials}</div>
                    <div class="client-header-info">
                        <h3>${c.name}</h3>
                        <span>${c.phone}</span>
                    </div>
                </div>
                <div class="client-metrics-box">
                    <div class="c-metric-item">
                        <span>Limit</span>
                        <strong>B/. ${c.creditLimit.toFixed(2)}</strong>
                    </div>
                    <div class="c-metric-item">
                        <span>Debt</span>
                        <strong style="color:var(--red-accent);">B/. ${c.currentDebt.toFixed(2)}</strong>
                    </div>
                    <div class="c-metric-item">
                        <span>Available</span>
                        <strong style="color:var(--green-accent);">B/. ${available.toFixed(2)}</strong>
                    </div>
                </div>
                <div class="progress-container-box">
                    <div class="progress-label-row">
                        <span>Utilization</span>
                        <span>${percent.toFixed(2)}%</span>
                    </div>
                    <div class="progress-bar-bg">
                        <div class="progress-bar-fill ${barColor}" style="width: ${Math.min(100, percent)}%;"></div>
                    </div>
                </div>
                <div class="client-card-actions">
                    <button class="client-action-btn" onclick="openClientDetails(${c.id})"><i class="fa-solid fa-eye"></i> View Details</button>
                    ${hasOverdue ? `<button class="client-action-btn reminder" onclick="openReminderModal(${c.id})"><i class="fa-solid fa-bell"></i> Reminder</button>` : ''}
                </div>
            `;
            clientsGridContainer.appendChild(card);
        });
    }

    clientSearch.addEventListener('input', renderClientsDirectory);
    clientFilterStatus.addEventListener('change', renderClientsDirectory);
    clientSortSelect.addEventListener('change', renderClientsDirectory);

    // --- 5. AGREGAR / EDITAR CLIENTE ---
    openAddClientModal.addEventListener('click', () => {
        clientForm.reset();
        document.getElementById('editClientId').value = '';
        clientModalTitle.textContent = 'Add New Client';
        clientModal.classList.add('active');
    });
    closeClientModal.addEventListener('click', () => clientModal.classList.remove('active'));

    clientForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('editClientId').value;
        const name = document.getElementById('clientName').value.trim();
        const phone = document.getElementById('clientPhone').value.trim();
        const email = document.getElementById('clientEmail').value.trim();
        const limit = parseFloat(document.getElementById('clientLimit').value);
        const autoBlock = document.getElementById('clientAutoBlock').checked;
        const notes = document.getElementById('clientNotes').value.trim();

        if (!name || limit < 0) {
            alert('Please enter valid customer details.');
            return;
        }

        let customers = getCustomers();
        if (id) {
            const c = customers.find(x => x.id === parseInt(id));
            if (c) {
                if (limit < c.currentDebt) {
                    alert(`Warning: New limit (B/. ${limit.toFixed(2)}) is lower than existing debt (B/. ${c.currentDebt.toFixed(2)}). Limit updated, but existing debt remains.`);
                }
                c.name = name; c.phone = phone; c.email = email; c.creditLimit = limit; c.autoBlock = autoBlock; c.notes = notes;
            }
        } else {
            if (customers.some(x => x.name.toLowerCase() === name.toLowerCase())) {
                alert('A customer with this name already exists.');
                return;
            }
            customers.push({
                id: Date.now(),
                name, phone, email,
                creditLimit: limit,
                currentDebt: 0.00,
                notes,
                autoBlock
            });
        }

        setCustomers(customers);
        clientModal.classList.remove('active');
        renderAll();
    });

    // --- 6. DETALLES DEL CLIENTE ---
    window.openClientDetails = function(custId) {
        const customers = getCustomers();
        const credits = getCredits();
        const reminders = getReminders().filter(r => r.customerId === custId);
        const c = customers.find(x => x.id === custId);
        if (!c) return;

        const customerCredits = credits.filter(cr => cr.customerId === custId);
        const available = Math.max(0, c.creditLimit - c.currentDebt);
        let percent = c.creditLimit > 0 ? (c.currentDebt / c.creditLimit) * 100 : 0;

        let creditsRows = '';
        if (customerCredits.length === 0) {
            creditsRows = `<tr><td colspan="5" class="text-center" style="text-align:center; color:var(--subtext);">No credit records</td></tr>`;
        } else {
            customerCredits.forEach(cr => {
                creditsRows += `
                    <tr>
                        <td>${cr.date}</td>
                        <td>${cr.description}</td>
                        <td>B/. ${cr.originalAmount.toFixed(2)}</td>
                        <td><strong>B/. ${cr.balance.toFixed(2)}</strong></td>
                        <td><span class="status-badge ${cr.status}">${cr.status}</span></td>
                    </tr>
                `;
            });
        }

        let remindersRows = '';
        if (reminders.length === 0) {
            remindersRows = `<tr><td colspan="4" class="text-center" style="text-align:center; color:var(--subtext);">No reminder history</td></tr>`;
        } else {
            remindersRows = reminders.map(r => `
                <tr>
                    <td>${r.date}</td>
                    <td>${r.channel.toUpperCase()}</td>
                    <td>B/. ${r.amount.toFixed(2)}</td>
                    <td><span class="status-badge partial">Opened / Prepared</span></td>
                </tr>
            `).join('');
        }

        clientDetailsContent.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                <div>
                    <h2>${c.name}</h2>
                    <p style="color:var(--subtext);">${c.phone} | ${c.email || 'No email'}</p>
                </div>
                <div style="display:flex; gap:8px;">
                    <button class="table-action-btn" onclick="editClient(${c.id})"><i class="fa-solid fa-pen"></i> Edit</button>
                    <button class="table-action-btn" onclick="archiveClient(${c.id})" style="color:var(--red-accent);"><i class="fa-solid fa-box-archive"></i> Archive</button>
                </div>
            </div>
            
            <div class="financial-grid" style="grid-template-columns: repeat(3, 1fr); margin-bottom:15px;">
                <div class="financial-card" style="padding:12px;">
                    <div class="card-info">
                        <span class="card-label">Credit Limit</span>
                        <h2 class="card-value" style="font-size:16px;">B/. ${c.creditLimit.toFixed(2)}</h2>
                    </div>
                </div>
                <div class="financial-card" style="padding:12px;">
                    <div class="card-info">
                        <span class="card-label">Current Debt</span>
                        <h2 class="card-value" style="font-size:16px; color:var(--red-accent);">B/. ${c.currentDebt.toFixed(2)}</h2>
                    </div>
                </div>
                <div class="financial-card" style="padding:12px;">
                    <div class="card-info">
                        <span class="card-label">Available</span>
                        <h2 class="card-value" style="font-size:16px; color:var(--green-accent);">B/. ${available.toFixed(2)}</h2>
                    </div>
                </div>
            </div>

            <div class="progress-container-box" style="margin-bottom:20px;">
                <div class="progress-label-row">
                    <span>Credit Utilization (${percent.toFixed(2)}%)</span>
                    <span>Auto-Block: <strong>${c.autoBlock ? 'Active' : 'Off'}</strong></span>
                </div>
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill red" style="width: ${Math.min(100, percent)}%;"></div>
                </div>
            </div>

            <h3 style="font-size:14px; font-weight:700; margin-bottom:8px;">Credit & Payment History</h3>
            <div class="table-responsive" style="max-height:160px; overflow-y:auto; margin-bottom:20px;">
                <table class="fiao-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Original</th>
                            <th>Balance</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>${creditsRows}</tbody>
                </table>
            </div>

            <h3 style="font-size:14px; font-weight:700; margin-bottom:8px;">Reminder History</h3>
            <div class="table-responsive" style="max-height:120px; overflow-y:auto;">
                <table class="fiao-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Channel</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>${remindersRows}</tbody>
                </table>
            </div>
        `;
        clientDetailsModal.classList.add('active');
    };
    closeDetailsModal.addEventListener('click', () => clientDetailsModal.classList.remove('active'));

    window.editClient = function(custId) {
        const customers = getCustomers();
        const c = customers.find(x => x.id === custId);
        if (!c) return;

        clientDetailsModal.classList.remove('active');
        document.getElementById('editClientId').value = c.id;
        document.getElementById('clientName').value = c.name;
        document.getElementById('clientPhone').value = c.phone;
        document.getElementById('clientEmail').value = c.email || '';
        document.getElementById('clientLimit').value = c.creditLimit;
        document.getElementById('clientAutoBlock').checked = c.autoBlock;
        document.getElementById('clientNotes').value = c.notes || '';

        clientModalTitle.textContent = 'Edit Client';
        clientModal.classList.add('active');
    };

    window.archiveClient = function(custId) {
        if (!confirm('Are you sure you want to archive this client?')) return;
        let customers = getCustomers();
        customers = customers.filter(x => x.id !== custId);
        setCustomers(customers);
        clientDetailsModal.classList.remove('active');
        renderAll();
    };

    // --- 7. PAYMENT REMINDERS (WHATSAPP & EMAIL) ---
    window.openReminderModal = function(custId) {
        const customers = getCustomers();
        const credits = getCredits();
        const c = customers.find(x => x.id === custId);
        if (!c) return;

        activeReminderCustomerId = custId;
        activeReminderChannel = 'whatsapp';

        // Calcular deudas vencidas exactas del cliente
        const now = new Date();
        let overdueDebtTotal = 0;
        credits.forEach(cr => {
            if (cr.customerId === custId && cr.balance > 0 && cr.dueDate && new Date(cr.dueDate) < now) {
                overdueDebtTotal += cr.balance;
            }
        });

        if (overdueDebtTotal <= 0) {
            overdueDebtTotal = c.currentDebt; // Respaldo si no hay fechas específicas vencidas pero tiene deuda
        }

        const businessName = "Abarrotería La Esquina";
        const defaultMsg = `Hola ${c.name}, le saludamos de ${businessName}. Le recordamos amablemente que tiene un saldo vencido de B/. ${overdueDebtTotal.toFixed(2)}. Agradecemos que pueda ponerse al día con su pago. ¡Muchas gracias!`;

        reminderMessageText.value = defaultMsg;
        reminderContactInfo.innerHTML = `Customer Phone: <strong>${c.phone}</strong> | Email: <strong>${c.email || 'Not registered'}</strong>`;
        
        channelWhatsAppBtn.classList.add('active');
        channelEmailBtn.classList.remove('active');

        reminderModal.classList.add('active');
    };

    closeReminderModal.addEventListener('click', () => reminderModal.classList.remove('active'));
    cancelReminderBtn.addEventListener('click', () => reminderModal.classList.remove('active'));

    channelWhatsAppBtn.addEventListener('click', () => {
        activeReminderChannel = 'whatsapp';
        channelWhatsAppBtn.classList.add('active');
        channelEmailBtn.classList.remove('active');
    });

    channelEmailBtn.addEventListener('click', () => {
        activeReminderChannel = 'email';
        channelEmailBtn.classList.add('active');
        channelWhatsAppBtn.classList.remove('active');
    });

    confirmSendReminderBtn.addEventListener('click', () => {
        const customers = getCustomers();
        const credits = getCredits();
        const c = customers.find(x => x.id === activeReminderCustomerId);
        if (!c) return;

        const message = reminderMessageText.value.trim();
        const now = new Date();
        let overdueDebtTotal = 0;
        credits.forEach(cr => {
            if (cr.customerId === activeReminderCustomerId && cr.balance > 0 && cr.dueDate && new Date(cr.dueDate) < now) {
                overdueDebtTotal += cr.balance;
            }
        });
        if (overdueDebtTotal <= 0) overdueDebtTotal = c.currentDebt;

        // Registrar en historial de recordatorios
        let reminders = getReminders();
        const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
        reminders.unshift({
            id: Date.now(),
            customerId: c.id,
            date: nowStr,
            channel: activeReminderChannel,
            amount: overdueDebtTotal,
            message: message
        });
        setReminders(reminders);

        if (activeReminderChannel === 'whatsapp') {
            let phoneClean = c.phone.replace(/[^0-9+]/g, '');
            if (!phoneClean.startsWith('+')) {
                phoneClean = '+507' + phoneClean.replace(/^0+/, '');
            }
            const encodedMsg = encodeURIComponent(message);
            const waUrl = `https://wa.me/${phoneClean.replace('+', '')}?text=${encodedMsg}`;
            window.open(waUrl, '_blank');
        } else {
            if (!c.email) {
                alert('Customer does not have an email address registered.');
                return;
            }
            const subject = encodeURIComponent("Payment Reminder – FIA'O");
            const body = encodeURIComponent(message);
            const mailtoUrl = `mailto:${c.email}?subject=${subject}&body=${body}`;
            window.location.href = mailtoUrl;
        }

        reminderModal.classList.remove('active');
        alert('Reminder prepared and opened in application. Confirm sending from your app.');
    });

    // Traducción EN / ES y Modo Oscuro
    const langBtn = document.getElementById('lang-btn');
    let currentLang = localStorage.getItem('fia_lang') || 'EN';

    function setLanguage(lang) {
        currentLang = lang;
        if (langBtn) langBtn.textContent = lang === 'EN' ? 'ES' : 'EN';
        localStorage.setItem('fia_lang', lang);

        document.querySelectorAll('[data-en]').forEach(el => {
            const translation = el.getAttribute(`data-${lang.toLowerCase()}`);
            if (translation) {
                if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
                    el.placeholder = translation;
                } else {
                    el.textContent = translation;
                }
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
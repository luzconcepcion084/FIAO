document.addEventListener('DOMContentLoaded', () => {
    // --- 1. DATOS DE DEMOSTRACIÓN INICIALES ---
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

    if (!localStorage.getItem('fia_activities')) {
        const initialActivities = [
            { text: 'Ramón Batista — Payment received: B/. 15.00', time: 'Today, 9:15 AM' },
            { text: 'Carlos Pérez — New credit: B/. 20.00', time: 'Yesterday, 4:30 PM' },
            { text: 'María Gómez — Payment received: B/. 20.00', time: 'Oct 24, 2:10 PM' }
        ];
        localStorage.setItem('fia_activities', JSON.stringify(initialActivities));
    }

    // --- 2. REFERENCIAS DE ELEMENTOS ---
    const profileToggle = document.getElementById('profileToggle');
    const profileDropdown = document.getElementById('profileDropdown');
    const userInitials = document.getElementById('userInitials');

    const statOutstandingDebt = document.getElementById('statOutstandingDebt');
    const statPaymentsToday = document.getElementById('statPaymentsToday');
    const statCustomersWithDebt = document.getElementById('statCustomersWithDebt');
    const statOverdueCredits = document.getElementById('statOverdueCredits');

    const customerSearchInput = document.getElementById('customerSearchInput');
    const customerSelectList = document.getElementById('customerSelectList');
    const selectedCustomerDetails = document.getElementById('selectedCustomerDetails');
    const autoBlockToggle = document.getElementById('autoBlockToggle');

    const creditsTableBody = document.getElementById('creditsTableBody');
    const debtHistoryBody = document.getElementById('debtHistoryBody');
    const recentActivityList = document.getElementById('recentActivityList');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // Modales
    const openNewCreditModal = document.getElementById('openNewCreditModal');
    const newCreditModal = document.getElementById('newCreditModal');
    const closeCreditModal = document.getElementById('closeCreditModal');
    const newCreditForm = document.getElementById('newCreditForm');

    const openAddCustomerModal = document.getElementById('openAddCustomerModal');
    const addCustomerModal = document.getElementById('addCustomerModal');
    const closeCustomerModal = document.getElementById('closeCustomerModal');
    const addCustomerForm = document.getElementById('addCustomerForm');

    const registerPaymentModal = document.getElementById('registerPaymentModal');
    const closePaymentModal = document.getElementById('closePaymentModal');
    const registerPaymentForm = document.getElementById('registerPaymentForm');
    const markFullPaidBtn = document.getElementById('markFullPaidBtn');

    let selectedCustomerId = null;
    let currentFilter = 'all';

    // --- 3. INICIALIZACIÓN ---
    const savedName = localStorage.getItem('fia_user_name') || 'Business Owner';
    if (userInitials) {
        const parts = savedName.split(' ');
        userInitials.textContent = parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0].substring(0, 2).toUpperCase();
    }

    renderAll();

    // --- 4. FUNCIONES DE RENDERIZADO ---
    function renderAll() {
        renderStats();
        renderCustomerDropdown();
        renderCreditsTable();
        renderRecentActivity();
        if (selectedCustomerId) {
            renderSelectedCustomer(selectedCustomerId);
            renderDebtHistory(selectedCustomerId);
        }
    }

    function getCustomers() { return JSON.parse(localStorage.getItem('fia_customers')) || []; }
    function setCustomers(c) { localStorage.setItem('fia_customers', JSON.stringify(c)); }

    function getCredits() { return JSON.parse(localStorage.getItem('fia_credits')) || []; }
    function setCredits(cr) { localStorage.setItem('fia_credits', JSON.stringify(cr)); }

    function getActivities() { return JSON.parse(localStorage.getItem('fia_activities')) || []; }
    function setActivities(ac) { localStorage.setItem('fia_activities', JSON.stringify(ac)); }

    function renderStats() {
        const credits = getCredits();
        const customers = getCustomers();

        let totalDebt = 0;
        let withDebtCount = 0;
        let overdueCount = 0;
        let paymentsTodayTotal = 35.00;

        customers.forEach(c => {
            if (c.currentDebt > 0) withDebtCount++;
        });

        const now = new Date();
        credits.forEach(cr => {
            if (cr.status !== 'paid') totalDebt += cr.balance;
            if (cr.balance > 0 && cr.dueDate && new Date(cr.dueDate) < now) {
                overdueCount++;
                cr.status = 'overdue';
            }
        });

        statOutstandingDebt.textContent = `B/. ${totalDebt.toFixed(2)}`;
        statCustomersWithDebt.textContent = withDebtCount;
        statOverdueCredits.textContent = overdueCount;
        statPaymentsToday.textContent = `B/. ${paymentsTodayTotal.toFixed(2)}`;
    }

    function renderCustomerDropdown(searchTerm = '') {
        const customers = getCustomers();
        customerSelectList.innerHTML = '';

        const filtered = customers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

        if (filtered.length === 0) {
            customerSelectList.innerHTML = `<div style="font-size:11px; color:var(--subtext); padding:8px;">No customers found</div>`;
            return;
        }

        filtered.forEach(c => {
            const item = document.createElement('div');
            item.className = `customer-dropdown-item ${selectedCustomerId === c.id ? 'active' : ''}`;
            item.innerHTML = `<span>${c.name}</span> <span style="color:var(--subtext);">Debt: B/. ${c.currentDebt.toFixed(2)}</span>`;
            item.addEventListener('click', () => {
                selectedCustomerId = c.id;
                autoBlockToggle.checked = c.autoBlock;
                renderCustomerDropdown(customerSearchInput.value);
                renderSelectedCustomer(c.id);
                renderDebtHistory(c.id);
            });
            customerSelectList.appendChild(item);
        });
    }

    function renderSelectedCustomer(custId) {
        const customers = getCustomers();
        const c = customers.find(x => x.id === custId);
        if (!c) return;

        const available = Math.max(0, c.creditLimit - c.currentDebt);
        let percent = c.creditLimit > 0 ? (c.currentDebt / c.creditLimit) * 100 : 0;
        let barColor = 'green';
        if (percent > 40 && percent <= 80) barColor = 'yellow';
        if (percent > 80) barColor = 'red';

        selectedCustomerDetails.innerHTML = `
            <div class="customer-card-profile">
                <h4>${c.name}</h4>
                <p>${c.phone} | ${c.email || 'No email'}</p>
                <div class="cust-metrics-grid">
                    <div class="cust-metric-box">
                        <span>Limit</span>
                        <strong>B/. ${c.creditLimit.toFixed(2)}</strong>
                    </div>
                    <div class="cust-metric-box">
                        <span>Current Debt</span>
                        <strong style="color:var(--red-accent);">B/. ${c.currentDebt.toFixed(2)}</strong>
                    </div>
                    <div class="cust-metric-box">
                        <span>Available</span>
                        <strong style="color:var(--green-accent);">B/. ${available.toFixed(2)}</strong>
                    </div>
                </div>
                <div class="progress-container-box">
                    <div class="progress-label-row">
                        <span>Credit Utilization</span>
                        <span>${percent.toFixed(2)}% used</span>
                    </div>
                    <div class="progress-bar-bg">
                        <div class="progress-bar-fill ${barColor}" style="width: ${Math.min(100, percent)}%;"></div>
                    </div>
                </div>
            </div>
        `;
    }

    function renderCreditsTable() {
        const credits = getCredits();
        creditsTableBody.innerHTML = '';

        const filtered = credits.filter(cr => {
            if (currentFilter === 'all') return true;
            return cr.status === currentFilter;
        });

        if (filtered.length === 0) {
            creditsTableBody.innerHTML = `<tr><td colspan="7" class="text-center" style="text-align:center; color:var(--subtext); padding:20px;">No credits found</td></tr>`;
            return;
        }

        filtered.forEach(cr => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${cr.customerName}</strong></td>
                <td>${cr.description}</td>
                <td>B/. ${cr.originalAmount.toFixed(2)}</td>
                <td><strong>B/. ${cr.balance.toFixed(2)}</strong></td>
                <td>${cr.dueDate || 'N/A'}</td>
                <td><span class="status-badge ${cr.status}">${cr.status}</span></td>
                <td>
                    ${cr.balance > 0 ? `<button class="table-action-btn pay-btn" data-id="${cr.id}"><i class="fa-solid fa-cash-register"></i> Register Payment</button>` : `<span style="font-size:11px; color:var(--green-accent); font-weight:700;">Paid</span>`}
                </td>
            `;
            creditsTableBody.appendChild(tr);
        });

        document.querySelectorAll('.pay-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const credId = parseInt(e.currentTarget.getAttribute('data-id'));
                openPaymentModal(credId);
            });
        });
    }

    function renderDebtHistory(custId) {
        const credits = getCredits();
        const customerCredits = credits.filter(cr => cr.customerId === custId);
        debtHistoryBody.innerHTML = '';

        if (customerCredits.length === 0) {
            debtHistoryBody.innerHTML = `<tr><td colspan="6" class="text-center" style="text-align:center; color:var(--subtext);">No history records for this customer</td></tr>`;
            return;
        }

        customerCredits.forEach(cr => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${cr.date}</td>
                <td>${cr.description}</td>
                <td>B/. ${cr.originalAmount.toFixed(2)}</td>
                <td>B/. ${cr.paidAmount.toFixed(2)}</td>
                <td><strong>B/. ${cr.balance.toFixed(2)}</strong></td>
                <td><span class="status-badge ${cr.status}">${cr.status}</span></td>
            `;
            debtHistoryBody.appendChild(tr);
        });
    }

    function renderRecentActivity() {
        const activities = getActivities();
        recentActivityList.innerHTML = '';

        activities.forEach(ac => {
            const div = document.createElement('div');
            div.className = 'activity-item';
            div.innerHTML = `
                <div class="activity-details">
                    <strong>${ac.text}</strong>
                    <span>${ac.time}</span>
                </div>
            `;
            recentActivityList.appendChild(div);
        });
    }

    // --- 5. INTERACCIONES Y MODALES ---
    profileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdown.classList.toggle('active');
    });
    window.addEventListener('click', () => profileDropdown.classList.remove('active'));

    customerSearchInput.addEventListener('input', (e) => {
        renderCustomerDropdown(e.target.value);
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter');
            renderCreditsTable();
        });
    });

    autoBlockToggle.addEventListener('change', (e) => {
        if (!selectedCustomerId) {
            alert('Please select a customer first.');
            autoBlockToggle.checked = !autoBlockToggle.checked;
            return;
        }
        let customers = getCustomers();
        customers = customers.map(c => {
            if (c.id === selectedCustomerId) c.autoBlock = e.target.checked;
            return c;
        });
        setCustomers(customers);
    });

    // Modal Add Customer
    openAddCustomerModal.addEventListener('click', () => addCustomerModal.classList.add('active'));
    closeCustomerModal.addEventListener('click', () => addCustomerModal.classList.remove('active'));

    addCustomerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('custFullName').value.trim();
        const phone = document.getElementById('custPhone').value.trim();
        const email = document.getElementById('custEmail').value.trim();
        const limit = parseFloat(document.getElementById('custLimit').value);
        const notes = document.getElementById('custNotes').value.trim();

        if (!name || limit < 0) {
            alert('Invalid customer details or limit.');
            return;
        }

        let customers = getCustomers();
        if (customers.some(c => c.name.toLowerCase() === name.toLowerCase())) {
            alert('A customer with this name already exists.');
            return;
        }

        const newCust = {
            id: Date.now(),
            name, phone, email,
            creditLimit: limit,
            currentDebt: 0.00,
            notes,
            autoBlock: true
        };

        customers.push(newCust);
        setCustomers(customers);
        addCustomerModal.classList.remove('active');
        addCustomerForm.reset();
        selectedCustomerId = newCust.id;
        renderAll();
    });

    // Modal New Credit
    openNewCreditModal.addEventListener('click', () => {
        const select = document.getElementById('creditCustSelect');
        select.innerHTML = '<option value="">-- Choose customer --</option>';
        getCustomers().forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id;
            opt.textContent = `${c.name} (Available: B/. ${Math.max(0, c.creditLimit - c.currentDebt).toFixed(2)})`;
            select.appendChild(opt);
        });
        document.getElementById('credDate').valueAsDate = new Date();
        newCreditModal.classList.add('active');
    });
    closeCreditModal.addEventListener('click', () => newCreditModal.classList.remove('active'));

    const credQty = document.getElementById('credQty');
    const credUnitPrice = document.getElementById('credUnitPrice');
    const credTotalAmount = document.getElementById('credTotalAmount');
    const creditCustSelect = document.getElementById('creditCustSelect');
    const creditPreviewBox = document.getElementById('creditPreviewBox');

    function updateCreditCalc() {
        const q = parseFloat(credQty.value) || 0;
        const p = parseFloat(credUnitPrice.value) || 0;
        const total = q * p;
        credTotalAmount.value = `B/. ${total.toFixed(2)}`;
    }
    credQty.addEventListener('input', updateCreditCalc);
    credUnitPrice.addEventListener('input', updateCreditCalc);

    creditCustSelect.addEventListener('change', (e) => {
        const custId = parseInt(e.target.value);
        if (!custId) {
            creditPreviewBox.textContent = `Limit: B/. 0.00 | Debt: B/. 0.00 | Available: B/. 0.00`;
            return;
        }
        const cust = getCustomers().find(x => x.id === custId);
        if (cust) {
            const avail = Math.max(0, cust.creditLimit - cust.currentDebt);
            creditPreviewBox.textContent = `Limit: B/. ${cust.creditLimit.toFixed(2)} | Debt: B/. ${cust.currentDebt.toFixed(2)} | Available: B/. ${avail.toFixed(2)}`;
        }
    });

    newCreditForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const custId = parseInt(creditCustSelect.value);
        const desc = document.getElementById('credItemDesc').value.trim();
        const q = parseFloat(credQty.value);
        const p = parseFloat(credUnitPrice.value);
        const total = q * p;
        const date = document.getElementById('credDate').value;
        const dueDate = document.getElementById('credDueDate').value;

        let customers = getCustomers();
        const cust = customers.find(x => x.id === custId);
        if (!cust) return;

        const available = cust.creditLimit - cust.currentDebt;

        if (cust.autoBlock && total > available) {
            alert(`Blocked by Auto-Block rule! Requested amount (B/. ${total.toFixed(2)}) exceeds available credit (B/. ${available.toFixed(2)}).`);
            return;
        }

        if (!cust.autoBlock && total > available) {
            if (!confirm(`Warning: This credit exceeds the customer's available limit. Do you want to authorize it anyway?`)) {
                return;
            }
        }

        cust.currentDebt += total;
        setCustomers(customers);

        let credits = getCredits();
        const now = new Date();
        const isOverdue = dueDate && new Date(dueDate) < now;

        const newCr = {
            id: Date.now(),
            customerId: cust.id,
            customerName: cust.name,
            description: desc,
            originalAmount: total,
            paidAmount: 0.00,
            balance: total,
            date, dueDate,
            status: isOverdue ? 'overdue' : 'pending'
        };
        credits.push(newCr);
        setCredits(credits);

        let activities = getActivities();
        activities.unshift({ text: `${cust.name} — New credit: B/. ${total.toFixed(2)}`, time: 'Just now' });
        setActivities(activities);

        newCreditModal.classList.remove('active');
        newCreditForm.reset();
        selectedCustomerId = cust.id;
        renderAll();
    });

    // Modal Register Payment & Mark as Paid
    function openPaymentModal(credId) {
        const credits = getCredits();
        const cr = credits.find(x => x.id === credId);
        if (!cr) return;

        document.getElementById('payCreditId').value = cr.id;
        document.getElementById('payCustName').value = cr.customerName;
        document.getElementById('payItemDesc').value = cr.description;
        document.getElementById('payPendingBalance').value = `B/. ${cr.balance.toFixed(2)}`;
        document.getElementById('payAmount').value = '';
        registerPaymentModal.classList.add('active');
    }

    closePaymentModal.addEventListener('click', () => registerPaymentModal.classList.remove('active'));

    function processPayment(payAmt) {
        const credId = parseInt(document.getElementById('payCreditId').value);
        let credits = getCredits();
        const cr = credits.find(x => x.id === credId);
        if (!cr) return;

        if (payAmt <= 0 || payAmt > cr.balance) {
            alert('Invalid payment amount. Must be greater than 0 and not exceed pending balance.');
            return;
        }

        cr.paidAmount += payAmt;
        cr.balance -= payAmt;
        if (cr.balance === 0) {
            cr.status = 'paid';
        } else {
            const now = new Date();
            cr.status = (cr.dueDate && new Date(cr.dueDate) < now) ? 'overdue' : 'partial';
        }
        setCredits(credits);

        let customers = getCustomers();
        const cust = customers.find(x => x.id === cr.customerId);
        if (cust) {
            cust.currentDebt = Math.max(0, cust.currentDebt - payAmt);
            setCustomers(customers);
        }

        let activities = getActivities();
        activities.unshift({ text: `${cr.customerName} — Payment received: B/. ${payAmt.toFixed(2)}`, time: 'Just now' });
        setActivities(activities);

        registerPaymentModal.classList.remove('active');
        renderAll();
    }

    registerPaymentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const payAmt = parseFloat(document.getElementById('payAmount').value);
        processPayment(payAmt);
    });

    markFullPaidBtn.addEventListener('click', () => {
        const credId = parseInt(document.getElementById('payCreditId').value);
        const credits = getCredits();
        const cr = credits.find(x => x.id === credId);
        if (!cr) return;
        processPayment(cr.balance);
    });

    // Traducción EN / ES
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
        langBtn.addEventListener('click', () => {
            setLanguage(currentLang === 'EN' ? 'ES' : 'EN');
        });
    }

    // Tema Oscuro
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
});
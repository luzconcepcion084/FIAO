document.addEventListener('DOMContentLoaded', () => {
    function getCustomers() { return JSON.parse(localStorage.getItem('fia_customers')) || []; }
    function getCredits() { return JSON.parse(localStorage.getItem('fia_credits')) || []; }

    const filterStartDate = document.getElementById('filterStartDate');
    const filterEndDate = document.getElementById('filterEndDate');
    const filterCustomerSelect = document.getElementById('filterCustomerSelect');
    const filterStatusSelect = document.getElementById('filterStatusSelect');
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
    const resetFiltersBtn = document.getElementById('resetFiltersBtn');
    const quickRangeBtns = document.querySelectorAll('.quick-range-btn');

    const statTotalIssued = document.getElementById('statTotalIssued');
    const statPaymentsReceived = document.getElementById('statPaymentsReceived');
    const statOutstandingBalance = document.getElementById('statOutstandingBalance');
    const statOverdueBalance = document.getElementById('statOverdueBalance');
    const statTotalCustomers = document.getElementById('statTotalCustomers');
    const statAvgCredit = document.getElementById('statAvgCredit');

    const transactionsTableBody = document.getElementById('transactionsTableBody');
    const transactionSearchInput = document.getElementById('transactionSearchInput');
    const topCustomersTableBody = document.getElementById('topCustomersTableBody');

    const exportPdfBtn = document.getElementById('exportPdfBtn');
    const exportExcelBtn = document.getElementById('exportExcelBtn');

    let barChartInstance = null;
    let doughnutChartInstance = null;

    const savedName = localStorage.getItem('fia_user_name') || 'Business Owner';
    const userInitials = document.getElementById('userInitials');
    if (userInitials) {
        const parts = savedName.split(' ');
        userInitials.textContent = parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0].substring(0, 2).toUpperCase();
    }

    function populateCustomersDropdown() {
        const customers = getCustomers();
        const lang = localStorage.getItem('fia_lang') || 'EN';
        const allText = lang === 'ES' ? 'Todos los Clientes' : 'All Customers';
        filterCustomerSelect.innerHTML = `<option value="all">${allText}</option>`;
        customers.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id;
            opt.textContent = c.name;
            filterCustomerSelect.appendChild(opt);
        });
    }

    setQuickRange('month');
    populateCustomersDropdown();
    applyReportCalculations();

    quickRangeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            quickRangeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const range = btn.getAttribute('data-range');
            if (range !== 'custom') {
                setQuickRange(range);
                applyReportCalculations();
            }
        });
    });

    function setQuickRange(type) {
        const now = new Date();
        let start = new Date();
        let end = new Date();

        if (type === 'today') {
            start = now;
            end = now;
        } else if (type === 'week') {
            const day = now.getDay();
            const diff = now.getDate() - day + (day === 0 ? -6 : 1);
            start = new Date(now.setDate(diff));
            end = new Date();
        } else if (type === 'month') {
            start = new Date(now.getFullYear(), now.getMonth(), 1);
            end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        } else if (type === 'lastmonth') {
            start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            end = new Date(now.getFullYear(), now.getMonth(), 0);
        }

        filterStartDate.value = start.toISOString().split('T')[0];
        filterEndDate.value = end.toISOString().split('T')[0];
    }

    applyFiltersBtn.addEventListener('click', () => {
        if (filterStartDate.value && filterEndDate.value && filterStartDate.value > filterEndDate.value) {
            alert('Start date cannot be after end date.');
            return;
        }
        applyReportCalculations();
    });

    resetFiltersBtn.addEventListener('click', () => {
        setQuickRange('month');
        filterCustomerSelect.value = 'all';
        filterStatusSelect.value = 'all';
        transactionSearchInput.value = '';
        applyReportCalculations();
    });

    function applyReportCalculations() {
        const credits = getCredits();
        const customers = getCustomers();
        const startDate = filterStartDate.value;
        const endDate = filterEndDate.value;
        const custFilter = filterCustomerSelect.value;
        const statusFilter = filterStatusSelect.value;

        let totalIssued = 0;
        let paymentsReceived = 0;
        let outstandingBalance = 0;
        let overdueBalance = 0;
        let activeCustomersSet = new Set();
        let countIssued = 0;

        const now = new Date();

        const filteredCredits = credits.filter(cr => {
            const matchesCust = custFilter === 'all' || cr.customerId === parseInt(custFilter);
            const matchesStatus = statusFilter === 'all' || cr.status === statusFilter;
            const matchesDate = (!startDate || cr.date >= startDate) && (!endDate || cr.date <= endDate);
            return matchesCust && matchesStatus && matchesDate;
        });

        filteredCredits.forEach(cr => {
            totalIssued += cr.originalAmount;
            countIssued++;
            activeCustomersSet.add(cr.customerId);

            if (cr.status !== 'paid') {
                outstandingBalance += cr.balance;
                if (cr.dueDate && new Date(cr.dueDate) < now) {
                    overdueBalance += cr.balance;
                }
            }
            paymentsReceived += cr.paidAmount;
        });

        const avgCredit = countIssued > 0 ? totalIssued / countIssued : 0;
        const totalCustCount = activeCustomersSet.size;

        statTotalIssued.textContent = `B/. ${totalIssued.toFixed(2)}`;
        statPaymentsReceived.textContent = `B/. ${paymentsReceived.toFixed(2)}`;
        statOutstandingBalance.textContent = `B/. ${outstandingBalance.toFixed(2)}`;
        statOverdueBalance.textContent = `B/. ${overdueBalance.toFixed(2)}`;
        statTotalCustomers.textContent = totalCustCount;
        statAvgCredit.textContent = `B/. ${avgCredit.toFixed(2)}`;

        renderTransactionsTable(filteredCredits);
        renderTopCustomers(customers, credits);
        renderCharts(filteredCredits);
    }

    function renderTransactionsTable(creditsList) {
        const search = transactionSearchInput.value.toLowerCase();
        transactionsTableBody.innerHTML = '';

        const filtered = creditsList.filter(cr => 
            cr.customerName.toLowerCase().includes(search) || 
            cr.description.toLowerCase().includes(search)
        );

        if (filtered.length === 0) {
            transactionsTableBody.innerHTML = `<tr><td colspan="6" class="text-center" style="text-align:center; color:var(--subtext); padding:20px;">No transactions found</td></tr>`;
            return;
        }

        filtered.forEach(cr => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${cr.customerName}</strong></td>
                <td>Credit (Fiado)</td>
                <td>${cr.description}</td>
                <td><strong>B/. ${cr.originalAmount.toFixed(2)}</strong></td>
                <td>${cr.date}</td>
                <td><span class="status-badge ${cr.status}">${cr.status}</span></td>
            `;
            transactionsTableBody.appendChild(tr);
        });
    }

    transactionSearchInput.addEventListener('input', () => applyReportCalculations());

    function renderTopCustomers(customers, credits) {
        topCustomersTableBody.innerHTML = '';
        customers.sort((a, b) => b.currentDebt - a.currentDebt);
        const top = customers.slice(0, 5);

        if (top.length === 0 || top.every(c => c.currentDebt === 0)) {
            topCustomersTableBody.innerHTML = `<tr><td colspan="6" class="text-center" style="text-align:center; color:var(--subtext); padding:20px;">No outstanding customer debt</td></tr>`;
            return;
        }

        top.forEach(c => {
            if (c.currentDebt <= 0) return;
            const util = c.creditLimit > 0 ? (c.currentDebt / c.creditLimit) * 100 : 0;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${c.name}</strong></td>
                <td><strong style="color:var(--red-accent);">B/. ${c.currentDebt.toFixed(2)}</strong></td>
                <td>B/. ${c.creditLimit.toFixed(2)}</td>
                <td>${util.toFixed(2)}%</td>
                <td><span class="status-badge ${util >= 100 ? 'pending' : 'partial'}">${util >= 100 ? 'At Limit' : 'Active'}</span></td>
                <td><button class="table-action-btn" onclick="window.location.href='owner-clients.html'">View Details</button></td>
            `;
            topCustomersTableBody.appendChild(tr);
        });
    }

    function renderCharts(creditsList) {
        const dateMap = {};
        creditsList.forEach(cr => {
            if (!dateMap[cr.date]) {
                dateMap[cr.date] = { issued: 0, paid: 0 };
            }
            dateMap[cr.date].issued += cr.originalAmount;
            dateMap[cr.date].paid += cr.paidAmount;
        });

        const sortedDates = Object.keys(dateMap).sort();
        const issuedData = sortedDates.map(d => dateMap[d].issued);
        const paidData = sortedDates.map(d => dateMap[d].paid);

        const ctxBar = document.getElementById('activityBarChart').getContext('2d');
        if (barChartInstance) barChartInstance.destroy();

        barChartInstance = new Chart(ctxBar, {
            type: 'bar',
            data: {
                labels: sortedDates.length > 0 ? sortedDates : ['No data'],
                datasets: [
                    { label: 'Credits Issued', data: sortedDates.length > 0 ? issuedData : [0], backgroundColor: '#B91C1C', borderRadius: 6 },
                    { label: 'Payments Received', data: sortedDates.length > 0 ? paidData : [0], backgroundColor: '#10B981', borderRadius: 6 }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } }
            }
        });

        let countPending = 0, countPartial = 0, countOverdue = 0;
        creditsList.forEach(cr => {
            if (cr.status === 'pending') countPending++;
            else if (cr.status === 'partial') countPartial++;
            else if (cr.status === 'overdue') countOverdue++;
        });

        const ctxDoughnut = document.getElementById('statusDoughnutChart').getContext('2d');
        if (doughnutChartInstance) doughnutChartInstance.destroy();

        doughnutChartInstance = new Chart(ctxDoughnut, {
            type: 'doughnut',
            data: {
                labels: ['Pending', 'Partially Paid', 'Overdue'],
                datasets: [{
                    data: [countPending, countPartial, countOverdue],
                    backgroundColor: ['#EF4444', '#F59E0B', '#B91C1C']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } }
            }
        });
    }

    exportExcelBtn.addEventListener('click', () => {
        const credits = getCredits();
        const customers = getCustomers();

        const summaryData = [
            ["Financial Report - FIA'O"],
            ["Generated Date:", new Date().toLocaleDateString()],
            ["Total Credits Issued:", statTotalIssued.textContent],
            ["Payments Received:", statPaymentsReceived.textContent],
            ["Outstanding Balance:", statOutstandingBalance.textContent]
        ];

        const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
        const wsCredits = XLSX.utils.json_to_sheet(credits);
        const wsCustomers = XLSX.utils.json_to_sheet(customers);

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");
        XLSX.utils.book_append_sheet(wb, wsCredits, "Credits");
        XLSX.utils.book_append_sheet(wb, wsCustomers, "Customers");

        XLSX.writeFile(wb, "Fiao_Financial_Report.xlsx");
    });

    exportPdfBtn.addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.setTextColor(185, 28, 28);
        doc.text("FIA'O - Financial & Credit Report", 14, 20);

        doc.setFontSize(11);
        doc.setTextColor(43, 43, 43);
        doc.text(`Generated Date: ${new Date().toLocaleDateString()}`, 14, 30);
        doc.text(`Total Credits Issued: ${statTotalIssued.textContent}`, 14, 40);
        doc.text(`Payments Received: ${statPaymentsReceived.textContent}`, 14, 50);
        doc.text(`Outstanding Balance: ${statOutstandingBalance.textContent}`, 14, 60);
        doc.text(`Overdue Balance: ${statOverdueBalance.textContent}`, 14, 70);

        doc.save("Fiao_Financial_Report.pdf");
    });

    // Sistema de Traducción EN / ES estándar
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
        populateCustomersDropdown();
        applyReportCalculations();
    }

    setLanguage(currentLang);

    if (langBtn) {
        langBtn.addEventListener('click', () => {
            setLanguage(currentLang === 'EN' ? 'ES' : 'EN');
        });
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
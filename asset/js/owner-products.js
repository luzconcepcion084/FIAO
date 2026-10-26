document.addEventListener('DOMContentLoaded', () => {
    // --- 1. DATOS DE DEMOSTRACIÓN VARIADOS ---
    if (!localStorage.getItem('fia_inventory')) {
        const initialInventory = [
            { id: 1, name: 'White Sugar 2lb', category: 'Pantry', price: 1.85, stock: 25, unit: 'Pack', minStock: 5, sku: 'SUG-01', desc: 'Refined white sugar pack', image: '' },
            { id: 2, name: 'Jasmine Rice 5lb', category: 'Pantry', price: 4.95, stock: 38, unit: 'Pack', minStock: 10, sku: 'RIC-02', desc: 'Premium quality rice', image: '' },
            { id: 3, name: 'Artisan White Bread', category: 'Bakery', price: 1.50, stock: 12, unit: 'Unit', minStock: 4, sku: 'BRD-03', desc: 'Freshly baked daily', image: '' },
            { id: 4, name: 'Coca Cola 2L', category: 'Beverages', price: 2.10, stock: 20, unit: 'Bottle', minStock: 5, sku: 'BEV-04', desc: 'Refreshing soft drink', image: '' },
            { id: 5, name: 'Fresh Farm Eggs', category: 'Dairy & Eggs', price: 3.20, stock: 2, unit: 'Dozen', minStock: 5, sku: 'EGG-05', desc: 'Grade A large eggs', image: '' },
            { id: 6, name: 'Whole Milk 1L', category: 'Dairy & Eggs', price: 1.65, stock: 0, unit: 'Bottle', minStock: 6, sku: 'MLK-06', desc: 'Pasteurized whole milk', image: '' },
            { id: 7, name: 'Ground Beef 1lb', category: 'Meat & Seafood', price: 4.50, stock: 14, unit: 'lb', minStock: 4, sku: 'MEAT-07', desc: 'Fresh lean ground beef', image: '' },
            { id: 8, name: 'Bananas (Bunch)', category: 'Fruits & Vegetables', price: 1.20, stock: 18, unit: 'Unit', minStock: 5, sku: 'FRV-08', desc: 'Sweet ripe bananas', image: '' },
            { id: 9, name: 'Chocolate Cookies', category: 'Snacks & Candy', price: 1.10, stock: 30, unit: 'Pack', minStock: 8, sku: 'SNK-09', desc: 'Crispy chocolate chip cookies', image: '' },
            { id: 10, name: 'Dishwashing Liquid', category: 'Cleaning Products', price: 2.30, stock: 9, unit: 'Unit', minStock: 3, sku: 'CLN-10', desc: 'Lemon scent grease fighter', image: '' }
        ];
        localStorage.setItem('fia_inventory', JSON.stringify(initialInventory));
    }

    if (!localStorage.getItem('fia_stock_movements')) {
        const initialMovements = [
            { id: 1, date: '2026-10-25 10:30', productName: 'White Sugar 2lb', type: 'Stock In', qty: 25, prevStock: 0, newStock: 25, ref: 'Initial inventory' },
            { id: 2, date: '2026-10-26 09:15', productName: 'Jasmine Rice 5lb', type: 'Stock In', qty: 38, prevStock: 0, newStock: 38, ref: 'Initial inventory' }
        ];
        localStorage.setItem('fia_stock_movements', JSON.stringify(initialMovements));
    }

    if (!localStorage.getItem('fia_customers')) {
        localStorage.setItem('fia_customers', JSON.stringify([
            { id: 1, name: 'Carlos Pérez', phone: '+507 6111-2222', email: 'carlos@example.com', creditLimit: 30.00, currentDebt: 20.00, autoBlock: true },
            { id: 2, name: 'María Gómez', phone: '+507 6222-3333', email: 'maria@example.com', creditLimit: 50.00, currentDebt: 12.50, autoBlock: true },
            { id: 3, name: 'Ramón Batista', phone: '+507 6333-4444', email: 'ramon@example.com', creditLimit: 25.00, currentDebt: 0.00, autoBlock: false }
        ]));
    }

    // --- 2. ESTADOS Y REFERENCIAS ---
    let viewMode = 'grid'; // 'grid' o 'list'
    let currentCategory = 'All';
    let cart = [];
    let selectedSaleCustomerId = null;
    let tempUploadedImageBase64 = '';

    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const gridViewBtn = document.getElementById('gridViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    const productsGrid = document.getElementById('productsGrid');
    const productsTableContainer = document.getElementById('productsTableContainer');
    const inventoryTableBody = document.getElementById('inventoryTableBody');
    const inventorySearch = document.getElementById('inventorySearch');
    const statusFilter = document.getElementById('statusFilter');
    const sortSelect = document.getElementById('sortSelect');
    const categoriesPillsContainer = document.getElementById('categoriesPillsContainer');

    const statTotalProducts = document.getElementById('statTotalProducts');
    const statLowStock = document.getElementById('statLowStock');
    const statOutOfStock = document.getElementById('statOutOfStock');
    const statInventoryValue = document.getElementById('statInventoryValue');

    // Modales
    const productModal = document.getElementById('productModal');
    const openAddProductModal = document.getElementById('openAddProductModal');
    const closeProductModal = document.getElementById('closeProductModal');
    const productForm = document.getElementById('productForm');
    const productModalTitle = document.getElementById('productModalTitle');
    const prodImageFile = document.getElementById('prodImageFile');
    const selectImgBtn = document.getElementById('selectImgBtn');
    const removeImgBtn = document.getElementById('removeImgBtn');
    const imgPreviewBox = document.getElementById('imgPreviewBox');

    const productDetailsModal = document.getElementById('productDetailsModal');
    const closeDetailsModal = document.getElementById('closeDetailsModal');
    const detailsModalContent = document.getElementById('detailsModalContent');

    // Venta Fiada
    const modeInventoryBtn = document.getElementById('modeInventoryBtn');
    const modeManualBtn = document.getElementById('modeManualBtn');
    const formModeInventory = document.getElementById('formModeInventory');
    const formModeManual = document.getElementById('formModeManual');
    const saleProductSelect = document.getElementById('saleProductSelect');
    const saleQty = document.getElementById('saleQty');
    const addTocartInvBtn = document.getElementById('addTocartInvBtn');
    const addTocartManualBtn = document.getElementById('addTocartManualBtn');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartTotalDisplay = document.getElementById('cartTotalDisplay');
    const saleCustomerSelect = document.getElementById('saleCustomerSelect');
    const saleCustomerDetails = document.getElementById('saleCustomerDetails');
    const confirmFiadoSaleBtn = document.getElementById('confirmFiadoSaleBtn');
    const movementsTableBody = document.getElementById('movementsTableBody');

    // Inicialización perfil
    const savedName = localStorage.getItem('fia_user_name') || 'Business Owner';
    const userInitials = document.getElementById('userInitials');
    if (userInitials) {
        const parts = savedName.split(' ');
        userInitials.textContent = parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0].substring(0, 2).toUpperCase();
    }

    renderAll();

    function renderAll() {
        renderInventory();
        renderMovements();
        populateSaleDropdowns();
    }

    function getInventory() { return JSON.parse(localStorage.getItem('fia_inventory')) || []; }
    function setInventory(inv) { localStorage.setItem('fia_inventory', JSON.stringify(inv)); }
    function getMovements() { return JSON.parse(localStorage.getItem('fia_stock_movements')) || []; }
    function setMovements(mov) { localStorage.setItem('fia_stock_movements', JSON.stringify(mov)); }
    function getCustomers() { return JSON.parse(localStorage.getItem('fia_customers')) || []; }
    function setCustomers(cust) { localStorage.setItem('fia_customers', JSON.stringify(cust)); }
    function getCredits() { return JSON.parse(localStorage.getItem('fia_credits')) || []; }
    function setCredits(cred) { localStorage.setItem('fia_credits', JSON.stringify(cred)); }

    // --- 3. PESTAÑAS Y VISTAS ---
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(`tab-${btn.getAttribute('data-tab')}`).classList.add('active');
        });
    });

    gridViewBtn.addEventListener('click', () => {
        viewMode = 'grid';
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
        productsGrid.style.display = 'grid';
        productsTableContainer.style.display = 'none';
        renderInventory();
    });

    listViewBtn.addEventListener('click', () => {
        viewMode = 'list';
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
        productsGrid.style.display = 'none';
        productsTableContainer.style.display = 'block';
        renderInventory();
    });

    // Píldoras de Categorías
    categoriesPillsContainer.addEventListener('click', (e) => {
        const pill = e.target.closest('.cat-pill');
        if (!pill) return;
        document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentCategory = pill.getAttribute('data-category');
        renderInventory();
    });

    // --- 4. RENDER INVENTARIO (GRID Y LIST) ---
    function renderInventory() {
        const inventory = getInventory();
        productsGrid.innerHTML = '';
        inventoryTableBody.innerHTML = '';

        let totalProd = inventory.length;
        let lowStock = 0;
        let outStock = 0;
        let totalVal = 0;

        const search = inventorySearch.value.toLowerCase();
        const statFilter = statusFilter.value;
        const sortVal = sortSelect.value;

        // Filtrar
        let filtered = inventory.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(search) || (p.sku && p.sku.toLowerCase().includes(search));
            const matchesCat = currentCategory === 'All' || p.category === currentCategory;
            
            let matchesStatus = true;
            if (statFilter === 'instock') matchesStatus = p.stock > p.minStock;
            else if (statFilter === 'lowstock') matchesStatus = p.stock > 0 && p.stock <= p.minStock;
            else if (statFilter === 'outofstock') matchesStatus = p.stock === 0;

            return matchesSearch && matchesCat && matchesStatus;
        });

        // Ordenar
        filtered.sort((a, b) => {
            if (sortVal === 'name') return a.name.localeCompare(b.name);
            if (sortVal === 'price-asc') return a.price - b.price;
            if (sortVal === 'price-desc') return b.price - a.price;
            if (sortVal === 'stock') return a.stock - b.stock;
            return 0;
        });

        // Estadísticas globales
        inventory.forEach(p => {
            totalVal += p.price * p.stock;
            if (p.stock === 0) outStock++;
            else if (p.stock <= p.minStock) lowStock++;
        });

        statTotalProducts.textContent = totalProd;
        statLowStock.textContent = lowStock;
        statOutOfStock.textContent = outStock;
        statInventoryValue.textContent = `B/. ${totalVal.toFixed(2)}`;

        if (filtered.length === 0) {
            const emptyMsg = `<div style="grid-column: 1/-1; text-align:center; color:var(--subtext); padding:40px;">No products found in this view</div>`;
            productsGrid.innerHTML = emptyMsg;
            inventoryTableBody.innerHTML = `<tr><td colspan="8" class="text-center" style="text-align:center; color:var(--subtext); padding:20px;">No products found</td></tr>`;
            return;
        }

        filtered.forEach(p => {
            let statusClass = 'instock';
            let statusText = 'In Stock';
            if (p.stock === 0) {
                statusClass = 'outofstock';
                statusText = 'Out of Stock';
            } else if (p.stock <= p.minStock) {
                statusClass = 'lowstock';
                statusText = 'Low Stock';
            }

            // Grid Card HTML
            const card = document.createElement('div');
            card.className = 'product-card-modern';
            card.innerHTML = `
                <div class="prod-card-img-wrap">
                    ${p.image ? `<img src="${p.image}" alt="${p.name}">` : `<div class="prod-card-placeholder"><i class="fa-solid fa-box-open"></i></div>`}
                    <span class="prod-badge-status ${statusClass}">${statusText}</span>
                </div>
                <div class="prod-card-body">
                    <span class="prod-card-cat">${p.category}</span>
                    <h3 class="prod-card-title">${p.name}</h3>
                    <div class="prod-card-price">B/. ${p.price.toFixed(2)}</div>
                    <div class="prod-card-stock-row">
                        <span>Stock: <strong>${p.stock} ${p.unit}</strong></span>
                        <span style="color:var(--subtext);">Min: ${p.minStock}</span>
                    </div>
                    <div class="prod-card-actions">
                        <button class="prod-action-btn view-btn" data-id="${p.id}"><i class="fa-solid fa-eye"></i> View</button>
                        <button class="prod-action-btn edit-btn" data-id="${p.id}"><i class="fa-solid fa-pen"></i> Edit</button>
                        <button class="prod-action-btn delete delete-btn" data-id="${p.id}"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
            `;
            productsGrid.appendChild(card);

            // List Table Row HTML
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><div style="width:40px; height:40px; border-radius:8px; overflow:hidden; background:rgba(0,0,0,0.05); display:flex; align-items:center; justify-content:center;">${p.image ? `<img src="${p.image}" style="width:100%; height:100%; object-fit:cover;">` : `<i class="fa-solid fa-box-open" style="color:var(--subtext);"></i>`}</div></td>
                <td><strong>${p.name}</strong><br><small style="color:var(--subtext);">${p.sku || ''}</small></td>
                <td>${p.category}</td>
                <td>B/. ${p.price.toFixed(2)}</td>
                <td><strong>${p.stock}</strong></td>
                <td>${p.unit}</td>
                <td><span class="status-badge ${p.stock === 0 ? 'pending' : (p.stock <= p.minStock ? 'partial' : 'paid')}">${statusText}</span></td>
                <td>
                    <button class="table-action-btn view-btn" data-id="${p.id}"><i class="fa-solid fa-eye"></i></button>
                    <button class="table-action-btn edit-btn" data-id="${p.id}"><i class="fa-solid fa-pen"></i></button>
                    <button class="table-action-btn delete-btn" data-id="${p.id}" style="color:var(--red-accent);"><i class="fa-solid fa-trash"></i></button>
                </td>
            `;
            inventoryTableBody.appendChild(tr);
        });

        // Eventos de botones en tarjetas y tabla
        document.querySelectorAll('.view-btn').forEach(b => b.addEventListener('click', (e) => openDetailsModal(parseInt(e.currentTarget.getAttribute('data-id')))));
        document.querySelectorAll('.edit-btn').forEach(b => b.addEventListener('click', (e) => openEditProductModal(parseInt(e.currentTarget.getAttribute('data-id')))));
        document.querySelectorAll('.delete-btn').forEach(b => b.addEventListener('click', (e) => archiveProduct(parseInt(e.currentTarget.getAttribute('data-id')))));
    }

    inventorySearch.addEventListener('input', renderInventory);
    statusFilter.addEventListener('change', renderInventory);
    sortSelect.addEventListener('change', renderInventory);

    // --- 5. MODAL DE PRODUCTO (AGREGAR / EDITAR) E IMAGEN ---
    openAddProductModal.addEventListener('click', () => {
        productForm.reset();
        document.getElementById('editProductId').value = '';
        tempUploadedImageBase64 = '';
        imgPreviewBox.innerHTML = `<i class="fa-solid fa-image"></i>`;
        productModalTitle.textContent = 'Add New Product';
        productModal.classList.add('active');
    });

    closeProductModal.addEventListener('click', () => productModal.classList.remove('active'));

    selectImgBtn.addEventListener('click', () => prodImageFile.click());
    prodImageFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(uploadEvent) {
                tempUploadedImageBase64 = uploadEvent.target.result;
                imgPreviewBox.innerHTML = `<img src="${tempUploadedImageBase64}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
        }
    });

    removeImgBtn.addEventListener('click', () => {
        tempUploadedImageBase64 = '';
        prodImageFile.value = '';
        imgPreviewBox.innerHTML = `<i class="fa-solid fa-image"></i>`;
    });

    function openEditProductModal(id) {
        const inventory = getInventory();
        const p = inventory.find(x => x.id === id);
        if (!p) return;

        document.getElementById('editProductId').value = p.id;
        document.getElementById('prodName').value = p.name;
        document.getElementById('prodCategory').value = p.category;
        document.getElementById('prodSku').value = p.sku || '';
        document.getElementById('prodPrice').value = p.price;
        document.getElementById('prodStock').value = p.stock;
        document.getElementById('prodUnit').value = p.unit;
        document.getElementById('prodMinStock').value = p.minStock;
        document.getElementById('prodDesc').value = p.desc || '';

        tempUploadedImageBase64 = p.image || '';
        if (tempUploadedImageBase64) {
            imgPreviewBox.innerHTML = `<img src="${tempUploadedImageBase64}" alt="Preview">`;
        } else {
            imgPreviewBox.innerHTML = `<i class="fa-solid fa-image"></i>`;
        }

        productModalTitle.textContent = 'Edit Product';
        productModal.classList.add('active');
    }

    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('editProductId').value;
        const name = document.getElementById('prodName').value.trim();
        const category = document.getElementById('prodCategory').value;
        const sku = document.getElementById('prodSku').value.trim();
        const price = parseFloat(document.getElementById('prodPrice').value);
        const stock = parseInt(document.getElementById('prodStock').value);
        const unit = document.getElementById('prodUnit').value;
        const minStock = parseInt(document.getElementById('prodMinStock').value);
        const desc = document.getElementById('prodDesc').value.trim();

        if (!name || price <= 0 || stock < 0) {
            alert('Please check product details. Price must be > 0.');
            return;
        }

        let inventory = getInventory();
        if (id) {
            const p = inventory.find(x => x.id === parseInt(id));
            if (p) {
                const diff = stock - p.stock;
                p.name = name; p.category = category; p.sku = sku; p.price = price;
                p.stock = stock; p.unit = unit; p.minStock = minStock; p.desc = desc;
                p.image = tempUploadedImageBase64;

                if (diff !== 0) {
                    logMovement(p.name, diff > 0 ? 'Stock In' : 'Stock Out', Math.abs(diff), p.stock - diff, p.stock, 'Inventory Adjustment');
                }
            }
        } else {
            const newP = { id: Date.now(), name, category, sku, price, stock, unit, minStock, desc, image: tempUploadedImageBase64 };
            inventory.push(newP);
            logMovement(name, 'Stock In', stock, 0, stock, 'Initial Stock');
        }

        setInventory(inventory);
        productModal.classList.remove('active');
        renderAll();
    });

    function archiveProduct(id) {
        if (!confirm('Are you sure you want to archive this product?')) return;
        let inventory = getInventory();
        inventory = inventory.filter(x => x.id !== id);
        setInventory(inventory);
        renderAll();
    }

    // --- 6. DETALLES DE PRODUCTO (MODAL RÁPIDO) ---
    function openDetailsModal(id) {
        const inventory = getInventory();
        const p = inventory.find(x => x.id === id);
        if (!p) return;

        detailsModalContent.innerHTML = `
            <div style="width:100px; height:100px; border-radius:12px; margin:0 auto 15px auto; overflow:hidden; background:rgba(0,0,0,0.05); display:flex; align-items:center; justify-content:center;">
                ${p.image ? `<img src="${p.image}" style="width:100%; height:100%; object-fit:cover;">` : `<i class="fa-solid fa-box-open" style="font-size:36px; color:var(--subtext);"></i>`}
            </div>
            <h2 style="margin-bottom:4px;">${p.name}</h2>
            <p style="color:var(--subtext); margin-bottom:12px;">${p.category} | SKU: ${p.sku || 'N/A'}</p>
            <div style="font-size:22px; font-weight:800; color:var(--primary-red); margin-bottom:12px;">B/. ${p.price.toFixed(2)}</div>
            <p style="font-size:13px; margin-bottom:8px;">Stock Available: <strong>${p.stock} ${p.unit}</strong> (Min: ${p.minStock})</p>
            <p style="font-size:12px; color:var(--subtext); background:rgba(0,0,0,0.03); padding:10px; border-radius:8px; text-align:left;">${p.desc || 'No description provided.'}</p>
        `;
        productDetailsModal.classList.add('active');
    }
    closeDetailsModal.addEventListener('click', () => productDetailsModal.classList.remove('active'));

    // --- 7. REGISTRO DE VENTAS FIADAS Y CARRITO CON MINIATURAS ---
    modeInventoryBtn.addEventListener('click', () => {
        modeInventoryBtn.classList.add('active');
        modeManualBtn.classList.remove('active');
        formModeInventory.style.display = 'block';
        formModeManual.style.display = 'none';
    });

    modeManualBtn.addEventListener('click', () => {
        modeManualBtn.classList.add('active');
        modeInventoryBtn.classList.remove('active');
        formModeInventory.style.display = 'none';
        formModeManual.style.display = 'block';
    });

    function populateSaleDropdowns() {
        const inventory = getInventory();
        saleProductSelect.innerHTML = '<option value="">-- Choose product --</option>';
        inventory.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.id;
            opt.textContent = `${p.name} (B/. ${p.price.toFixed(2)} - Stock: ${p.stock} ${p.unit})`;
            saleProductSelect.appendChild(opt);
        });

        const customers = getCustomers();
        saleCustomerSelect.innerHTML = '<option value="">-- Choose customer --</option>';
        customers.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id;
            opt.textContent = c.name;
            saleCustomerSelect.appendChild(opt);
        });
    }

    addTocartInvBtn.addEventListener('click', () => {
        const prodId = parseInt(saleProductSelect.value);
        const qty = parseInt(saleQty.value);
        if (!prodId || qty <= 0) {
            alert('Please select a valid product and quantity.');
            return;
        }

        const inventory = getInventory();
        const p = inventory.find(x => x.id === prodId);
        if (!p) return;

        if (qty > p.stock) {
            alert(`Insufficient stock! Only ${p.stock} units available.`);
            return;
        }

        cart.push({
            type: 'inventory',
            productId: p.id,
            name: p.name,
            price: p.price,
            qty: qty,
            subtotal: p.price * qty,
            image: p.image || ''
        });

        renderCart();
        saleQty.value = 1;
    });

    addTocartManualBtn.addEventListener('click', () => {
        const name = document.getElementById('manualProdName').value.trim();
        const qty = parseInt(document.getElementById('manualProdQty').value);
        const price = parseFloat(document.getElementById('manualProdPrice').value);

        if (!name || qty <= 0 || price <= 0) {
            alert('Please fill manual product details correctly.');
            return;
        }

        cart.push({
            type: 'manual',
            name: name,
            price: price,
            qty: qty,
            subtotal: price * qty,
            image: ''
        });

        renderCart();
        document.getElementById('manualProdName').value = '';
        document.getElementById('manualProdQty').value = 1;
        document.getElementById('manualProdPrice').value = '';
    });

    function renderCart() {
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `<div style="font-size:12px; color:var(--subtext); text-align:center; padding:15px;" data-en="Cart is empty" data-es="El carrito está vacío">Cart is empty</div>`;
            cartTotalDisplay.textContent = 'B/. 0.00';
            return;
        }

        let total = 0;
        cart.forEach((item, index) => {
            total += item.subtotal;
            const div = document.createElement('div');
            div.className = 'cart-item-row';
            div.innerHTML = `
                <div style="display:flex; align-items:center; gap:10px;">
                    <div style="width:32px; height:32px; border-radius:6px; overflow:hidden; background:rgba(0,0,0,0.05); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                        ${item.image ? `<img src="${item.image}" style="width:100%; height:100%; object-fit:cover;">` : `<i class="fa-solid fa-box" style="font-size:12px; color:var(--subtext);"></i>`}
                    </div>
                    <div>
                        <strong>${item.name}</strong> (${item.qty}x @ B/. ${item.price.toFixed(2)})
                        <br><small style="color:var(--subtext);">${item.type === 'inventory' ? 'Inventory Item' : 'Manual Item'}</small>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <strong>B/. ${item.subtotal.toFixed(2)}</strong>
                    <button type="button" class="table-action-btn" onclick="removeFromCart(${index})" style="color:var(--red-accent); border:none;"><i class="fa-solid fa-xmark"></i></button>
                </div>
            `;
            cartItemsContainer.appendChild(div);
        });

        cartTotalDisplay.textContent = `B/. ${total.toFixed(2)}`;
    }

    window.removeFromCart = function(index) {
        cart.splice(index, 1);
        renderCart();
    };

    saleCustomerSelect.addEventListener('change', (e) => {
        const custId = parseInt(e.target.value);
        selectedSaleCustomerId = custId;
        if (!custId) {
            saleCustomerDetails.innerHTML = `<div class="empty-selection-msg">Select a customer to verify credit limit.</div>`;
            return;
        }
        const customers = getCustomers();
        const c = customers.find(x => x.id === custId);
        if (c) {
            const avail = Math.max(0, c.creditLimit - c.currentDebt);
            let percent = c.creditLimit > 0 ? (c.currentDebt / c.creditLimit) * 100 : 0;
            saleCustomerDetails.innerHTML = `
                <div class="customer-card-profile">
                    <h4>${c.name}</h4>
                    <p>Debt: <strong>B/. ${c.currentDebt.toFixed(2)}</strong> | Limit: <strong>B/. ${c.creditLimit.toFixed(2)}</strong></p>
                    <p style="color:var(--green-accent);">Available Credit: <strong>B/. ${avail.toFixed(2)}</strong></p>
                    <div class="progress-bar-bg" style="margin-top:8px;">
                        <div class="progress-bar-fill red" style="width: ${Math.min(100, percent)}%;"></div>
                    </div>
                </div>
            `;
        }
    });

    confirmFiadoSaleBtn.addEventListener('click', () => {
        if (!selectedSaleCustomerId) {
            alert('Please select a customer for this fiado sale.');
            return;
        }
        if (cart.length === 0) {
            alert('Cart is empty. Add products before confirming.');
            return;
        }

        let customers = getCustomers();
        const cust = customers.find(x => x.id === selectedSaleCustomerId);
        if (!cust) return;

        let totalSaleAmount = cart.reduce((sum, item) => sum + item.subtotal, 0);
        let available = cust.creditLimit - cust.currentDebt;

        if (cust.autoBlock && totalSaleAmount > available) {
            alert(`Blocked by Auto-Block rule! Sale total (B/. ${totalSaleAmount.toFixed(2)}) exceeds available credit (B/. ${available.toFixed(2)}).`);
            return;
        }

        if (!cust.autoBlock && totalSaleAmount > available) {
            if (!confirm(`Warning: This sale exceeds the customer's available credit limit. Authorize anyway?`)) {
                return;
            }
        }

        let inventory = getInventory();
        let cartItemNames = [];

        cart.forEach(item => {
            cartItemNames.push(`${item.name} (x${item.qty})`);
            if (item.type === 'inventory') {
                const p = inventory.find(x => x.id === item.productId);
                if (p) {
                    let prev = p.stock;
                    p.stock -= item.qty;
                    logMovement(p.name, 'Fiado Sale', item.qty, prev, p.stock, `Sold to ${cust.name}`);
                }
            }
        });

        setInventory(inventory);

        cust.currentDebt += totalSaleAmount;
        setCustomers(customers);

        let credits = getCredits();
        const newCr = {
            id: Date.now(),
            customerId: cust.id,
            customerName: cust.name,
            description: cartItemNames.join(', '),
            originalAmount: totalSaleAmount,
            paidAmount: 0.00,
            balance: totalSaleAmount,
            date: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
            status: 'pending'
        };
        credits.push(newCr);
        setCredits(credits);

        alert(`Fiado sale confirmed successfully for ${cust.name}! Total: B/. ${totalSaleAmount.toFixed(2)}`);
        
        cart = [];
        renderCart();
        saleCustomerSelect.value = '';
        selectedSaleCustomerId = null;
        saleCustomerDetails.innerHTML = `<div class="empty-selection-msg">Select a customer to verify credit limit.</div>`;
        renderAll();
    });

    function logMovement(productName, type, qty, prevStock, newStock, ref) {
        let movements = getMovements();
        const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
        movements.unshift({ id: Date.now(), date: now, productName, type, qty, prevStock, newStock, ref });
        setMovements(movements);
    }

    function renderMovements() {
        const movements = getMovements();
        movementsTableBody.innerHTML = '';
        if (movements.length === 0) {
            movementsTableBody.innerHTML = `<tr><td colspan="7" class="text-center" style="text-align:center; color:var(--subtext); padding:20px;">No movements recorded</td></tr>`;
            return;
        }
        movements.forEach(m => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${m.date}</td>
                <td><strong>${m.productName}</strong></td>
                <td><span class="status-badge ${m.type === 'Stock In' ? 'paid' : 'pending'}">${m.type}</span></td>
                <td>${m.qty}</td>
                <td>${m.prevStock}</td>
                <td><strong>${m.newStock}</strong></td>
                <td>${m.ref}</td>
            `;
            movementsTableBody.appendChild(tr);
        });
    }

    // Traducción EN / ES y Tema Oscuro
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
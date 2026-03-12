let menuItems = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentCategory = 'All';

document.addEventListener('DOMContentLoaded', () => {
    // If we're on the main site and not admin
    if(document.getElementById('menu-grid')) {
        loadMenu();
        updateCartUI();
        loadOrders();
    }
});

function loadMenu() {
    // In a real app, this would fetch from an API
    // Using local storage to act as our database for admin syncing
    const storedMenu = localStorage.getItem('menuItems');
    if (storedMenu) {
        menuItems = JSON.parse(storedMenu);
        renderMenu();
        renderCategories();
    } else {
        fetch('data.json')
            .then(res => res.json())
            .then(data => {
                menuItems = data;
                localStorage.setItem('menuItems', JSON.stringify(menuItems));
                renderMenu();
                renderCategories();
            })
            .catch(err => console.error("Error loading menu:", err));
    }
}

function renderCategories() {
    const categories = ['All', ...new Set(menuItems.map(item => item.category))];
    const catContainer = document.getElementById('category-filters');
    if(!catContainer) return;
    
    catContainer.innerHTML = categories.map(cat => 
        `<button class="filter-btn ${cat === currentCategory ? 'active' : ''}" onclick="filterCategory('${cat}')">${cat}</button>`
    ).join('');
}

function filterCategory(category) {
    currentCategory = category;
    renderCategories(); // update active class
    renderMenu();
}

function renderMenu() {
    const grid = document.getElementById('menu-grid');
    if(!grid) return;
    grid.innerHTML = '';

    const filtered = currentCategory === 'All' 
        ? menuItems 
        : menuItems.filter(item => item.category === currentCategory);

    filtered.forEach(item => {
        grid.innerHTML += `
            <div class="menu-card">
                <img src="${item.image}" alt="${item.name}">
                <div class="menu-card-content">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <div class="menu-card-footer">
                        <span class="price">Rs ${item.price.toFixed(2)}</span>
                        <button class="add-to-cart-btn" onclick="addToCart('${item.id}')">Add +</button>
                    </div>
                </div>
            </div>
        `;
    });
}

function toggleCart() {
    document.getElementById('cart-sidebar').classList.toggle('open');
}

function addToCart(id) {
    const item = menuItems.find(i => i.id === id);
    const existing = cart.find(c => c.id === id);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }

    saveCart();
    updateCartUI();
    showToast(`${item.name} added to cart!`);
}

function updateCartQty(id, change) {
    const item = cart.find(c => c.id === id);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
        cart = cart.filter(c => c.id !== id);
    }
    
    saveCart();
    updateCartUI();
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItemsDiv = document.getElementById('cart-items');
    const totalDiv = document.getElementById('cart-total-price');
    
    if(!cartItemsDiv) return;

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.innerText = totalItems;

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<div class="empty-cart-msg">Your cart is empty.</div>';
        totalDiv.innerText = 'Rs 0.00';
        return;
    }

    cartItemsDiv.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="cart-item-qty">
                    <button class="qty-btn" onclick="updateCartQty('${item.id}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateCartQty('${item.id}', 1)">+</button>
                </div>
            </div>
            <div class="cart-item-price">
                Rs ${(item.price * item.quantity).toFixed(2)}
            </div>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalDiv.innerText = `Rs ${total.toFixed(2)}`;
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    document.getElementById('checkout-modal').classList.add('open');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('open');
}

function submitOrder(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const order = {
        id: 'ORD' + Math.floor(Math.random() * 10000),
        name,
        address,
        items: [...cart],
        total,
        status: 'Pending',
        timestamp: new Date().getTime()
    };

    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    cart = [];
    saveCart();
    updateCartUI();
    closeModal('checkout-modal');
    toggleCart();
    showToast('Order placed successfully!');
    
    showSection('orders');
    loadOrders();
    startOrderSimulation(order.id);
}

function showSection(sectionId) {
    document.getElementById('menu-section').style.display = 'none';
    document.getElementById('orders-section').style.display = 'none';
    
    document.getElementById(`${sectionId}-section`).style.display = 'block';
}

function loadOrders() {
    const list = document.getElementById('order-list');
    if(!list) return;
    
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders = orders.sort((a,b) => b.timestamp - a.timestamp); // newest first

    if (orders.length === 0) {
        list.innerHTML = "<p>You have no orders yet.</p>";
        return;
    }

    list.innerHTML = orders.map(order => `
        <div class="order-card">
            <h3>Order #${order.id}</h3>
            <p><strong>Total:</strong> Rs ${order.total.toFixed(2)}</p>
            <p><strong>Status:</strong> <span style="color:var(--primary-color);font-weight:bold;">${order.status}</span></p>
            <small>${new Date(order.timestamp).toLocaleString()}</small>
        </div>
    `).join('');
}

function startOrderSimulation(orderId) {
    const statuses = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered'];
    let idx = 0;
    
    const interval = setInterval(() => {
        idx++;
        if (idx >= statuses.length) {
            clearInterval(interval);
            return;
        }
        
        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        const order = orders.find(o => o.id === orderId);
        if(order) {
            order.status = statuses[idx];
            localStorage.setItem('orders', JSON.stringify(orders));
            loadOrders();
            if(statuses[idx] === 'Delivered') {
                showToast(`Order #${orderId} Delivered!`);
            }
        }
    }, 5000); // Progress every 5 seconds for simulation
}

function showToast(message) {
    const toast = document.getElementById('toast');
    if(!toast) return;
    toast.innerText = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

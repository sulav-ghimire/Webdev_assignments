let menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];

document.addEventListener('DOMContentLoaded', () => {
    // If we're on admin page
    if(document.getElementById('admin-menu-tbody')) {
        renderAdminMenu();
        loadAdminOrders();
    }
});

function showAdminSection(sectionId) {
    document.querySelectorAll('.admin-section').forEach(s => s.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
    
    document.querySelectorAll('.admin-sidebar li').forEach(li => li.classList.remove('active'));
    event.target.classList.add('active');
}

function renderAdminMenu() {
    const tbody = document.getElementById('admin-menu-tbody');
    if(!tbody) return;
    
    tbody.innerHTML = menuItems.map(item => `
        <tr>
            <td><img src="${item.image}" alt="img"></td>
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>Rs ${item.price.toFixed(2)}</td>
            <td>
                <button class="edit-btn" onclick="editItem('${item.id}')">Edit</button>
                <button class="delete-btn" onclick="deleteItem('${item.id}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

function openAddItemModal() {
    document.getElementById('item-form').reset();
    document.getElementById('item-id').value = '';
    document.getElementById('modal-title').innerText = 'Add Menu Item';
    document.getElementById('item-modal').classList.add('open');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('open');
}

function saveMenuItem(e) {
    e.preventDefault();
    const id = document.getElementById('item-id').value;
    const name = document.getElementById('item-name').value;
    const price = parseFloat(document.getElementById('item-price').value);
    const category = document.getElementById('item-category').value;
    const description = document.getElementById('item-description').value;
    const image = document.getElementById('item-image').value;

    if (id) {
        const item = menuItems.find(i => i.id === id);
        item.name = name;
        item.price = price;
        item.category = category;
        item.description = description;
        item.image = image;
    } else {
        menuItems.push({
            id: Date.now().toString(),
            name, price, category, description, image
        });
    }

    localStorage.setItem('menuItems', JSON.stringify(menuItems));
    renderAdminMenu();
    closeModal('item-modal');
}

function editItem(id) {
    const item = menuItems.find(i => i.id === id);
    if(item) {
        document.getElementById('item-id').value = item.id;
        document.getElementById('item-name').value = item.name;
        document.getElementById('item-price').value = item.price;
        document.getElementById('item-category').value = item.category;
        document.getElementById('item-description').value = item.description;
        document.getElementById('item-image').value = item.image;
        
        document.getElementById('modal-title').innerText = 'Edit Menu Item';
        document.getElementById('item-modal').classList.add('open');
    }
}

function deleteItem(id) {
    if(confirm('Are you sure you want to delete this item?')) {
        menuItems = menuItems.filter(i => i.id !== id);
        localStorage.setItem('menuItems', JSON.stringify(menuItems));
        renderAdminMenu();
    }
}

function loadAdminOrders() {
    const list = document.getElementById('admin-orders-list');
    if(!list) return;
    
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders = orders.sort((a,b) => b.timestamp - a.timestamp);

    if (orders.length === 0) {
        list.innerHTML = "<p>No orders yet.</p>";
        return;
    }

    list.innerHTML = orders.map(order => `
        <div class="order-card" style="margin-bottom:1rem;background:#f9f9f9;padding:1rem;">
            <h3>Order #${order.id}</h3>
            <p><strong>Customer:</strong> ${order.name} (${order.address})</p>
            <p><strong>Status:</strong> ${order.status}</p>
            <p><strong>Total:</strong> Rs ${order.total.toFixed(2)}</p>
            <p><strong>Items:</strong></p>
            <ul>
                ${order.items.map(i => `<li>${i.quantity}x ${i.name} (Rs ${i.price})</li>`).join('')}
            </ul>
            <small>${new Date(order.timestamp).toLocaleString()}</small>
        </div>
    `).join('');
}

// Configuración de Firebase (conecta tu sitio con tu base de datos)
const firebaseConfig = {
    apiKey: "AIzaSyA0LSjZohUltLII3Vnp6rH9iXbl5JByqAI",
    authDomain: "cala-92860.firebaseapp.com",
    projectId: "cala-92860",
    storageBucket: "cala-92860.firebasestorage.app",
    messagingSenderId: "899679625263",
    appId: "1:899679625263:web:3e5719635df658284de6da"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);

// Crea una referencia a la base de datos Firestore
const db = firebase.firestore();

// Variables globales
let products = []; // Lista de productos desde Firebase
let cart = JSON.parse(localStorage.getItem('calaCookiesCart')) || []; // Carrito almacenado en localStorage
let currentCategory = 'todos'; // Categoría seleccionada actualmente
let selectedProduct = null; // Producto mostrado en el modal

// Cargar productos desde Firebase
async function loadProducts() {
    try {
        console.log('Intentando cargar productos...');
        const productsSnapshot = await db.collection('productos').get(); // Obtiene los documentos de la colección
        products = [];

        // Recorre cada producto y lo agrega al array
        productsSnapshot.forEach((doc) => {
            const data = doc.data();
            console.log('Producto cargado:', doc.id, data);
            products.push({
                id: doc.id,
                name: data.name || 'Sin nombre',
                price: data.price || 0,
                category: data.category || 'galletitas',
                icon: data.icon || '🍪',
                desc: data.desc || 'Producto delicioso'
            });
        });

        console.log('Total productos cargados:', products.length);

        // Si no hay productos, muestra un mensaje
        if (products.length === 0) {
            document.getElementById('productsGrid').innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                    <p style="font-size: 1.5rem; color: #ff6bb3;">No hay productos en la base de datos</p>
                    <p style="margin-top: 1rem; color: #666;">Agrega productos a la colección "productos" en Firebase</p>
                </div>
            `;
        } else {
            renderProducts(); // Muestra los productos en la página
        }
    } catch (error) {
        // Si ocurre un error, muestra un mensaje
        console.error('Error al cargar productos:', error);
        document.getElementById('productsGrid').innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <p style="font-size: 1.5rem; color: #ff6bb3;">Error al cargar productos</p>
                <p style="margin-top: 1rem; color: #666;">${error.message}</p>
                <button onclick="loadProducts()" style="margin-top: 1rem; padding: 0.7rem 2rem; background: #ff6bb3; color: white; border: none; border-radius: 25px; cursor: pointer;">Reintentar</button>
            </div>
        `;
    }
}

// Muestra los productos en el HTML
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    
    // Filtra por categoría
    const filtered = currentCategory === 'todos'
        ? products
        : products.filter(p => p.category === currentCategory);

    // Crea las tarjetas de producto
    grid.innerHTML = filtered.map(product => `
        <div class="product-card" onclick="showProductModal('${product.id}')">
            <div class="product-img">${product.icon || '🍪'}</div>
            <div class="product-name">${product.name || 'Sin nombre'}</div>
            <div class="product-desc">${product.desc ? product.desc.substring(0, 70) + '...' : 'Producto delicioso'}</div>
            <div class="product-price">$${(product.price || 0).toLocaleString('es-AR')}</div>
            <button class="add-to-cart" onclick="event.stopPropagation(); addToCart('${product.id}')">
                🛒 Agregar
            </button>
        </div>
    `).join('');
}

// Muestra el modal con los detalles de un producto
window.showProductModal = function(id) {
    selectedProduct = products.find(p => p.id === id);
    if (!selectedProduct) return;
    
    const modalContent = document.querySelector('.product-modal-content');
    modalContent.innerHTML = `
        <span class="close-modal" onclick="closeProductModal()">×</span>
        <div class="modal-icon">${selectedProduct.icon}</div>
        <h2 id="modalTitle">${selectedProduct.icon} ${selectedProduct.name}</h2>
        <p id="modalDesc">${selectedProduct.desc}</p>
        <div class="modal-price" id="modalPrice">$${selectedProduct.price.toLocaleString('es-AR')}</div>
        <button class="add-to-cart" onclick="addFromModal()">🛒 Agregar al Carrito</button>
    `;
    
    document.getElementById('productModal').style.display = 'block';
};

// Cierra el modal del producto
window.closeProductModal = function() {
    document.getElementById('productModal').style.display = 'none';
};

// Agrega producto al carrito desde el modal
window.addFromModal = function() {
    if (selectedProduct) {
        addToCart(selectedProduct.id);
        closeProductModal();
    }
};

// Filtra productos por categoría
window.filterCategory = function(category, event) {
    currentCategory = category;
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
    renderProducts();
};

// Muestra una notificación temporal
function showNotification(message, icon) {
    const notification = document.createElement('div');
    notification.className = 'notification-toast';
    notification.innerHTML = `
        <span style="font-size: 2rem; margin-right: 10px;">${icon}</span>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Aparece con animación
    setTimeout(() => notification.classList.add('show'), 10);

    // Desaparece después de 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Agrega un producto al carrito
window.addToCart = function(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
        showNotification(`${product.name} (x${existingItem.quantity})`, product.icon);
    } else {
        cart.push({ ...product, quantity: 1 });
        showNotification(`${product.name} agregado al carrito`, product.icon);
    }

    updateCart();
};

// Cambia la cantidad de un producto en el carrito
window.updateQuantity = function(productId, change) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== productId);
        }
        updateCart();
    }
};

// Actualiza el contenido del carrito en pantalla
function updateCart() {
    // GUARDAR EN LOCALSTORAGE (CORRECCIÓN IMPORTANTE)
    localStorage.setItem('calaCookiesCart', JSON.stringify(cart));
    
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0); // Cantidad total
    document.getElementById('cartCount').textContent = cartCount;

    const cartItems = document.getElementById('cartItems');

    // Si el carrito está vacío
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <span class="empty-cart-emoji">🛒</span>
                <div>Tu carrito está vacío</div>
                <div style="margin-top: 10px; font-size: 16px;">Agrega algunos productos deliciosos</div>
            </div>
        `;
        document.getElementById('cartTotal').textContent = '';
    } else {
        // Si hay productos en el carrito
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.icon} ${item.name}</div>
                    <div style="color: #ff6bb3; font-weight: 900; font-size: 18px;">$${(item.price || 0).toLocaleString('es-AR')}</div>
                </div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="updateQuantity('${item.id}', -1)">−</button>
                    <span class="qty-display">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                </div>
            </div>
        `).join('');

        // Calcula el total del carrito
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        document.getElementById('cartTotal').innerHTML = `Total: $${total.toLocaleString('es-AR')}`;
    }
}

// Abre o cierra el modal del carrito
window.toggleCart = function() {
    const modal = document.getElementById('cartModal');
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
};

// Finaliza la compra
window.checkout = function() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemsList = cart.map(item => `${item.icon} ${item.name} x${item.quantity}`).join('\n');
    alert(`Gracias por tu compra:\n\n${itemsList}\n\nTotal: $${total.toLocaleString('es-AR')}\n\nTu pedido está en preparación.`);
    
    cart = []; // Vacía el carrito
    updateCart(); // Actualiza el HTML
    toggleCart(); // Cierra el modal
};

// Cierra los modales al hacer clic fuera de ellos
document.getElementById('cartModal').addEventListener('click', function(e) {
    if (e.target === this) toggleCart();
});

document.getElementById('productModal').addEventListener('click', function(e) {
    if (e.target === this) closeProductModal();
});

// Carga los productos automáticamente al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    updateCart(); // Inicializa el carrito con los datos guardados
});

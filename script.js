// CONFIGURACIÓN E INICIALIZACIÓN DE FIREBASE
// Configuración de Firebase 
const firebaseConfig = {
    apiKey: "AIzaSyA0LSjZohUltLII3Vnp6rH9iXbl5JByqAI",
    authDomain: "cala-92860.firebaseapp.com",
    projectId: "cala-92860",
    storageBucket: "cala-92860.firebasestorage.app",
    messagingSenderId: "899679625263",
    appId: "1:899679625263:web:3e5719635df658284de6da"
};

// Inicializa Firebase con los datos de arriba
firebase.initializeApp(firebaseConfig);

// Crea una referencia a la base de datos Firestore
const db = firebase.firestore();


//  VARIABLES GLOBALES
// Lista de productos que vienen desde Firebase
let products = [];

// Carrito guardado en localStorage para que persista al recargar
let cart = JSON.parse(localStorage.getItem('calaCookiesCart')) || [];

// Categoría seleccionada actualmente (para filtrar)
let currentCategory = 'todos';

// Producto que se muestra actualmente en el modal
let selectedProduct = null;



//  FUNCIÓN PARA CARGAR PRODUCTOS DESDE FIRESTORE
async function loadProducts() {
    try {
        console.log('Intentando cargar productos...');

        // Trae todos los documentos de la colección "productos"
        const productsSnapshot = await db.collection('productos').get();

        products = [];

        // Recorre cada documento y lo agrega a la lista local
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

        // Si no hay productos en Firebase → mostrar mensaje
        if (products.length === 0) {
            document.getElementById('productsGrid').innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                    <p style="font-size: 1.5rem; color: #ff6bb3;">No hay productos en la base de datos</p>
                    <p style="margin-top: 1rem; color: #666;">Agrega productos a la colección "productos" en Firebase</p>
                </div>
            `;
        } else {
            renderProducts(); // Mostrar productos en pantalla
        }

    } catch (error) {
        console.error('Error al cargar productos:', error);

        // Mensaje de error visible para el usuario
        document.getElementById('productsGrid').innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <p style="font-size: 1.5rem; color: #ff6bb3;">Error al cargar productos</p>
                <p style="margin-top: 1rem; color: #666;">${error.message}</p>
                <button onclick="loadProducts()" style="margin-top: 1rem; padding: 0.7rem 2rem; background: #ff6bb3; color: white; border: none; border-radius: 25px; cursor: pointer;">Reintentar</button>
            </div>
        `;
    }
}



//  FUNCIÓN PARA MOSTRAR PRODUCTOS EN EL HTML
function renderProducts() {
    const grid = document.getElementById('productsGrid');

    // Filtra por categoría seleccionada
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


//  MODAL DEL PRODUCTO SELECCIONADO
window.showProductModal = function(id) {

    // Buscar el producto según el ID
    selectedProduct = products.find(p => p.id === id);
    if (!selectedProduct) return;

    const modalContent = document.querySelector('.product-modal-content');

    // Rellena el modal con los datos del producto
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


// Cerrar modal
window.closeProductModal = function() {
    document.getElementById('productModal').style.display = 'none';
};


// Agregar desde el modal
window.addFromModal = function() {
    if (selectedProduct) {
        addToCart(selectedProduct.id);
        closeProductModal();
    }
};



//  FILTRAR POR CATEGORÍAS
window.filterCategory = function(category, event) {
    currentCategory = category;

    // Actualiza el botón activo visualmente
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }

    renderProducts();
};



//  NOTIFICACIÓN AL AGREGAR AL CARRITO
function showNotification(message, icon) {

    // Crea un pequeño "toast"
    const notification = document.createElement('div');
    notification.className = 'notification-toast';
    notification.innerHTML = `
        <span style="font-size: 2rem; margin-right: 10px;">${icon}</span>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    // Aparece animado
    setTimeout(() => notification.classList.add('show'), 10);

    // Desaparece luego de 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}



//  AGREGAR PRODUCTO AL CARRITO
window.addToCart = function(productId) {

    // Busca el producto
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Busca si ya está en el carrito
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
        showNotification(`${product.name} (x${existingItem.quantity})`, product.icon);
    } else {
        cart.push({ ...product, quantity: 1 });
        showNotification(`${product.name} agregado al carrito`, product.icon);
    }

    updateCart(); // Actualiza el carrito en pantalla
};


//  CAMBIAR CANTIDAD EN EL CARRITO
window.updateQuantity = function(productId, change) {

    const item = cart.find(i => i.id === productId);

    if (item) {
        item.quantity += change;

        // Si se queda en 0, se elimina
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== productId);
        }

        updateCart();
    }
};



// ACTUALIZA EL CONTENIDO DEL CARRITO
function updateCart() {

    // Guarda el carrito en localStorage (muy importante)
    localStorage.setItem('calaCookiesCart', JSON.stringify(cart));

    // Cantidad total para el ícono del carrito
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = cartCount;

    const cartItems = document.getElementById('cartItems');

    // Si está vacío
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <span class="empty-cart-emoji">🛒</span>
                <div>Tu carrito está vacío</div>
                <div style="margin-top: 10px; font-size: 16px;">Agrega algunos productos deliciosos</div>
            </div>
        `;
        document.getElementById('cartTotal').textContent = '';
    }

    // Si tiene productos
    else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">

                <div class="cart-item-info">
                    <div class="cart-item-name">${item.icon} ${item.name}</div>
                    <div style="color: #ff6bb3; font-weight: 900; font-size: 18px;">
                        $${(item.price || 0).toLocaleString('es-AR')}
                    </div>
                </div>

                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="updateQuantity('${item.id}', -1)">−</button>
                    <span class="qty-display">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                </div>

            </div>
        `).join('');

        // Total de la compra
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        document.getElementById('cartTotal').innerHTML = `Total: $${total.toLocaleString('es-AR')}`;
    }
}



//  ABRIR / CERRAR MODAL DEL CARRITO

window.toggleCart = function() {
    const modal = document.getElementById('cartModal');
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
};



//  FINALIZAR COMPRA
window.checkout = function() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemsList = cart.map(item => `${item.icon} ${item.name} x${item.quantity}`).join('\n');
    alert(`Gracias por tu compra:\n\n${itemsList}\n\nTotal: $${total.toLocaleString('es-AR')}\n\nTu pedido está en preparación.`);
    cart = []; // Vaciar carrito
    updateCart();
    toggleCart();
};



//  CERRAR MODALES AL CLICKEAR AFUERA
document.getElementById('cartModal').addEventListener('click', function(e) {
    if (e.target === this) toggleCart();
});

document.getElementById('productModal').addEventListener('click', function(e) {
    if (e.target === this) closeProductModal();
});



//  EJECUTAR AL INICIAR LA PÁGINA
document.addEventListener('DOMContentLoaded', () => {

    // Cargar productos desde Firebase
    loadProducts();

    // Actualizar carrito con datos guardados
    updateCart();
});



// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyA0LSjZohUltLII3Vnp6rH9iXbl5JByqAI",
    authDomain: "cala-92860.firebaseapp.com",
    projectId: "cala-92860",
    storageBucket: "cala-92860.firebasestorage.app",
    messagingSenderId: "899679625263",
    appId: "1:899679625263:web:3e5719635df658284de6da"
};
// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let products = [];
let cart = JSON.parse(localStorage.getItem('calaCookiesCart')) || [];
let currentCategory = 'todos';
let selectedProduct = null;

// Cargar productos desde Firebase
async function loadProducts() {
    try {
        console.log('Intentando cargar productos...');
        const productsSnapshot = await db.collection('productos').get();
        products = [];
        
        productsSnapshot.forEach((doc) => {
            const data = doc.data();
            console.log('Producto cargado:', doc.id, data);
            products.push({
                id: doc.id,
            name: data.name || 'postres',
                price: data.price || 0,
                category: data.category || 'galletitas',
                icon: data.icon || '🍪',
                desc: data.desc || 'Producto delicioso'
            });
        });
        
        console.log('Total productos cargados:', products.length);
        

        if (products.length === 0) {
            document.getElementById('productsGrid').innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                    <p style="font-size: 1.5rem; color: #ff6bb3;">No hay productos en la base de datos</p>
                    <p style="margin-top: 1rem; color: #666;">Agrega productos a la colección "productos" en Firebase</p>
                </div>
            `;
        } else {
            renderProducts();
        }
    } catch (error) {
        console.error('Error al cargar productos:', error);
        document.getElementById('productsGrid').innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <p style="font-size: 1.5rem; color: #ff6bb3;">❌ Error al cargar productos</p>
                <p style="margin-top: 1rem; color: #666;">${error.message}</p>
                <button onclick="loadProducts()" style="margin-top: 1rem; padding: 0.7rem 2rem; background: #ff6bb3; color: white; border: none; border-radius: 25px; cursor: pointer;">Reintentar</button>
            </div>
        `;
    }
}

function renderProducts() {
    const grid = document.getElementById('productsGrid');
    const filtered = currentCategory === 'todos'
        ? products
        : products.filter(p => p.category === currentCategory);

    grid.innerHTML = filtered.map(product => `
        <div class="product-card" onclick="showProductModal('${product.id}')">
            <div class="product-img">${product.icon || '🍪'}</div>
            <div class="product-name">${product.name || 'Sin nombre'}</div>
            <div class="product-desc">${product.desc ? product.desc.substring(0, 70) + '...' : 'Producto delicioso'}</div>
            <div class="product-price">${product.price || 0}</div>
            <button class="add-to-cart" onclick="event.stopPropagation(); addToCart('${product.id}')">
                🛒 Agregar
            </button>
        </div>
    `).join('');
}

window.showProductModal = function(id) {
    selectedProduct = products.find(p => p.id === id);
    if (!selectedProduct) return;
    
    const modalContent = document.querySelector('.product-modal-content');
    modalContent.innerHTML = `
        <span class="close-modal" onclick="closeProductModal()">×</span>
        <div class="modal-icon">${selectedProduct.icon}</div>
        <h2 id="modalTitle">${selectedProduct.icon} ${selectedProduct.name}</h2>
        <p id="modalDesc">${selectedProduct.desc}</p>
        <div class="modal-price" id="modalPrice">$${selectedProduct.price}</div>
        <button class="add-to-cart" onclick="addFromModal()">🛒 Agregar al Carrito</button>
    `;
    
    document.getElementById('productModal').style.display = 'block';
};

window.closeProductModal = function() {
    document.getElementById('productModal').style.display = 'none';
};

window.addFromModal = function() {
    if (selectedProduct) {
        addToCart(selectedProduct.id);
        closeProductModal();
    }
};

window.filterCategory = function(category) {
    currentCategory = category;
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    renderProducts();
};

// Función para mostrar notificación
function showNotification(message, icon) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = 'notification-toast';
    notification.innerHTML = `
        <span style="font-size: 2rem; margin-right: 10px;">${icon}</span>
        <span>${message}</span>
    `;
    
    // Agregar al body
    document.body.appendChild(notification);
    
    // Mostrar con animación
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Ocultar y eliminar después de 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

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

function updateCart() {
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = cartCount;

    const cartItems = document.getElementById('cartItems');

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <span class="empty-cart-emoji">🛒</span>
                <div>Tu carrito está vacío</div>
                <div style="margin-top: 10px; font-size: 16px;">¡Agrega algunos productos deliciosos!</div>
            </div>
        `;
        document.getElementById('cartTotal').textContent = '';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.icon} ${item.name}</div>
                    <div style="color: #ff6bb3; font-weight: 900; font-size: 18px;">$${item.price}</div>
                </div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="updateQuantity('${item.id}', -1)">−</button>
                    <span class="qty-display">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                </div>
            </div>
        `).join('');

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        document.getElementById('cartTotal').innerHTML = `💰 Total: $${total}`;
    }
}

window.toggleCart = function() {
    const modal = document.getElementById('cartModal');
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
};

window.checkout = function() {
    if (cart.length === 0) {
        alert('⌨ Tu carrito está vacío');
        return;
    }
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemsList = cart.map(item => `${item.icon} ${item.name} x${item.quantity}`).join('\n');
    alert(`✅ ¡Gracias por tu compra!\n\n${itemsList}\n\n💰 Total: $${total}\n\n🎉 ¡Pronto recibirás tus deliciosos productos! 🍪💕`);
    cart = [];
    updateCart();
    toggleCart();
};

// Cerrar modales al hacer clic fuera
document.getElementById('cartModal').addEventListener('click', function(e) {
    if (e.target === this) toggleCart();
});

document.getElementById('productModal').addEventListener('click', function(e) {
    if (e.target === this) closeProductModal();
});

// Cargar productos al iniciar
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});
   
        
  

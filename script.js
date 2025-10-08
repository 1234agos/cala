
    document.addEventListener('DOMContentLoaded', () => {
    const products = [
            {id: 1, name: 'Cookies Clásicas', price: 350, category: 'galletitas', icon: '🍪', desc: 'Deliciosas galletitas con chips de chocolate belga, horneadas artesanalmente. Crocantes por fuera, suaves por dentro. El sabor tradicional que todos aman.'},
            {id: 2, name: 'Cookies de Vainilla', price: 320, category: 'galletitas', icon: '🥠', desc: 'Galletitas de vainilla natural con un toque de manteca. Perfectas para acompañar tu café o té. Suaves y aromáticas.'},
            {id: 3, name: 'Cookies Red Velvet', price: 380, category: 'galletitas', icon: '❤️', desc: 'Nuestras famosas cookies con el sabor único del red velvet y chips de chocolate blanco. Un toque de elegancia en cada mordida.'},
            {id: 4, name: 'Cookies de Avena', price: 340, category: 'galletitas', icon: '🌾', desc: 'Cookies saludables de avena con pasas y un toque de canela. Perfectas para un snack nutritivo. Energía natural y deliciosa.'},
            {id: 5, name: 'Cookies Matcha', price: 390, category: 'galletitas', icon: '🍵', desc: 'Delicadas cookies con té verde matcha japonés y chips de chocolate blanco. Sabor único y sofisticado para paladares exigentes.'},
            {id: 6, name: 'Cookies Doble Chocolate', price: 380, category: 'galletitas', icon: '🍫', desc: 'Para los amantes del chocolate: masa de cacao intenso con chips de chocolate semi-amargo. Puro placer chocolatoso.'},
            {id: 7, name: 'Cookies con M&Ms', price: 360, category: 'galletitas', icon: '🌈', desc: 'Coloridas y divertidas cookies decoradas con M&Ms de colores. Perfectas para fiestas y ocasiones especiales. Alegría en cada bocado.'},
            {id: 8, name: 'Alfajores de Maicena', price: 280, category: 'galletitas', icon: '🇦🇷', desc: 'Tradicionales alfajores argentinos de maicena con dulce de leche y coco rallado. Suaves, delicados y con el sabor de siempre.'},
            {id: 9, name: 'Cookies Brownie', price: 370, category: 'galletitas', icon: '🟫', desc: 'Cookies con trozos de brownie en la masa. Intensas, húmedas y super chocolatosas. Una explosión de sabor en cada mordida.'},
            {id: 10, name: 'Cookies Limón', price: 330, category: 'galletitas', icon: '🍋', desc: 'Refrescantes cookies con ralladura de limón y glaseado cítrico. Perfectas para días calurosos. Frescura y dulzura equilibradas.'},
            {id: 11, name: 'Frappe de Chocolate', price: 450, category: 'bebidas', icon: '🥤', desc: 'Bebida helada de chocolate premium con crema batida y topping de cookies trituradas. Refrescante y energizante.'},
            {id: 12, name: 'Smoothie de Frutilla', price: 420, category: 'bebidas', icon: '🍓', desc: 'Smoothie cremoso de frutillas frescas con yogurt natural y miel. Rico en vitaminas y sabor. Salud y placer juntos.'},
            {id: 13, name: 'Milkshake Oreo', price: 480, category: 'bebidas', icon: '🥛', desc: 'Milkshake súper cremoso de helado de vainilla con galletas Oreo. Un clásico irresistible que no puede faltar.'},
            {id: 14, name: 'Café Latte Rosado', price: 380, category: 'bebidas', icon: '☕', desc: 'Café latte con un toque de sirope de rosas y espuma de leche decorada. Perfecto para fotos y para disfrutar. Arte en taza.'},
            {id: 15, name: 'Limonada Frozen', price: 350, category: 'bebidas', icon: '🍋', desc: 'Refrescante limonada frozen con menta fresca y hielo granizado. Ideal para días de calor. Refresco instantáneo.'},
            {id: 16, name: 'Té Helado de Durazno', price: 320, category: 'bebidas', icon: '🍑', desc: 'Té negro helado con sabor a durazno natural y rodajas de fruta fresca. Suave, aromático y refrescante.'},
            {id: 17, name: 'Chocolate Caliente', price: 400, category: 'bebidas', icon: '☕', desc: 'Chocolate caliente cremoso con marshmallows y crema batida. Reconfortante y delicioso. Abrazo en taza.'},
            {id: 18, name: 'Smoothie Verde', price: 430, category: 'bebidas', icon: '🥬', desc: 'Smoothie detox de espinaca, manzana verde, banana y jengibre. Saludable y energizante. Vitaminas para tu día.'},
            {id: 19, name: 'Frappe de Caramelo', price: 460, category: 'bebidas', icon: '🍮', desc: 'Bebida helada con sirope de caramelo, café y crema batida. Dulce, cremoso y adictivo. Puro placer líquido.'},
            {id: 20, name: 'Cheesecake de Frutilla', price: 550, category: 'postres', icon: '🍰', desc: 'Cheesecake suave y cremoso con base de galletas y coulis de frutillas naturales. Clásico irresistible.'},
            {id: 21, name: 'Brownie con Helado', price: 480, category: 'postres', icon: '🍫', desc: 'Brownie tibio de chocolate intenso con helado de vainilla y salsa de chocolate caliente. Contraste perfecto de temperaturas.'},
            {id: 22, name: 'Tarta de Limón', price: 520, category: 'postres', icon: '🍋', desc: 'Tarta refrescante de limón con merengue italiano y base crocante de masa dulce. Equilibrio perfecto de dulce y ácido.'},
            {id: 23, name: 'Tiramisú', price: 580, category: 'postres', icon: '🇮🇹', desc: 'Clásico postre italiano con capas de café, mascarpone y cacao en polvo. Sofisticación en cada bocado.'},
            {id: 24, name: 'Panqueques con Nutella', price: 450, category: 'postres', icon: '🥞', desc: 'Suaves panqueques rellenos de Nutella con banana y crema batida. Desayuno o postre perfecto.'},
            {id: 25, name: 'Volcán de Chocolate', price: 520, category: 'postres', icon: '🌋', desc: 'Postre caliente con centro líquido de chocolate que fluye al cortarlo. Servido con helado. Experiencia única.'},
            {id: 26, name: 'Tarta de Manzana', price: 490, category: 'postres', icon: '🍎', desc: 'Tarta casera de manzanas caramelizadas con canela y masa crujiente. Sabor tradicional reconfortante.'},
            {id: 27, name: 'Profiteroles', price: 560, category: 'postres', icon: '🥐', desc: 'Bolitas de masa choux rellenas de crema pastelera y bañadas en chocolate caliente. Elegancia francesa.'},
            {id: 28, name: 'Flan con Dulce de Leche', price: 440, category: 'postres', icon: '🍮', desc: 'Flan casero suave y cremoso con dulce de leche artesanal. Postre argentino clásico que nunca falla.'},
            {id: 29, name: 'Cookie Shake', price: 580, category: 'hibridos', icon: '🍪', desc: 'Nuestra creación especial: milkshake cremoso con cookies trituradas y topping de chips de chocolate. Lo mejor de dos mundos.'},
            {id: 30, name: 'Brownie Cookie', price: 420, category: 'hibridos', icon: '🍫', desc: 'La combinación perfecta: mitad brownie húmedo, mitad cookie crocante. Lo mejor de ambos universos.'},
            {id: 31, name: 'Cookie Cake Pop', price: 280, category: 'hibridos', icon: '🍭', desc: 'Mini pasteles en formato pop con masa de cookie, cubiertos de chocolate rosa y decorados. Perfectos para fiestas.'},
            {id: 32, name: 'Donut Cookie', price: 380, category: 'hibridos', icon: '🍩', desc: 'Innovadora fusión entre donut y cookie con glaseado de colores y sprinkles. Textura única y sorprendente.'},
            {id: 33, name: 'Cookie Cheesecake Bar', price: 450, category: 'hibridos', icon: '🍰', desc: 'Barritas con base de cookie, capa de cheesecake y topping de frutos rojos. Triple placer en un bocado.'},
            {id: 34, name: 'Ice Cream Cookie Sandwich', price: 420, category: 'hibridos', icon: '🍨', desc: 'Dos cookies gigantes con helado cremoso en el medio. Perfecto para días calurosos. Clásico veraniego.'},
            {id: 35, name: 'Cookie Waffle', price: 460, category: 'hibridos', icon: '🧇', desc: 'Waffle con masa de cookie, servido con helado y sirope de chocolate. Desayuno o postre innovador.'},
            {id: 36, name: 'Churro Cookie', price: 390, category: 'hibridos', icon: '🥨', desc: 'Cookie con sabor a churro, espolvoreada con azúcar y canela. Dulce de feria en formato cookie.'}
        ];

    let cart = [];
    let currentCategory = 'todos';
    let selectedProduct = null;

    function renderProducts() {
        const grid = document.getElementById('productsGrid');
        const filtered = currentCategory === 'todos'
            ? products
            : products.filter(p => p.category === currentCategory);

        grid.innerHTML = filtered.map(product => `
            <div class="product-card" onclick="showProductModal(${product.id})">
                <div class="product-img">${product.icon}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-desc">${product.desc.substring(0, 70)}...</div>
                <div class="product-price">${product.price}</div>
                <button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${product.id})">
                    🛒 Agregar
                </button>
            </div>
        `).join('');
    }

    window.showProductModal = function(id) {
        selectedProduct = products.find(p => p.id === id);
        document.getElementById('modalTitle').textContent = selectedProduct.icon + ' ' + selectedProduct.name;
        document.getElementById('modalIcon').textContent = selectedProduct.icon;
        document.getElementById('modalDesc').textContent = selectedProduct.desc;
        document.getElementById('modalPrice').textContent = `${selectedProduct.price}`;
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

    window.filterCategory = function(category, evt) {
        currentCategory = category;
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        if (evt && evt.currentTarget) {
            evt.currentTarget.classList.add('active');
        }
        renderProducts();
    };

    window.addToCart = function(productId) {
        const product = products.find(p => p.id === productId);
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
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
                        <div style="color: #ff6bb3; font-weight: 900; font-size: 18px;">${item.price}</div>
                    </div>
                    <div class="cart-item-controls">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                        <span class="qty-display">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
            `).join('');

            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            document.getElementById('cartTotal').innerHTML = `💰 Total: ${total}`;
        }
    }

    window.toggleCart = function() {
    const modal = document.getElementById('cartModal');
    // Alternar visibilidad del carrito
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
};

    window.checkout = function() {
        if (cart.length === 0) {
            alert('❌ Tu carrito está vacío');
            return;
        }
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const itemsList = cart.map(item => `${item.icon} ${item.name} x${item.quantity}`).join('\n');
        alert(`✅ ¡Gracias por tu compra!\n\n${itemsList}\n\n💰 Total: ${total}\n\n🎉 ¡Pronto recibirás tus deliciosos productos! 🍪💕`);
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

    // Render inicial
    renderProducts();
});

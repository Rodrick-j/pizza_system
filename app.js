// ============================================
// PIZZA DELIVERY - APLICACIÓN JAVASCRIPT
// ============================================

// ========== ESTADO GLOBAL ==========
const AppState = {
    cart: [],
    user: null,
    address: null,
    theme: 'light'
};

// ========== CARRITO ==========
class CartManager {
    constructor() {
        this.loadFromStorage();
    }

    loadFromStorage() {
        const saved = localStorage.getItem('cart');
        if (saved) {
            AppState.cart = JSON.parse(saved);
            this.updateCartUI();
        }
    }

    saveToStorage() {
        localStorage.setItem('cart', JSON.stringify(AppState.cart));
    }

    addItem(product, quantity = 1, customizations = {}) {
        const existingIndex = AppState.cart.findIndex(item =>
            item.id === product.id &&
            JSON.stringify(item.customizations) === JSON.stringify(customizations)
        );

        if (existingIndex > -1) {
            AppState.cart[existingIndex].quantity += quantity;
        } else {
            AppState.cart.push({
                ...product,
                quantity,
                customizations,
                cartId: Date.now()
            });
        }

        this.saveToStorage();
        this.updateCartUI();
        showToast('✅ Producto agregado al carrito');
    }

    removeItem(cartId) {
        AppState.cart = AppState.cart.filter(item => item.cartId !== cartId);
        this.saveToStorage();
        this.updateCartUI();
        showToast('🗑️ Producto eliminado');
    }

    updateQuantity(cartId, quantity) {
        const item = AppState.cart.find(i => i.cartId === cartId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.saveToStorage();
            this.updateCartUI();
        }
    }

    clear() {
        AppState.cart = [];
        this.saveToStorage();
        this.updateCartUI();
    }

    getTotal() {
        return AppState.cart.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }

    getItemCount() {
        return AppState.cart.reduce((count, item) => count + item.quantity, 0);
    }

    updateCartUI() {
        const count = this.getItemCount();
        const badge = document.getElementById('cartCount');
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    }
}

// ========== UTILIDADES ==========
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            ${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'toastSlideOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('es-DO', {
        style: 'currency',
        currency: 'DOP',
        minimumFractionDigits: 0
    }).format(amount);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ========== INICIALIZACIÓN ==========
const cart = new CartManager();

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar tema
    initializeTheme();

    // Cargar carrito
    cart.loadFromStorage();

    // Mobile menu
    initializeMobileMenu();
});

function initializeTheme() {
    const themeSwitch = document.getElementById('theme-switch');
    const currentTheme = localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (themeSwitch) themeSwitch.checked = true;
    }

    if (themeSwitch) {
        themeSwitch.addEventListener('change', function () {
            const theme = this.checked ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        });
    }
}

function initializeMobileMenu() {
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const navbarMenu = document.getElementById('navbarMenu');

    if (mobileBtn && navbarMenu) {
        mobileBtn.addEventListener('click', () => {
            navbarMenu.classList.toggle('active');
        });
    }
}

// ========== API SIMULADA ==========
const API = {
    async getProducts(filters = {}) {
        // En producción, esto haría una llamada real a la API
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockProducts;
    },

    async getProduct(id) {
        await new Promise(resolve => setTimeout(resolve, 300));
        return mockProducts.find(p => p.id == id);
    },

    async validateZone(lat, lng) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            valid: true,
            zone: {
                name: 'Chapinero',
                deliveryCost: 5000,
                estimatedTime: { min: 25, max: 35 }
            }
        };
    },

    async createOrder(orderData) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
            id: Date.now(),
            orderNumber: `ORD-${Date.now()}`,
            status: 'confirmed',
            ...orderData
        };
    }
};

// ========== DATOS MOCK ==========
const mockProducts = [
    {
        id: 1,
        name: 'Pizza Margarita',
        slug: 'pizza-margarita',
        description: 'Tomate, mozzarella y albahaca fresca',
        price: 750,
        category: 'pizzas',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
        rating: 4.7,
        reviews: 234,
        featured: true
    },
    {
        id: 2,
        name: 'Burger Clásica',
        slug: 'burger-clasica',
        description: 'Carne 100% res, queso cheddar, lechuga',
        price: 660,
        category: 'hamburguesas',
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400',
        rating: 4.8,
        reviews: 189,
        featured: true
    },
    {
        id: 3,
        name: 'Pizza Pepperoni',
        slug: 'pizza-pepperoni',
        description: 'Pepperoni premium, queso extra',
        price: 720,
        originalPrice: 900,
        category: 'pizzas',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
        rating: 4.9,
        reviews: 312,
        featured: true,
        discount: 20
    },
    {
        id: 4,
        name: 'Combo Familiar',
        slug: 'combo-familiar',
        description: '2 pizzas grandes + bebida 2L',
        price: 1950,
        category: 'combos',
        image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400',
        rating: 4.6,
        reviews: 98,
        featured: true,
        badge: 'Nuevo'
    }
];

// Exportar para uso global
window.cart = cart;
window.API = API;
window.showToast = showToast;
window.formatCurrency = formatCurrency;

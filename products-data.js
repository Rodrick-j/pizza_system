// ============================================
// PRODUCTOS CENTRALIZADOS
// Este archivo contiene todos los productos del sistema
// ============================================

const products = [
    { 
        id: 1, 
        name: 'Pizza Margarita', 
        description: 'Tomate, mozzarella y albahaca fresca', 
        price: 750, 
        category: 'pizzas', 
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400', 
        rating: 4.7,
        reviews: 234, 
        available: true, 
        deliveryIncluded: true 
    },
    { 
        id: 2, 
        name: 'Pizza Pepperoni', 
        description: 'Pepperoni premium y queso extra', 
        price: 720, 
        category: 'pizzas', 
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', 
        rating: 4.9,
        reviews: 312, 
        available: true, 
        deliveryIncluded: true 
    },
    { 
        id: 3, 
        name: 'Burger Clásica', 
        description: 'Carne 100% res, queso cheddar', 
        price: 660, 
        category: 'hamburguesas', 
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400', 
        rating: 4.8,
        reviews: 189, 
        available: true, 
        deliveryIncluded: false 
    },
    { 
        id: 4, 
        name: 'Coca Cola 2L', 
        description: 'Bebida refrescante', 
        price: 240, 
        category: 'bebidas', 
        image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400', 
        rating: 4.5,
        reviews: 98, 
        available: true, 
        deliveryIncluded: false 
    },
    { 
        id: 5, 
        name: 'Cheesecake', 
        description: 'Pastel de queso con frutos rojos', 
        price: 450, 
        category: 'postres', 
        image: 'https://images.unsplash.com/photo-1635327173758-85badf17f995?q=80&w=1427&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
        rating: 4.6,
        reviews: 167, 
        available: false, 
        deliveryIncluded: true 
    },
    { 
        id: 6, 
        name: 'Pizza Hawaiana', 
        description: 'Jamón, piña y queso', 
        price: 780, 
        category: 'pizzas', 
        image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400', 
        rating: 4.4,
        reviews: 145, 
        available: true, 
        deliveryIncluded: true 
    },
    { 
        id: 7, 
        name: 'Combo Vegetariano', 
        description: '7 Verduras y salsa extra', 
        price: 1000, 
        category: 'combo', 
        image: 'https://images.unsplash.com/photo-1598449426314-8b02525e8733?q=80&w=1926&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
        rating: 4.9,
        reviews: 312, 
        available: true, 
        deliveryIncluded: true 
    },
];

/**
 * Obtiene los productos más vendidos basándose en:
 * - Número de reseñas (peso: 60%)
 * - Rating/valoración (peso: 40%)
 * @param {number} limit - Número de productos a retornar
 * @returns {Array} Array de productos más vendidos
 */
function getTopSellingProducts(limit = 4) {
    // Calcular puntuación de satisfacción para cada producto
    const productsWithScore = products
        .filter(p => p.available) // Solo productos disponibles
        .map(product => {
            // Normalizar reviews (0-1) - asumiendo max 500 reviews
            const normalizedReviews = Math.min(product.reviews / 500, 1);
            
            // Normalizar rating (0-1) - rating ya está en escala 0-5
            const normalizedRating = product.rating / 5;
            
            // Calcular score: 60% reviews + 40% rating
            const satisfactionScore = (normalizedReviews * 0.6) + (normalizedRating * 0.4);
            
            return {
                ...product,
                satisfactionScore
            };
        })
        // Ordenar por score descendente
        .sort((a, b) => b.satisfactionScore - a.satisfactionScore);
    
    // Retornar los primeros N productos
    return productsWithScore.slice(0, limit);
}

/**
 * Obtiene un producto por su ID
 * @param {number} id - ID del producto
 * @returns {Object|null} Producto encontrado o null
 */
function getProductById(id) {
    return products.find(p => p.id === parseInt(id)) || null;
}

/**
 * Obtiene productos por categoría
 * @param {string} category - Nombre de la categoría
 * @returns {Array} Array de productos de la categoría
 */
function getProductsByCategory(category) {
    if (category === 'all') return products;
    return products.filter(p => p.category === category);
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.productsData = {
        products,
        getTopSellingProducts,
        getProductById,
        getProductsByCategory
    };
}

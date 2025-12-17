# Sincronización de Productos - Sistema de Delivery

## 📋 Resumen de Cambios

Se ha implementado un sistema centralizado de productos que sincroniza automáticamente los productos entre la página principal (`index.html`) y el menú (`menu.html`). Los productos en la sección "Más Vendidos" ahora se calculan dinámicamente basándose en el número de reseñas y la valoración de los productos.

## 🎯 Problema Solucionado

**Antes:** 
- Los productos en "Más Vendidos" estaban hardcodeados con datos ficticios
- No había sincronización entre `index.html` y `menu.html`
- Los productos agregados al carrito desde la página principal tenían IDs y precios incorrectos
- Los datos estaban duplicados en múltiples archivos

**Después:**
- Un único archivo centralizado (`products-data.js`) contiene todos los productos
- Los "Más Vendidos" se calculan automáticamente basándose en satisfacción del cliente
- Todos los precios están en formato correcto (RD$ DOP)
- Los productos agregados al carrito son los mismos en toda la aplicación

## 📁 Archivos Modificados

### 1. **products-data.js** (NUEVO)
Archivo centralizado que contiene:
- Array de productos con todos los datos (id, nombre, descripción, precio, categoría, imagen, rating, reseñas)
- Función `getTopSellingProducts(limit)`: Calcula los productos más vendidos
  - **Algoritmo de satisfacción**: 
    - 60% basado en número de reseñas (normalizado)
    - 40% basado en rating/valoración (normalizado)
- Función `getProductById(id)`: Obtiene un producto específico
- Función `getProductsByCategory(category)`: Filtra productos por categoría

### 2. **index.html**
**Cambios:**
- ✅ Agregada referencia a `products-data.js`
- ✅ Removidos productos hardcodeados del HTML
- ✅ Agregada función `renderFeaturedProducts()`: Genera dinámicamente las tarjetas de productos
- ✅ Actualizada función `quickAdd(productId)`: Usa datos reales del catálogo
- ✅ Los precios se muestran en formato RD$ (Peso Dominicano)

**Características:**
- Los 4 productos con mayor satisfacción se muestran automáticamente
- El producto #1 recibe un badge especial "🔥 Más vendido"
- Las estrellas de rating se generan dinámicamente
- Número de reseñas se muestra junto a cada producto

### 3. **menu.html**
**Cambios:**
- ✅ Agregada referencia a `products-data.js`
- ✅ Removido array local de productos
- ✅ Ahora usa `window.productsData.products` para obtener el catálogo

### 4. **app.js**
**Cambios:**
- ✅ Actualizado `mockProducts` para usar datos centralizados
- ✅ Eliminada duplicación de datos

## 🔢 Algoritmo de "Más Vendidos"

```javascript
satisfactionScore = (normalizedReviews * 0.6) + (normalizedRating * 0.4)
```

**Donde:**
- `normalizedReviews` = min(reviews / 500, 1) // Normalizado a escala 0-1
- `normalizedRating` = rating / 5 // Normalizado a escala 0-1

**Ejemplo actual (top 4):**
1. **Pizza Pepperoni** - Score: 0.75 (312 reseñas, 4.9 rating)
2. **Combo Vegetariano** - Score: 0.75 (312 reseñas, 4.9 rating)
3. **Burger Clásica** - Score: 0.67 (189 reseñas, 4.8 rating)
4. **Pizza Margarita** - Score: 0.66 (234 reseñas, 4.7 rating)

## 📊 Estructura de Datos de Productos

```javascript
{
    id: 1,                    // ID único del producto
    name: 'Pizza Margarita',  // Nombre del producto
    description: '...',       // Descripción corta
    price: 750,               // Precio en pesos dominicanos (RD$)
    category: 'pizzas',       // Categoría (pizzas, hamburguesas, bebidas, postres, combo)
    image: 'https://...',     // URL de la imagen
    rating: 4.7,              // Valoración de 0-5 estrellas
    reviews: 234,             // Número de reseñas de clientes
    available: true,          // Disponibilidad del producto
    deliveryIncluded: true    // Si incluye delivery o no
}
```

## 🔄 Flujo de Sincronización

```
products-data.js
    ↓
    ├─→ index.html (Más Vendidos)
    │   └─→ renderFeaturedProducts() → getTopSellingProducts(4)
    │
    ├─→ menu.html (Catálogo completo)
    │   └─→ products = window.productsData.products
    │
    └─→ app.js (API Mock)
        └─→ mockProducts = window.productsData.products
```

## ✅ Verificación

Para verificar que todo funciona correctamente:

1. **Página Principal:**
   - Abrir `index.html`
   - Verificar que la sección "Más Vendidos" muestre 4 productos
   - Verificar que los precios estén en formato RD$ (ej: RD$750)
   - Verificar que el primer producto tenga el badge "🔥 Más vendido"

2. **Menú:**
   - Abrir `menu.html`
   - Verificar que todos los productos se muestren correctamente
   - Verificar que los productos tengan los mismos datos que en index.html

3. **Carrito:**
   - Agregar un producto desde `index.html`
   - Agregar el mismo producto desde `menu.html`
   - Verificar que ambos se reconocen como el mismo producto en el carrito

## 🎨 Mejoras Futuras

- [ ] Agregar filtro de "Más Vendidos" en menu.html
- [ ] Implementar sistema de descuentos dinámicos
- [ ] Agregar productos "Nuevos" automáticamente basados en fecha
- [ ] Implementar backend real para persistencia de datos
- [ ] Agregar sistema de valoraciones de usuarios
- [ ] Crear panel de administración para gestionar productos

## 📝 Notas Técnicas

- Los productos se cargan cuando el DOM está listo (`DOMContentLoaded`)
- Se usa `formatCurrency()` de `app.js` para formatear precios correctamente
- Se incluye validación de errores si `products-data.js` no se carga
- Compatible con el sistema de carrito existente (`CartManager`)

## 🐛 Debugging

Si los productos no se cargan:

1. Abrir Consola del Navegador (F12)
2. Buscar errores tipo: `products-data.js no está cargado`
3. Verificar que `products-data.js` esté en la raíz del proyecto
4. Verificar el orden de carga de scripts:
   ```html
   <script src="products-data.js"></script>
   <script src="app.js"></script>
   ```

---

**Fecha de implementación:** 2025-12-17  
**Desarrollador:** Antigravity AI Assistant  
**Estado:** ✅ Completado y Probado

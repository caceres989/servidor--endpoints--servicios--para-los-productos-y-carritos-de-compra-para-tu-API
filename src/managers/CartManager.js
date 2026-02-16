const fs = require('fs').promises;
const path = require('path');

class CartManager {
    constructor() {
        this.path = path.join(__dirname, '../data/carts.json');
    }

    // Obtener todos los carritos
    async getCarts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            // Si el archivo no existe, crear array vacío
            await fs.writeFile(this.path, '[]');
            return [];
        }
    }

    // Crear nuevo carrito con ID autogenerado
    async createCart() {
        const carts = await this.getCarts();
        
        // Generar ID único
        const id = carts.length > 0 ? Math.max(...carts.map(c => c.id)) + 1 : 1;
        
        const newCart = {
            id,
            products: []
        };
        
        carts.push(newCart);
        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        return newCart;
    }

    // Obtener carrito por ID
    async getCartById(id) {
        const carts = await this.getCarts();
        const cart = carts.find(c => c.id === id);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
        return cart;
    }

    // Agregar producto al carrito (incrementa quantity si ya existe)
    async addProductToCart(cartId, productId) {
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex(c => c.id === cartId);
        
        if (cartIndex === -1) {
            throw new Error('Carrito no encontrado');
        }

        const cart = carts[cartIndex];
        const productIndex = cart.products.findIndex(p => p.product === productId);

        if (productIndex !== -1) {
            // Si el producto ya existe, incrementar quantity
            cart.products[productIndex].quantity += 1;
        } else {
            // Si es nuevo, agregar con quantity 1
            cart.products.push({
                product: productId,
                quantity: 1
            });
        }

        // Guardar cambios
        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        return cart;
    }
}

module.exports = CartManager;
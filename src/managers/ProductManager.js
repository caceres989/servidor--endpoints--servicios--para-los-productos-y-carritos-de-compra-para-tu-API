const fs = require('fs').promises;
const path = require('path');

class ProductManager {
    constructor() {
        this.path = path.join(__dirname, '../data/products.json');
    }

    // Leer todos los productos
    async getProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            // Si el archivo no existe, crear array vacío
            await fs.writeFile(this.path, '[]');
            return [];
        }
    }

    // Agregar nuevo producto con ID autogenerado
    async addProduct(productData) {
        const products = await this.getProducts();
        
        // Generar ID único
        const id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        
        // Validar campos obligatorios
        const { title, description, code, price, stock, category } = productData;
        if (!title || !description || !code || !price || !stock || !category) {
            throw new Error('Faltan campos obligatorios');
        }

        // Crear nuevo producto con status por defecto true
        const newProduct = {
            id,
            title,
            description,
            code,
            price: Number(price),
            status: true,
            stock: Number(stock),
            category,
            thumbnails: productData.thumbnails || []
        };

        products.push(newProduct);
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        return newProduct;
    }

    // Obtener producto por ID
    async getProductById(id) {
        const products = await this.getProducts();
        const product = products.find(p => p.id === id);
        if (!product) {
            throw new Error('Producto no encontrado');
        }
        return product;
    }

    // Actualizar producto (sin modificar ID)
    async updateProduct(id, updatedData) {
        const products = await this.getProducts();
        const index = products.findIndex(p => p.id === id);
        
        if (index === -1) {
            throw new Error('Producto no encontrado');
        }

        // Eliminar id del objeto de actualización (no se puede modificar)
        delete updatedData.id;
        
        // Actualizar producto
        products[index] = { ...products[index], ...updatedData };
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        return products[index];
    }

    // Eliminar producto
    async deleteProduct(id) {
        const products = await this.getProducts();
        const newProducts = products.filter(p => p.id !== id);
        
        if (products.length === newProducts.length) {
            throw new Error('Producto no encontrado');
        }
        
        await fs.writeFile(this.path, JSON.stringify(newProducts, null, 2));
        return { message: 'Producto eliminado' };
    }
}

module.exports = ProductManager;
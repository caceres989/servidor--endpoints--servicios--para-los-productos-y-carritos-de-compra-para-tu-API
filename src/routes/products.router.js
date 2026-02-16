const { Router } = require('express');
const ProductManager = require('../managers/ProductManager');

const router = Router();
const productManager = new ProductManager();

// GET /api/products - Listar todos los productos
router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/products/:pid - Obtener producto por ID
router.get('/:pid', async (req, res) => {
    try {
        const id = parseInt(req.params.pid);
        const product = await productManager.getProductById(id);
        res.json(product);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// POST /api/products - Crear nuevo producto
router.post('/', async (req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbnails } = req.body;
        
        // Validar campos obligatorios
        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).json({ 
                error: 'Faltan campos obligatorios: title, description, code, price, stock, category' 
            });
        }

        const newProduct = await productManager.addProduct({
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnails: thumbnails || []
        });
        
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/products/:pid - Actualizar producto
router.put('/:pid', async (req, res) => {
    try {
        const id = parseInt(req.params.pid);
        const updatedProduct = await productManager.updateProduct(id, req.body);
        res.json(updatedProduct);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// DELETE /api/products/:pid - Eliminar producto
router.delete('/:pid', async (req, res) => {
    try {
        const id = parseInt(req.params.pid);
        const result = await productManager.deleteProduct(id);
        res.json(result);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

module.exports = router;
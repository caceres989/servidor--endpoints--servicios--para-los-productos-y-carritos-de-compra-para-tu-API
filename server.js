const express = require('express');

// Importar routers
let productsRouter, cartsRouter;

try {
    productsRouter = require('./src/routes/products.router');
    console.log('✅ productsRouter cargado:', typeof productsRouter);
} catch (error) {
    console.error('❌ Error cargando productsRouter:', error.message);
}

try {
    cartsRouter = require('./src/routes/carts.router');
    console.log('✅ cartsRouter cargado:', typeof cartsRouter);
} catch (error) {
    console.error('❌ Error cargando cartsRouter:', error.message);
}

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Usar routers solo si son funciones
if (typeof productsRouter === 'function') {
    app.use('/api/products', productsRouter);
    console.log('✅ /api/products habilitado');
}

if (typeof cartsRouter === 'function') {
    app.use('/api/carts', cartsRouter);
    console.log('✅ /api/carts habilitado');
}

app.get('/', (req, res) => {
    res.send('Servidor funcionando!');
});

app.listen(PORT, () => {
    console.log(`✅ Servidor en http://localhost:${PORT}`);
});
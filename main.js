// Datos de productos (simulados)
const productos = [
    { id: 1, nombre: "Camiseta básica", precio: 19.99, categoria: "ropa", imagen: "img/camiseta.jpg" },
    { id: 2, nombre: "Pantalón jeans", precio: 39.99, categoria: "ropa", imagen: "img/jeans.jpg" },
    { id: 3, nombre: "Zapatos deportivos", precio: 59.99, categoria: "calzado", imagen: "img/zapatos.jpg" },
    { id: 4, nombre: "Reloj inteligente", precio: 129.99, categoria: "accesorios", imagen: "img/reloj.jpg" },
    { id: 5, nombre: "Mochila", precio: 45.99, categoria: "accesorios", imagen: "img/mochila.jpg" },
    { id: 6, nombre: "Gorra", precio: 14.99, categoria: "accesorios", imagen: "img/gorra.jpg" }
];

// Cargar productos en la página
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('lista-productos')) {
        cargarProductos(productos);
        setupFiltros();
    }
    
    actualizarContadorCarrito();
});

function cargarProductos(productosMostrar) {
    const contenedor = document.getElementById('lista-productos');
    contenedor.innerHTML = '';
    
    productosMostrar.forEach(producto => {
        const productoHTML = `
            <div class="card-producto">
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <div class="info">
                    <h3>${producto.nombre}</h3>
                    <p class="precio">$${producto.precio.toFixed(2)}</p>
                    <button class="btn agregar-carrito" data-id="${producto.id}">Agregar al carrito</button>
                </div>
            </div>
        `;
        contenedor.innerHTML += productoHTML;
    });
    
    // Agregar event listeners a los botones
    document.querySelectorAll('.agregar-carrito').forEach(btn => {
        btn.addEventListener('click', agregarAlCarrito);
    });
}

function setupFiltros() {
    const inputBuscar = document.getElementById('buscar');
    const selectCategoria = document.getElementById('categoria');
    
    // Llenar categorías
    const categorias = [...new Set(productos.map(p => p.categoria))];
    categorias.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
        selectCategoria.appendChild(option);
    });
    
    // Event listeners para filtros
    inputBuscar.addEventListener('input', filtrarProductos);
    selectCategoria.addEventListener('change', filtrarProductos);
}

function filtrarProductos() {
    const texto = document.getElementById('buscar').value.toLowerCase();
    const categoria = document.getElementById('categoria').value;
    
    let productosFiltrados = productos.filter(p => 
        p.nombre.toLowerCase().includes(texto)
    );
    
    if (categoria !== 'todos') {
        productosFiltrados = productosFiltrados.filter(p => p.categoria === categoria);
    }
    
    cargarProductos(productosFiltrados);
}

function agregarAlCarrito(e) {
    const id = parseInt(e.target.getAttribute('data-id'));
    const producto = productos.find(p => p.id === id);
    
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    // Verificar si el producto ya está en el carrito
    const itemExistente = carrito.find(item => item.id === id);
    
    if (itemExistente) {
        itemExistente.cantidad += 1;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }
    
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
    
    // Mostrar notificación
    alert(`${producto.nombre} se agregó al carrito`);
}

function actualizarContadorCarrito() {
    const contador = document.getElementById('contador-carrito');
    if (contador) {
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
        contador.textContent = totalItems;
    }
}

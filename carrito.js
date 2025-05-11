document.addEventListener('DOMContentLoaded', () => {
    cargarCarrito();
    
    // Event listeners
    document.getElementById('vaciar-carrito').addEventListener('click', vaciarCarrito);
});

function cargarCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const contenedor = document.getElementById('items-carrito');
    const totalElement = document.getElementById('total-carrito');
    
    contenedor.innerHTML = '';
    
    if (carrito.length === 0) {
        contenedor.innerHTML = '<p>Tu carrito está vacío</p>';
        totalElement.textContent = '0';
        return;
    }
    
    let total = 0;
    
    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        
        const itemHTML = `
            <div class="item-carrito">
                <img src="${item.imagen}" alt="${item.nombre}">
                <div class="detalles">
                    <h3>${item.nombre}</h3>
                    <p>$${item.precio.toFixed(2)} c/u</p>
                    <div class="controles">
                        <button class="btn-quitar" data-id="${item.id}">-</button>
                        <span>${item.cantidad}</span>
                        <button class="btn-agregar" data-id="${item.id}">+</button>
                    </div>
                    <p>Subtotal: $${subtotal.toFixed(2)}</p>
                </div>
                <button class="btn-eliminar" data-id="${item.id}">Eliminar</button>
            </div>
        `;
        contenedor.innerHTML += itemHTML;
    });
    
    totalElement.textContent = total.toFixed(2);
    
    // Agregar event listeners a los botones
    document.querySelectorAll('.btn-agregar').forEach(btn => {
        btn.addEventListener('click', modificarCantidad);
    });
    
    document.querySelectorAll('.btn-quitar').forEach(btn => {
        btn.addEventListener('click', modificarCantidad);
    });
    
    document.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', eliminarDelCarrito);
    });
}

function modificarCantidad(e) {
    const id = parseInt(e.target.getAttribute('data-id'));
    const esAgregar = e.target.classList.contains('btn-agregar');
    
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const itemIndex = carrito.findIndex(item => item.id === id);
    
    if (itemIndex !== -1) {
        if (esAgregar) {
            carrito[itemIndex].cantidad += 1;
        } else {
            carrito[itemIndex].cantidad -= 1;
            
            if (carrito[itemIndex].cantidad <= 0) {
                carrito.splice(itemIndex, 1);
            }
        }
        
        localStorage.setItem('carrito', JSON.stringify(carrito));
        cargarCarrito();
        
        // Actualizar contador en todas las páginas
        const contadores = document.querySelectorAll('#contador-carrito');
        const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
        contadores.forEach(contador => {
            contador.textContent = totalItems;
        });
    }
}

function eliminarDelCarrito(e) {
    const id = parseInt(e.target.getAttribute('data-id'));
    
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito = carrito.filter(item => item.id !== id);
    
    localStorage.setItem('carrito', JSON.stringify(carrito));
    cargarCarrito();
    
    // Actualizar contador en todas las páginas
    const contadores = document.querySelectorAll('#contador-carrito');
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    contadores.forEach(contador => {
        contador.textContent = totalItems;
    });
}

function vaciarCarrito() {
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
        localStorage.removeItem('carrito');
        cargarCarrito();
        
        // Actualizar contador en todas las páginas
        const contadores = document.querySelectorAll('#contador-carrito');
        contadores.forEach(contador => {
            contador.textContent = '0';
        });
    }
}

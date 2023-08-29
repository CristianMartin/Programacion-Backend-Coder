const socket = io();
const form = document.getElementById('idForm');
const prodsElement = document.getElementById('products');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const datForm = new FormData(e.target);
    const prod = Object.fromEntries(datForm);
    socket.emit('nuevoProducto', prod);
    e.target.reset();
})

socket.on('prods', (prods) => {
    prodsElement.innerHTML="";
    prods.forEach(prod => {
        prodsElement.innerHTML+=`
        <div class="card card-w ms-4">
            <div class="card-body">
                <h5 class="card-title">${prod.title}</h5>
                <p class="card-text">${prod.description}</p>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">CODE: ${prod.code}</li>
                    <li class="list-group-item">PRICE: ${prod.price}</li>
                    <li class="list-group-item">STOCK: ${prod.stock}</li>
                </ul>
            </div>
        </div>`;
    });
})
const vaciarCarrito = document.getElementById('vaciarCarrito');
const comprarCarrito = document.getElementById('comprarCarrito');

vaciarCarrito.addEventListener('submit', async event => {
    event.preventDefault();

    const datForm = new FormData(event.target);
    const cartId = (Object.fromEntries(datForm)).cartId;

    const response = await fetch(`/api/carts/${cartId}`, {
        method: 'DELETE',
        body: '',
        headers: {
            'Content-type': 'application/json'
        }
    })

    if (response.status == 200) {
        Swal.fire({
            icon: "success",
            title: "¡Carrito eliminado correctamente!",
            showConfirmButton: false,
            timer: 1500,
          });
        setTimeout(function() {location.replace('/cart');}, 600);

    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error al vaciar carrito',
            text: response.statusText
        })
    }
});

comprarCarrito.addEventListener('submit', async event => {
    event.preventDefault();

    const datForm = new FormData(event.target);
    const cartId = (Object.fromEntries(datForm)).cartId;

    const response = await fetch(`/api/tickets/${cartId}/purchase`, {
        method: 'POST',
        body: '',
        headers: {
            'Content-type': 'application/json'
        }
    })
    console.log(response)
    if (response.status == 200) {
        Swal.fire({
            icon: "success",
            title: "¡Compra realizada correctamente!",
            showConfirmButton: false,
            timer: 1500,
          });
        setTimeout(function() {location.replace('/cart');}, 600);

    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error al realziar la compra',
            text: response.statusText
        })
    }
});
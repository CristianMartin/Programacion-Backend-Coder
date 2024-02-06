const addProdToCart = async (event) => {
    event.preventDefault();
    const datForm = new FormData(event.target);
    const data = Object.fromEntries(datForm);

    if(data.login != '/') {
        const quantity = parseInt(data.quantity)

        const response = await fetch(`/api/carts/${data.cartId}/product/${data.prodId}`, {
            method: 'POST',
            body: JSON.stringify({
                quantity: quantity
            }),
            headers: {
                'Content-type': 'application/json'
            }
        })

        if (response.status == 200) {
            Swal.fire({
                icon: "success",
                title: "¡Producto agregado al carrito correctamente!",
                showConfirmButton: false,
                timer: 1500,
            });
            setTimeout(function() {location.replace('/cart');}, 600);

        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error al agregar el producto en el carrito',
                text: response.statusText
            })
        }
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Usuario no logueado',
            text: 'Debe loguearse para agregar productos a su carrito'
        })
    }
}
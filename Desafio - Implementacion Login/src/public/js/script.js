const login = document.getElementById('logout');

login.addEventListener('click', event => {

    event.preventDefault();

    fetch('/api/session/logout', {
        method: 'GET',
        headers: {
            'Content-type': 'application/json'
        }
    }).then(result => {
        console.log(result.status);
        if (result.resultado == 200) {
            Swal.fire({
                icon: 'success',
                title: 'Deslogin exitoso'
            })
            setTimeout(function() {location.replace('/');}, 900);

        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error al desloguearse',
                text: result.error
            })
        }
    })
})
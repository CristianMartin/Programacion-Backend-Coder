const closeSession = async () => {
    fetch('/api/session/logout', {
        method: 'GET',
        headers: {
            'Content-type': 'application/json'
        }
    }).then(result => {
        if (result.status == 200) {
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
}
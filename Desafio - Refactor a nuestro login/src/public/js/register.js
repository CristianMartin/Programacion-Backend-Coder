const register = document.getElementById('register');

register.addEventListener('submit', event => {

    event.preventDefault();

    const datForm = new FormData(event.target);
    const registerData = Object.fromEntries(datForm);

    fetch('/api/users/', {
        method: 'POST',
        body: JSON.stringify(registerData),
        headers: {
            'Content-type': 'application/json'
        }
    }).then(result => {
        if (result.status == 200) {
            Swal.fire({
                icon: 'success',
                title: 'Register exitoso'
            })
            setTimeout(function() {location.replace('/');}, 600);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error al realizar registrar el usuario',
                text: result.error
            })
        }
    })
})
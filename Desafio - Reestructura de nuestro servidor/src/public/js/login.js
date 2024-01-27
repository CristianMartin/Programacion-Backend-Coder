const login = document.getElementById('login');

login.addEventListener('submit', event => {

    event.preventDefault();

    const datForm = new FormData(event.target);
    const loginData = Object.fromEntries(datForm);

    fetch('/api/session/login', {
        method: 'POST',
        body: JSON.stringify(loginData),
        headers: {
            'Content-type': 'application/json'
        }
    }).then(result => {
        if (result.status == 200) {
            Swal.fire({
                icon: 'success',
                title: 'Login exitoso'
            })
            setTimeout(function() {location.replace('/');}, 600);

        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error al realizar el login',
                text: result.error
            })
        }
    })
})

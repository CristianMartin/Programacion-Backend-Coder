const login = document.getElementById('login');

login.addEventListener('submit', event => {

    event.preventDefault();

    const datForm = new FormData(login);
    const loginData = Object.fromEntries(datForm);

    fetch('/api/session/login', {
        method: 'POST',
        body: JSON.stringify(loginData),
        headers: {
            'Content-type': 'application/json'
        }
    }).then(result => result.json()).
        then(data => {
            if (data.resultado == 'Login valido') {
                Swal.fire({
                    icon: 'success',
                    title: 'Login exitoso'
                })
                setTimeout(function() {location.replace('/');}, 400);

            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al realizar el login',
                    text: data.error
                })
            }
        }
    )
})

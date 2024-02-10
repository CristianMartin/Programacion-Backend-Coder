const login = document.getElementById('login');

login.addEventListener('submit', async event => {

    event.preventDefault();

    const datForm = new FormData(event.target);
    const loginData = Object.fromEntries(datForm);

    const response = await fetch('/api/session/login', {
        method: 'POST',
        body: JSON.stringify(loginData),
        headers: {
            'Content-type': 'application/json'
        }
    })

    if (response.status == 200) {
        Swal.fire({
            icon: 'success',
            title: 'Login exitoso'
        })
        setTimeout(function() {location.replace('/all');}, 600);

    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error al realizar el login',
            text: response.statusText
        })
    }
})
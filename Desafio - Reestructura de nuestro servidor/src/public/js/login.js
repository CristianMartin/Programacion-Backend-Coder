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
        const datos = await response.json();
        console.log(datos);
        document.cookie = `jwtCookie=${datos.token}; expires=${new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toUTCString()};path=/;httpOnly=true;`
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
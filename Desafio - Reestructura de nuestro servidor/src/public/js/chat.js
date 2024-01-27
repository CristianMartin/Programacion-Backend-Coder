const socket = io();

const botonChat = document.getElementById('botonChat');
const parrafosMensajes = document.getElementById('parrafosMensajes');
const valInput = document.getElementById('chatBox');
let user;

Swal.fire({
    title: "Identificacion de usuario",
    text: "Por favor ingrese su nombre de usuario",
    input: "text",
    inputValidator: (valor) => {
        return !valor && "Ingrese su nombre de usuario valido"
    },
    allowOutsideClick: false
}).then(resultado => {
    user = resultado.value
})

botonChat.addEventListener('click', () => {
    let fechaActual = new Date().toLocaleString()

    if (valInput.value.trim().length > 0) {
        socket.emit('mensaje', { fecha: fechaActual, user: user, mensaje: valInput.value })
        valInput.value = ""
        socket.on()
    }
})

socket.on('mensajes', (arrayMensajes) => {
    parrafosMensajes.innerHTML = ""
    arrayMensajes.forEach(mensaje => {
        parrafosMensajes.innerHTML += `<p class="bg-success text-white rounded p-3 ms-3">${mensaje.fecha}: El usuario "${mensaje.user}", escribio: ${mensaje.mensaje} </p>`
    })
})
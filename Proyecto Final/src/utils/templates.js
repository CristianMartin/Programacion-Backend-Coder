export const ticketTemplate = (total, code) => {
    return `<div style="text-align:center">
                <h1>¡Muchas gracias por su compra!</h1> <br>
                <h3>Se acaba de realizar una compra por un total de $<span style="color:red">${total}</span></h4><br>

                <h2>Nro. de ticket: <h3 style="color:lightblue">${code}</h3></h2>
            </div>`
}
import chai from 'chai'
import mongoose from 'mongoose'
import supertest from 'supertest'
import __dirname from '../src/__dirname.js'
const expect = chai.expect

const requester = supertest('http://localhost:8080')

await mongoose.connect('')

describe('Test Users Session api/session', function () {
    let cookie = {}

    it("Ruta: api/session/register con metodo POST", async () => {
        const newUser = {
            first_name: "Sandra",
            last_name: "Sanchez",
            email: "sane131we@saewn131223.com",
            password: "sa@sa.com"
        }

        const { _body } = await requester.post('/api/sessions/register').send(newUser)

        expect(_body.payload).to.be.ok
    })

    it("Ruta: api/session/login con metodo POST", async () => {
        const user = {
            email: "san@san.com",
            password: "sa@sa.com"
        }

        const resultado = await requester.post('/api/sessions/login').send(user)
        const cookieResult = resultado.headers['set-cookie'][0]

        expect(cookieResult).to.be.ok

        cookie = {
            name: cookieResult.split("=")[0],
            value: cookieResult.split("=")[1]
        }

        expect(cookie.name).to.be.ok.and.equal('coderCookie')
        expect(cookie.value).to.be.ok
    })

    it("Ruta: api/session/current con metodo GET", async () => {

        const { _body } = await requester.get('/api/sessions/current')
            .set('Cookie', [`${cookie.name} = ${cookie.value}`])

        console.log(_body.payload)

        expect(_body.payload.email).to.be.equal('san@san.com')
    })

})
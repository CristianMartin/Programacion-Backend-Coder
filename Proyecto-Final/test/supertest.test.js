import "dotenv/config";
import chai from 'chai';
import supertest from 'supertest';
import { __dirname } from "../src/path.js";

const expect = chai.expect;

const requester = supertest('http://localhost:3000');

describe('Test con supertest', () => {
    let cookie;
    let pid;
    let cid;

    before(function() {
        console.log(`Ejecutando los Test - ${new Date().toLocaleTimeString()}`);
    })

    beforeEach(function () {
        console.log(`Comienza el Test! - ${new Date().toLocaleTimeString()}`);
    })

    describe('Test Users Session api/session', async () => {

        it("Resgistro un usuario, ruta: api/session/register", async () => {
            const user = {
                first_name: "Ricardo",
                last_name: "Darin",
                email: "richard@gmail.com",
                password: "rica1234",
                age:58
            }

            const { status } = await requester.post('/api/session/register').send(user);

            expect(status).to.be.eql(200);
        })

        it("Logueo un usuario, ruta: api/session/login", async () => {
            const user = {
                email: "sane131we@gmail.com",
                password: "12345"
            }

            const resultado = await requester.post('/api/session/login').send(user)
            const cookieResult = resultado.headers['set-cookie'][0]

            expect(cookieResult).to.be.ok

            cookie = {
                name: cookieResult.split("=")[0],
                value: cookieResult.split("=")[1]
            }

            expect(cookie.name).to.be.ok.and.equal('jwtCookie')
            expect(cookie.value).to.be.ok
        })

        it("Checkeo current user, tuta: api/session/current", async () => {
            const { _body } = await requester.get('/api/session/current').set('Cookie', [`${cookie.name} = ${cookie.value}`])
            
            expect(_body.user.email).to.be.equal('sane131we@gmail.com')
        })
    })

    describe("Pruebas para products", () => {

        const product = {
            title: "Disco ssd",
            description: "Disco ssd de 120gb 500mb/s",
            price: 3000,
            stock: 200,
            code: "SSD120GB",
            category: "Disco"
        }
            
        it('Test traer todos los productos', async() => {
            const { _body } = await requester.get('/api/products');
            
            expect(_body).to.have.property('respuesta').to.be.eql("OK");
            expect(_body.mensaje).to.have.property('totalPages').to.be.greaterThanOrEqual(1);
        })

        it('Test del mocking de productos', async() => {
            const { _body } = await requester.get('/api/mocking/mockingproducts');
        
            expect(_body).to.have.property('status').to.be.eql("success");
            expect(_body.products.length).to.be.eql(100);
        })

        it('Test agregar producto sin token de jwToken', async() => {
            const { _body } = await requester.post('/api/products/').send(product).set('Cookie', []);

            expect(_body).to.have.property('error').to.be.eql("jwt must be a string");
        })

        it('Test agregar producto usando jwToken', async() => {
            const { _body } = await requester.post('/api/products/').send(product).set('Cookie', [`${cookie.name} = ${cookie.value}`]);

            expect(_body).to.have.property('respuesta').to.be.eql("OK");
            expect(_body.mensaje).to.have.property('title').to.be.eql("Disco ssd");

            pid = _body.mensaje._id
        })

        it('Test agregar producto ya existente usando jwToken', async() => {
            const { _body } = await requester.post('/api/products/').send(product).set('Cookie', [`${cookie.name} = ${cookie.value}`]);

            expect(_body).to.have.property('respuesta').to.be.eql('Error de base de datos');
        })

        it('Test eliminar producto usando jwToken', async() => {
            const { _body } = await requester.del(`/api/products/${pid}`).set('Cookie', [`${cookie.name} = ${cookie.value}`]);

            expect(_body).to.have.property('respuesta').to.be.eql("OK")
            expect(_body).to.have.property('mensaje').to.be.eql('Producto eliminado');
        })
    })

    describe("Pruebas para carts", () => { 

        it('Test crear carrito', async() => {
            const { _body } = await requester.post('/api/carts').set('Cookie', [`${cookie.name} = ${cookie.value}`]);
            
            expect(_body).to.have.property('respuesta').to.be.eql("OK");
            expect(_body.mensaje).to.have.property('products').to.be.a('array');

            cid = _body.mensaje._id
        })

        it('Test traer carrito por id', async() => {
            const { _body } = await requester.get(`/api/carts/${cid}`);
            
            expect(_body).to.have.property('respuesta').to.be.eql("OK");
            expect(_body.mensaje).to.have.property('products').to.be.a('array')
        })

        it('Test actualizar carrito', async() => {
            const { _body } = await requester.put(`/api/carts/${cid}`).send([{_id: pid, quantity: 10}]).set('Cookie', [`${cookie.name} = ${cookie.value}`]);

            expect(_body).to.have.property('respuesta').to.be.eql('OK');
            expect(_body).to.have.property('mensaje').to.be.eql('Carrito actualizado');
        })

        it('Test eliminar todos los productos del carrito', async() => {
            const { _body } = await requester.delete(`/api/carts/${cid}`).set('Cookie', [`${cookie.name} = ${cookie.value}`]);

            expect(_body).to.have.property('respuesta').to.be.eql("OK");
            expect(_body).to.have.property('mensaje').to.have.eql('productos del carrito eliminado');
        })
    })
});
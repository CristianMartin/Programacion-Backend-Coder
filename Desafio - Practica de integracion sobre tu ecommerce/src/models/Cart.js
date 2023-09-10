export default class Cart {
    constructor(products) {
        this.id = Cart.newId();
        this.products = products;
    }
    
    static newId = () => { 
        this.lastId? this.lastId++ : this.lastId = 1;
        return this.lastId;
    };
}
import { Router } from "express";
import { faker } from "@faker-js/faker";

const router = Router();

router.get("/mockingproducts", async (req, res) => {
    const response = {
        status: "success",
        products: mockProducts()
    };
    
    res.status(200).send(response);
});


const mockProducts = () => {
    const products = [];

    for (let i = 0; i < 100; i++) {
        products.push({
            _id: faker.database.mongodbObjectId(),
            title: faker.commerce.productName(),
            status: false,
            price: faker.commerce.price(),
            stock: faker.random.numeric(2),
            code: faker.random.alphaNumeric(7),
            category: faker.commerce.department(),
            description: faker.commerce.productDescription(),
        });
    }
    return products;
};

export default router;
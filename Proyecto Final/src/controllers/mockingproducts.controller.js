import { faker } from "@faker-js/faker";

export const getMockingProducts = async (req, res) => {
    req.logger.http(`${new Date().toLocaleDateString()} ${req.method} en ${req.url} `);
    
    const response = {
        status: "success",
        products: mockProducts()
    };
    
    res.status(200).send(response);
}

const mockProducts = () => {
    const products = [];

    for (let i = 0; i < 100; i++) {
        products.push({
            _id: faker.database.mongodbObjectId(),
            title: faker.commerce.productName(),
            status: false,
            price: faker.commerce.price(),
            stock: faker.string.numeric(2),
            code: faker.string.alphanumeric(7),
            category: faker.commerce.department(),
            description: faker.commerce.productDescription(),
        });
    }
    return products;
};
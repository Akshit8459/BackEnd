const mongoose = require('mongoose');
const User = require('./Models/Users');
const Product = require('./Models/Products');
const { faker } = require('@faker-js/faker');

// Replace with your MongoDB URI
require('dotenv').config();
const MONGODB_URI = process.env.URL;

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Product.deleteMany({});

        // Seed Users
        const users = [];
        for (let i = 0; i < 10; i++) {
            users.push({
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
                role: i === 0 ? 'admin' : 'user' // First user is admin
            });
        }
        await User.insertMany(users);
        console.log('Inserted 10 users');

        // Seed Products
        const categories = ['Electronics', 'Books', 'Clothing', 'Home', 'Sports', 'Toys'];
        const products = [];
        for (let i = 0; i < 1000; i++) {
            products.push({
                name: faker.commerce.productName(),
                price: parseFloat(faker.commerce.price()),
                description: faker.commerce.productDescription(),
                category: faker.helpers.arrayElement(categories)
            });
        }
        await Product.insertMany(products);
        console.log('Inserted 1000 products');

        // Done
        await mongoose.disconnect();
        console.log('Database seeded and disconnected!');
    } catch (err) {
        console.error(err);
        await mongoose.disconnect();
    }
}

seed();

const mongoose = require('mongoose');
const faker = require('@faker-js/faker').faker;
const Student = require('./Schemas/StudentSchema'); // adjust path if needed

require('dotenv').config();

const MONGO_URI = process.env.URL

async function connectDB() {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB');
    } catch (err) {
        console.error('❌ MongoDB connection failed:', err);
        process.exit(1);
    }
}

async function generateStudents(count = 200) {
    const students = [];
    for (let i = 0; i < count; i++) {
        const name = faker.person.fullName();
        const age = faker.number.int({ min: 18, max: 28 });
        const email = faker.internet.email({ firstName: name.split(" ")[0], lastName: name.split(" ")[1] });
        const phoneNumber = faker.phone.number('98########');

        students.push({ name, age, email, phoneNumber });
    }
    return students;
}

async function seedDB() {
    try {
        await connectDB();
        await Student.deleteMany({});
        const sampleData = await generateStudents();
        await Student.insertMany(sampleData);
        console.log('🎉 Inserted 200 sample student records.');
        process.exit(0);
    } catch (e) {
        console.error('❌ Seeding error:', e);
        process.exit(1);
    }
}

seedDB();

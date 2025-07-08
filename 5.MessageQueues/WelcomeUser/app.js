const express=require('express');
const app=express();
require('dotenv').config();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//connect to the database
const connectDB = require('./Database/connect');
connectDB();

// Routes to log requests
const subscriberRoutes = require('./Routes/subscriberRoutes');
app.use('/api',subscriberRoutes);
app.get('/', (req, res) => {
    res.send('Welcome to the User Service!');
});



// Initialization of Server
app.listen(process.env.PORT || 3000, () => {
    console.log(`User Service is running on port ${process.env.PORT || 3000}`);
});
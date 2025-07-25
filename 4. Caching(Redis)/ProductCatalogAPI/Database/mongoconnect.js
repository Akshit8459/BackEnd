const mongoose=require('mongoose');

const connectDb=async()=>{
    try {
        await mongoose.connect(process.env.URL)
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Exit the process with failure
    }
};

module.exports=connectDb;
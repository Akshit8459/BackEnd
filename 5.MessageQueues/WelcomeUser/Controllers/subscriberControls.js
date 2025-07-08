const db=require('../Models/subcribers');
const {addJob} = require('../Services/notification');

exports.subscribeUser=async (req,res)=>{
    try {
        const {name,email,age,phone}=req.body;
        if(!name || !email || !age || !phone){
            return res.status(400).json({message:"Please provide all the required fields"});
        }
        const newSubscriber=await db.create({
            name,
            email,
            age,
            phone
        });
        console.log('New Subscriber:', newSubscriber);
        await addJob({
            name: newSubscriber.name,
            email: newSubscriber.email,
            age: newSubscriber.age,
            phone: newSubscriber.phone
        });
        res.status(201).json({message:"User subscribed successfully",data:newSubscriber});
    } catch (error) {
        console.error('Error subscribing user:', error);
        res.status(500).json({message:"Internal Server Error",error:error.message});
    }
};

exports.subscribePage=(req,res)=>{
    const htmlContent=`
    <html>
    <head>
        <title>Subscribe to our Newsletter</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                color: #333;
                padding: 20px;
            }
            h1 {
                color: #4CAF50;
            }
            form {
                background-color: #fff;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }
            form input {
                display: block;
                width: 100%;
                margin: 10px 0;
            }
            input[type="text"], input[type="email"], input[type="number"] {
                width: 100%;
                padding: 10px;
                margin: 10px 0;
                border: 1px solid #ccc;
                border-radius: 4px;
            }
            input[type="text"]:focus, input[type="email"]:focus, input[type="number"]:focus {
                border-color: #4CAF50;
                outline: none;
            }
            input[type="text"], input[type="email"], input[type="number"]::placeholder {
                color: #999;
            }
            input[type="submit"] {
                background-color: #4CAF50;
                color: white;
                padding: 10px 15px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }
            input[type="submit"]:hover {   
                background-color: #45a049;
            }
        </style>
    </head>
    <body>
        <h1>Subscribe to our Newsletter</h1>
        <form action="/api/subscribe" method="POST">
            <input type="text" name="name" placeholder="Your Name" required>
            <input type="email" name="email" placeholder="Your Email" required>
            <input type="number" name="age" placeholder="Your Age" required>
            <input type="text" name="phone" placeholder="Your Phone Number" required>
            <input type="submit" value="Subscribe">
        </form>
    </body>
</html>
    `;
    res.send(htmlContent);
};

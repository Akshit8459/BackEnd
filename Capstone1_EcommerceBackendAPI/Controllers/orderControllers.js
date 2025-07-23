const db=require('../Models/Orders')

exports.getAllOrders=async (req,res)=>{
    try{
        const id=req.user.id;
        const orders=await db.find({user:id}).populate("user", "id name email").populate('orderItems.product', "id name price category stock");
        if(!orders ||orders.length==0) {
            return res.status(200).send(`
                <html>
                    <body>
                        <h2>No orders were found.</h2>
                        <a href="/products/"><button>Buy Products</button></a>
                    </body>
                </html>
            `);
        }
        const ordersHTML = orders.map(o => `
            <div class="product">
                <h3>${o.orderItems[0].product.name}</h3>
                <p><strong>Id:</strong> ${o._id}</p>
                <p><strong>Price:</strong> ₹${o.totalAmount}</p>
                <p><strong>Status:</strong> ${o.status}</p>
                <div class="buttons">
                    <form action="/orders/${o._id}?_method=DELETE" method="POST">
                        <button class="delete">Cancel Order</button>
                    </form>
                    <form action="/payments/pay/${o._id}?_method=POST" method="POST">
                        <button class="update">Pay Now</button>
                    </form>
                    <form action="/orders/${o._id}" method="GET">
                        <button class="add-cart">View Order</button>
                    </form>
                </div>
            </div>
        `).join("");


        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>View Orders</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        padding: 20px;
                        background-color: #f4f4f4;
                    }
                    h1 {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .top-bar {
                        text-align: center;
                        margin-bottom: 30px;
                    }
                    .top-bar a button {
                        background-color: #28a745;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        font-size: 1em;
                        border-radius: 5px;
                        cursor: pointer;
                    }
                    .product-list {
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                        gap: 20px;
                    }
                    .product {
                        background: white;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0,0,0,0.1);
                    }
                    .buttons {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 8px;
                        margin-top: 12px;
                    }
                    .buttons button {
                        flex: 1 1 45%;
                        padding: 8px;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 0.85em;
                    }
                    .delete   { background-color: #ff4d4d; color: white; }
                    .update   { background-color: #ffa500; color: white; }
                    .add-cart { background-color: #007bff; color: white; }
                </style>
            </head>
            <body>
                <h1>Your Orders</h1>
                <div class="product-list">
                    ${ordersHTML}
                </div>
            </body>
            </html>
        `;

        return res.status(200).send(html);
    }catch(e){
        console.log("Error while fetching orders",e.message);
        return res.status(400).json({message:"error while fetching all orders",error:e.message});
    }
}

exports.getSingleOrder=async (req,res)=>{
    try{
        const id=req.params.id;
        const order=await db.findById(id).populate("user", "id name email").populate('orderItems.product', "id name price category stock");
        if(!order) return res.status(200).send("No Such order Exists yet")
        const html=`<!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>Order Details</title>
            <style>
                body {
                font-family: Arial, sans-serif;
                background: #f4f4f4;
                padding: 20px;
                color: #333;
                }
                .container {
                background: #fff;
                padding: 24px;
                max-width: 700px;
                margin: auto;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0,0,0,0.05);
                }
                h2 {
                text-align: center;
                margin-bottom: 24px;
                }
                .section {
                margin-bottom: 20px;
                }
                .label {
                font-weight: bold;
                margin-bottom: 4px;
                }
                .value {
                margin-bottom: 12px;
                }
                .order-item {
                border-bottom: 1px solid #ddd;
                padding: 10px 0;
                }
                .order-item:last-child {
                border-bottom: none;
                }
                .order-item .name {
                font-weight: bold;
                }
                .order-item span {
                display: inline-block;
                margin-top: 4px;
                color: #666;
                }
            </style>
            </head>
            <body>
            <div class="container">
                <h2>Order Details</h2>

                <div class="section">
                <div class="label">Order Status:</div>
                <div class="value">${order.status}</div>

                <div class="label">Total Amount:</div>
                <div class="value">₹${order.totalAmount}</div>

                <div class="label">Payment ID:</div>
                <div class="value">${order.paymentId}</div>

                <div class="label">Shipping Address:</div>
                <div class="value">${order.shippingAddress}</div>

                <div class="label">Order Placed At:</div>
                <div class="value">${order.placedAt}</div>

                <div class="label">Last Updated:</div>
                <div class="value">${order.updatedAt}</div>
                </div>

                <div class="section">
                <div class="label">Order Items:</div>
                <div class="value">
                    <div class="order-item">
                        <div class="name">${order.orderItems[0].product.name}</div>
                        <span>Quantity: ${order.orderItems[0].quantity}</span><br/>
                        <span>Price: ₹${order.orderItems[0].price}</span><br/>
                        <span>Category: ${order.orderItems[0].product.category}</span><br/>
                        <span>In Stock: ${order.orderItems[0].product.stock}</span>
                    </div>
                </div>
                </div>
            </div>
            </body>
            </html>
            `
        return res.status(200).send(html);
    }catch(e){
        console.log("Error while fetching order",e.message);
        return res.status(400).json({message:"error while fetching order",error:e.message});
    }
}

exports.deleteOrder=async (req,res)=>{
    try{
        const id=req.params.id;
        const order=await db.findByIdAndDelete(id)
        if(!order) return res.status(200).send("No Such order Exists yet")
        return res.status(200).redirect('/orders/');
    }catch(e){
        console.log("Error while deleting order",e.message);
        return res.status(400).json({message:"error while deleting order",error:e.message});
    }
}

exports.createOrder=async (req,res)=>{
    try{
        const user=req.user?._id;
        const {product,quantity,price,shippingAddress}=req.body;
        const totalAmount=quantity*price;
        const orderData = {
            user: req.user?.id, // assuming auth middleware attaches user
            orderItems: [{
                product,
                quantity,
                price
            }],
            totalAmount,
            shippingAddress:shippingAddress?shippingAddress:"HOME",
            status: "processing",        // or "PENDING" if payment comes later
            placedAt: new Date()
        };
        const order=await db.create(orderData);
        if(!order) return res.status(200).send("Error while creating this order")
        return res.status(200).redirect('/orders/');
    }catch(e){
        console.log("Error while creating order",e.message);
        return res.status(400).json({message:"error while creating order",error:e.message});
    }
}

exports.updateOrder=async (req,res)=>{
    try{
        const id=req.params.id;
        const {user,product,quantity,price,status,totalAmount,paymentId,shippingAddress,placedAt,updatedAt}=req.body;
        if(user) data.user=user;
        let items={};
        if(product) items.product=product;
        if(quantity) items.quantity=quantity;
        if(price) items.price=price;
        const orderItems=[items];
        let data={};
        data.orderItems=orderItems;
        if(totalAmount) data.totalAmount=totalAmount;
        if(shippingAddress) data.shippingAddress=shippingAddress;
        if (status) orderData.status = status;
        if (paymentId) orderData.paymentId = paymentId;
        if (updatedAt) orderData.updatedAt = Date.now();
        
        const order=await db.findByIdAndUpdate(id,{$set:data},{new:true});
        if(!order) return res.status(200).send("Error while updating this order")
        return res.status(200).json({message:"Order updated Successfully",order});
    }catch(e){
        console.log("Error while updating order",e.message);
        return res.status(400).json({message:"error while updating order",error:e.message});
    }
}
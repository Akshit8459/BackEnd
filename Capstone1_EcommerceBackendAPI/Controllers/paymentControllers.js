const db=require("../Models/Payment")
const Stripe=require('stripe')
const stripe=Stripe(process.env.STRIPE_SECRET_KEY)
const orderDb=require('../Models/Orders');
require('dotenv').config()

exports.getAllPayments=async (req,res)=>{
    try{
        const payments=await db.find({}).populate("userId", "id name email").populate('orderId', "id name price category stock");
        if(!payments ||payments.length==0) return res.status(200).send("No payment Exists yet")
        return res.status(200).json(payments);
    }catch(e){
        console.log("Error while fetching payments",e.message);
        return res.status(400).json({message:"error while payments all orders",error:e.message});
    }
}

exports.getPaymentGateway = async (req, res) => {
  try {
    const order_id = req.params.id;
    const order = await orderDb.findById(order_id);

    if (!order) {
      return res.status(404).send('Order not found');
    }

    const amount = order.totalAmount * 100;
    const currency = 'inr';

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
      metadata: {
        order_id: order._id.toString()
      }
    });

    const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
    const host = req.headers.host;
    const returnUrl = `http://${host}/payments/payment-success?order=${order._id}`;

    const paymentPage = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Secure Payment</title>
        <script src="https://js.stripe.com/v3/"></script>
        <style>
          * { box-sizing: border-box; }
          body {
            font-family: 'Segoe UI', sans-serif;
            background: #f2f2f2;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }
          .payment-container {
            background-color: #fff;
            padding: 30px 40px;
            border-radius: 8px;
            max-width: 420px;
            box-shadow: 0px 4px 20px rgba(0,0,0,0.1);
            text-align: center;
          }
          h2 { margin-bottom: 20px; }
          form { margin-top: 20px; }
          #payment-element { margin-bottom: 20px; }
          #submit {
            background-color: #556cd6;
            color: #fff;
            border: none;
            border-radius: 4px;
            font-size: 16px;
            padding: 12px 20px;
            cursor: pointer;
            width: 100%;
          }
          #submit:hover { background-color: #3b56c0; }
          #payment-message {
            margin-top: 16px;
            color: red;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="payment-container">
          <h2>Pay ₹${order.totalAmount}</h2>
          <form id="payment-form">
            <div id="payment-element"></div>
            <button id="submit">Pay</button>
            <div id="payment-message"></div>
          </form>
        </div>

        <script>
          const stripe = Stripe("${publishableKey}");
          const elements = stripe.elements({
            clientSecret: "${paymentIntent.client_secret}"
          });
          const paymentElement = elements.create('payment');
          paymentElement.mount('#payment-element');

          const form = document.getElementById('payment-form');
          const messageContainer = document.getElementById('payment-message');

          form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const { error } = await stripe.confirmPayment({
              elements,
              confirmParams: {
                return_url: "${returnUrl}"
              },
            });

            if (error) {
              messageContainer.textContent = error.message;
            } else {
              messageContainer.textContent = "Processing payment...";
            }
          });
        </script>
      </body>
      </html>
    `;

    res.status(200).send(paymentPage);
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong during payment processing.');
  }
};

exports.paymentSuccess = async (req, res) => {
  const orderId = req.query.order;

  try {
    // Optional: update order status based on success redirect (should still verify with Stripe)
    await orderDb.findByIdAndUpdate(orderId, { status: 'paid' });

    // Redirect to your orders page
    res.redirect('/orders');
  } catch (err) {
    console.error('Order status update failed:', err);
    res.status(500).send('Error processing payment success');
  }
};

exports.getSinglePayment=async (req,res)=>{
    try{
        const id=req.params.id;
        const payment=await db.findById(id).populate("userId", "id name email").populate('orderId', "id name price category stock");
        if(!payment) return res.status(200).send("No Such payment Exists yet")
        return res.status(200).json(payment);
    }catch(e){
        console.log("Error while fetching payment",e.message);
        return res.status(400).json({message:"error while fetching payment",error:e.message});
    }
}

exports.deletePayment=async (req,res)=>{
    try{
        const id=req.params.id;
        const payment=await db.findByIdAndDelete(id)
        if(!payment) return res.status(200).send("No Such order payment yet")
        return res.status(200).json({message:"Payment Deleted Successfully",payment});
    }catch(e){
        console.log("Error while deleting Payment",e.message);
        return res.status(400).json({message:"error while deleting Payment",error:e.message});
    }
}

exports.createPayment=async (req,res)=>{
    try{
        const {orderId,userId,amount,provider,status,transactionId,paymentDate,details}=req.body;
        if(!orderId || !userId || !amount || !provider || !status || !details) return res.send("All fields are required");
        const data={orderId,userId,amount,provider,status,transactionId:transactionId?transactionId:null,paymentDate:Date.now(),details};
        const payment=await db.create(data);
        if(!payment) return res.status(200).send("Error while creating this payment")
        return res.status(200).json({message:"Payment created Successfully",payment});
    }catch(e){
        console.log("Error while creating payment",e.message);
        return res.status(400).json({message:"error while creating payment",error:e.message});
    }
}

exports.updatePayment=async (req,res)=>{
    try{
        const id=req.params.id;
        const {orderId,userId,amount,provider,status,transactionId,paymentDate,details}=req.body;
        let data={};
        if(userId) data.userId=userId;
        if(orderId)data.orderId=orderId;
        if(amount) data.amount=amount;
        if(provider) data.provider=provider;
        if (status) data.status = status;
        if (transactionId) data.transactionId =transactionId;
        if (paymentDate) data.paymentDate = Date.now();
        if (details) data.details= details;

        const payment=await db.findByIdAndUpdate(id,{$set:data},{new:true});
        if(!payment) return res.status(200).send("Error while updating this payment")
        return res.status(200).json({message:"Payment updated Successfully",payment});
    }catch(e){
        console.log("Error while updating payment",e.message);
        return res.status(400).json({message:"error while updating payment",error:e.message});
    }
}
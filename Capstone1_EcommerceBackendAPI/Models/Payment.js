const mongoose= require('mongoose');

const paymentSchema=new mongoose.Schema({
    orderId:        { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    userId:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount:         { type: Number, required: true },
    provider:       { type: String, enum: ['stripe', 'paypal', 'other'], required: true },
    status:         { type: String, enum: ['initiated', 'successful', 'failed', 'refunded'], default: 'initiated' },
    paymentDate:    { type: Date, default: Date.now },
    transactionId:  { type: String },
    details:        { type: Object }
});

module.exports=mongoose.model("Payment",paymentSchema);
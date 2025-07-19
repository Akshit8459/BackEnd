const mongoose=require('mongoose');

const orderSchema=new mongoose.Schema({
    user:           { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderItems:     [{
        product:      { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity:     { type: Number, required: true },
        price:        { type: Number, required: true }
    }],
    status:         { type: String, enum: ['processing', 'paid', 'shipped', 'delivered', 'cancelled'], default: 'processing' },
    totalAmount:    { type: Number, required: true },
    paymentId:      { type: String }, // External payment reference
    shippingAddress:{ type: String, required: true },
    placedAt:       { type: Date, default: Date.now },
    updatedAt:      { type: Date, default: Date.now }
})

module.exports=mongoose.model("Order",orderSchema);
const mongoose = require('mongoose');

const DeliverySchema = new mongoose.Schema({
    deliveryDate: { type: Date, required: true },
    deliveredQty: { type: Number, required: true }
});

const OrderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderDate: { type: Date, required: true },
    invoiceNo: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    totalQty: { type: Number, required: true },
    pricePerUnit: { type: Number, required: true },
    deliveries: [DeliverySchema],
    totalDeliveredQty: { type: Number, default: 0 },
    totalPrice: { type: Number },
    status: { type: Boolean, default: false }
});

// Middleware to calculate total price and update total delivered qty and status
OrderSchema.pre('save', function (next) {
    this.totalPrice = this.totalQty * this.pricePerUnit;
    this.totalDeliveredQty = this.deliveries.reduce((acc, delivery) => acc + delivery.deliveredQty, 0);
    this.status = this.totalDeliveredQty >= this.totalQty;
    next();
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;

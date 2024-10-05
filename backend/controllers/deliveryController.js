const Order = require('../models/Order');

// Add Delivery
exports.addDelivery = async (req, res) => {
    const { deliveryDate, deliveredQty } = req.body;

    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ msg: 'Order not found' });

        if (order.user.toString() !== req.user) return res.status(403).json({ msg: 'Not authorized' });

        order.deliveries.push({ deliveryDate, deliveredQty });
        await order.save();

        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Edit Delivery
exports.updateDelivery = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        if (!order) return res.status(404).json({ msg: 'Order not found' });

        if (order.user.toString() !== req.user) return res.status(403).json({ msg: 'Not authorized' });

        const delivery = order.deliveries.id(req.params.deliveryId);
        if (!delivery) return res.status(404).json({ msg: 'Delivery not found' });

        Object.assign(delivery, req.body);
        await order.save();

        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete Delivery
exports.deleteDelivery = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        if (!order) return res.status(404).json({ msg: 'Order not found' });

        if (order.user.toString() !== req.user) return res.status(403).json({ msg: 'Not authorized' });

        order.deliveries.id(req.params.deliveryId).remove();
        await order.save();

        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

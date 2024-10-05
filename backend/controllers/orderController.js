const Order = require('../models/Order');
const ExcelJS = require('exceljs');
const path = require('path');

// Create Order
exports.createOrder = async (req, res) => {
    const { orderDate, invoiceNo, description, totalQty, pricePerUnit } = req.body;

    try {
        const order = new Order({
            user: req.user,
            orderDate,
            invoiceNo,
            description,
            totalQty,
            pricePerUnit,
            deliveries: [] // No initial deliveries
        });

        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Edit Order
exports.updateOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ msg: 'Order not found' });

        if (order.user.toString() !== req.user) return res.status(403).json({ msg: 'Not authorized' });

        Object.assign(order, req.body);
        await order.save();
        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete Order
exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ msg: 'Order not found' });

        if (order.user.toString() !== req.user) return res.status(403).json({ msg: 'Not authorized' });

        await order.remove();
        res.status(200).json({ msg: 'Order deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get All Orders with Excel URL
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user });
        const excelUrl = `${req.protocol}://${req.get('host')}/api/orders/download-excel`;

        res.status(200).json({ orders, excelUrl });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Generate Excel File for All Orders
exports.downloadExcel = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Orders');

        // Define columns
        worksheet.columns = [
            { header: 'Order Date', key: 'orderDate', width: 15 },
            { header: 'Invoice No', key: 'invoiceNo', width: 20 },
            { header: 'Description', key: 'description', width: 30 },
            { header: 'Total Qty', key: 'totalQty', width: 10 },
            { header: 'Price Per Unit', key: 'pricePerUnit', width: 15 },
            { header: 'Total Price', key: 'totalPrice', width: 15 },
            { header: 'Status', key: 'status', width: 10 }
        ];

        // Add rows
        orders.forEach(order => {
            worksheet.addRow({
                orderDate: order.orderDate,
                invoiceNo: order.invoiceNo,
                description: order.description,
                totalQty: order.totalQty,
                pricePerUnit: order.pricePerUnit,
                totalPrice: order.totalPrice,
                status: order.status ? 'Completed' : 'Pending'
            });
        });

        // Save Excel File
        const filePath = path.join(__dirname, '..', 'files', 'orders.xlsx');
        await workbook.xlsx.writeFile(filePath);

        res.download(filePath, 'orders.xlsx');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

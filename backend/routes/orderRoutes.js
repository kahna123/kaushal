const express = require('express');
const router = express.Router();
const {
    createOrder,
    updateOrder,
    deleteOrder,
    getAllOrders,
    downloadExcel
} = require('../controllers/orderController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createOrder);
router.put('/:id', authMiddleware, updateOrder);
router.delete('/:id', authMiddleware, deleteOrder);
router.get('/', authMiddleware, getAllOrders);
router.get('/download-excel', authMiddleware, downloadExcel);

module.exports = router;

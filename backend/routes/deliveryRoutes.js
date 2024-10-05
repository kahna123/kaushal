const express = require('express');
const router = express.Router();
const {
    addDelivery,
    updateDelivery,
    deleteDelivery
} = require('../controllers/deliveryController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/:id/deliveries', authMiddleware, addDelivery);
router.put('/:orderId/deliveries/:deliveryId', authMiddleware, updateDelivery);
router.delete('/:orderId/deliveries/:deliveryId', authMiddleware, deleteDelivery);

module.exports = router;

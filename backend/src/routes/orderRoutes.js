const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { protect } = require('../middleware/authMiddleware');
const {
  createOrder,
  getOrders,
  updateOrderStatus,
  deleteOrder
} = require('../controllers/orderController');

const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many orders submitted. Please try again later.' }
});

router.post('/', orderLimiter, createOrder);
router.get('/', protect, getOrders);
router.put('/:id', protect, updateOrderStatus);
router.delete('/:id', protect, deleteOrder);

module.exports = router;
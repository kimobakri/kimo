const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createCoupon,
  getCoupons,
  updateCoupon,
  validateCoupon,
  deleteCoupon,
  
} = require('../controllers/couponController');


router.post('/', protect, createCoupon);
router.get('/', protect, getCoupons);
router.put('/:id', protect, updateCoupon);
router.delete('/:id', protect, deleteCoupon);
router.post('/validate', validateCoupon);

module.exports = router;
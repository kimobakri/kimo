const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  products: {
    type: Array,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  
couponCode: {
  type: String,
  default: null
},
discount: {
  type: Number,
  default: 0
},
  city: {
  type: String,
  required: true
},
deliveryFee: {
  type: Number,
  default: 0
}
}, {
  timestamps: true
});
module.exports = mongoose.model('Order', orderSchema);
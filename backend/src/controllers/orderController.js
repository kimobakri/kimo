const Order = require('../models/order');
const Product = require('../models/Product');
const Coupon = require('../models/coupon');
const { cities, freeDeliveryThreshold } = require('../config/delivery');

// POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { customerName, phone, address, city, products, couponCode } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const cityConfig = cities.find(c => c.name === city);
    if (!cityConfig) {
      return res.status(400).json({ message: 'Invalid city' });
    }

    const orderItems = [];
    let subtotal = 0;

    for (const item of products) {
      const productId = item?.product?._id;
      const quantity = Number(item?.quantity);

      if (!productId || !Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).json({ message: 'Invalid item in cart' });
      }

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(400).json({ message: `Product not found: ${productId}` });
      }

      subtotal += product.price * quantity;
      orderItems.push({
        product: {
          _id: product._id,
          name: product.name,
          image: product.image
        },
        quantity
      });
    }

    let discount = 0;
    let appliedCouponCode = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
      const now = new Date();

      if (
        coupon &&
        coupon.isActive &&
        now >= coupon.startDate &&
        now <= coupon.endDate &&
        subtotal >= coupon.minOrderAmount
      ) {
        discount = coupon.discountType === 'percentage'
          ? (subtotal * coupon.discountValue) / 100
          : coupon.discountValue;
        discount = Math.min(discount, subtotal);
        appliedCouponCode = coupon.code;
      }
    }

    const deliveryFee = (subtotal - discount) >= freeDeliveryThreshold ? 0 : cityConfig.fee;
    const total = subtotal - discount + deliveryFee;

    const order = new Order({
      customerName,
      phone,
      address,
      city,
      products: orderItems,
      deliveryFee,
      couponCode: appliedCouponCode,
      discount,
      total
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};




const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    order.status = req.body.status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    await order.deleteOne();
    res.json({ message: 'Order deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  updateOrderStatus,
  deleteOrder
};
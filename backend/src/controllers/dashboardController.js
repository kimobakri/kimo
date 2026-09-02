const Product = require('../models/Product');
const Order = require('../models/order');

const getStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const confirmedOrders = await Order.countDocuments({ status: 'confirmed' });
    const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });

    const confirmedOrdersList = await Order.find({ status: 'confirmed' });
    const revenue = confirmedOrdersList.reduce((sum, order) => sum + order.total, 0);

    const lowStockProducts = await Product.find({ stock: { $lt: 5, $gt: 0 } });
    const outOfStockProducts = await Product.find({ stock: 0 });

    res.json({
      totalProducts,
      totalOrders,
      pendingOrders,
      confirmedOrders,
      cancelledOrders,
      revenue,
      lowStockCount: lowStockProducts.length,
      outOfStockCount: outOfStockProducts.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStats };
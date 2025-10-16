const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true 
  },
  stock: {
     type: mongoose.Schema.Types.ObjectId, 
    ref: 'Stock', 
    required: true 
  },
  type: { 
    type: String,
    enum: ['BUY', 'SELL'],
    required: true 
  },
  quantity: { 
    type: Number,
    required: true 
  },
  price: { 
    type: Number,
    required: true 
  },
  status: { 
    type: String,
    enum: ['OPEN', 'EXECUTED', 'CANCELLED'],
    default: 'EXECUTED' 
  },
  timestamp: { 
    type: Date,
    default: Date.now 
  }
});

const Order= mongoose.model('Order', orderSchema);
module.exports = Order;

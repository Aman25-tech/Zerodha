 const mongoose = require('mongoose');
  const Schema = mongoose.Schema;

const transactionSchema = new Schema({
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
  quantity: Number,
  price: Number,
  total: Number,
  date: { 
    type: Date, 
    default: Date.now }
});

const Transaction= mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
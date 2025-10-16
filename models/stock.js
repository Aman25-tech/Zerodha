  const mongoose = require('mongoose');
  const Schema = mongoose.Schema;
  
  const priceHistorySchema = new Schema({
  date: { 
    type: Date, 
    default: Date.now 
  },
  price: Number
},
 { _id: false });

const stockSchema = new mongoose.Schema({
  symbol: { 
    type: String, 
    required: true, 
    unique: true, 
    uppercase: true 
  },
  companyName: { 
    type: String, 
    required: true 
  },
  sector: String,
  currentPrice: { 
    type: Number, 
    default: 0 
  },
  changePercent: { 
    type: Number,
     default: 0 
    },
  marketCap: Number,
  logoUrl: String,
  priceHistory: [priceHistorySchema]
}, 
{ timestamps: true });

const Stock= mongoose.model('Stock', stockSchema);
module.exports = Stock;

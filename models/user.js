const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
name: { 
  type: String, 
  trim: true 
},
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true 
  },
  password: { 
    type: String, 
    required: true 
  
  },
  balance: { 
    type: Number, 
    default: 0 
  }, 
  portfolio: [{ 
    stock: { type: mongoose.Schema.Types.ObjectId, 
      ref: 'Stock' 
    },
    quantity: { 
      type: Number, 
      required: true 
    },
    avgPrice: { 
      type: Number, 
      required: true 
    }
  }],
  watchlist: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Stock' }]
}, 
{ timestamps: true });

const User= mongoose.model('User', userSchema);
module.exports = User;

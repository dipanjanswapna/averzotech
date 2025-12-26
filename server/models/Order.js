const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
    index: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity cannot be less than 1']
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative']
    }
  }],
  shippingAddress: {
    street: String,
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: String,
    postalCode: String,
    country: {
      type: String,
      default: 'Bangladesh'
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      validate: {
        validator: function(v) {
          return /^(\+88)?01[3-9]\d{8}$/.test(v);
        },
        message: 'Please provide a valid Bangladeshi phone number'
      }
    }
  },
  paymentMethod: {
    type: String,
    enum: ['bkash', 'nagad', 'cod', 'card'],
    required: [true, 'Payment method is required']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
    index: true
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
    index: true
  },
  totalAmount: {
    type: Number,
    required: true,
    min: [0, 'Total amount cannot be negative']
  },
  shippingFee: {
    type: Number,
    required: true,
    min: [0, 'Shipping fee cannot be negative']
  },
  discountCode: String,
  discountAmount: {
    type: Number,
    default: 0,
    min: [0, 'Discount amount cannot be negative']
  },
  trackingNumber: String,
  estimatedDeliveryDate: Date,
  notes: String
}, {
  timestamps: true
});

// Compound indexes
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1, paymentStatus: 1 });
orderSchema.index({ 'shippingAddress.city': 1, orderStatus: 1 });

// Calculate total amount before saving
orderSchema.pre('save', function(next) {
  if (this.isModified('items') || this.isModified('shippingFee') || this.isModified('discountAmount')) {
    const itemsTotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    this.totalAmount = itemsTotal + this.shippingFee - (this.discountAmount || 0);
  }
  next();
});

// Virtual for total quantity
orderSchema.virtual('totalQuantity').get(function() {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

// Instance method to check if order can be cancelled
orderSchema.methods.canBeCancelled = function() {
  return ['pending', 'processing'].includes(this.orderStatus);
};

// Static method to get user's order history
orderSchema.statics.getUserOrders = function(userId) {
  return this.find({ user: userId })
    .sort('-createdAt')
    .populate('items.product');
};

module.exports = mongoose.model('Order', orderSchema);

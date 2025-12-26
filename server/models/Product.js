const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  images: {
    type: [String],
    required: [true, 'At least one product image is required'],
    validate: {
      validator: function(v) {
        return v.length > 0 && v.length <= 5;
      },
      message: 'Product must have between 1 and 5 images'
    }
  },
  video: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
    index: 'text'
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative'],
    index: true
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0,
    index: true
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    trim: true,
    index: true
  },
  subCategory: {
    type: String,
    trim: true,
    index: true
  },
  brand: {
    type: String,
    trim: true,
    index: true
  },
  images: [String],
  features: [String],
  specifications: [{
    key: {
      type: String,
      required: true,
      trim: true
    },
    value: {
      type: String,
      required: true,
      trim: true
    }
  }],
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Vendor information is required'],
    index: true
  },
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    review: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
    index: true
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  salePrice: {
    type: Number,
    min: [0, 'Sale price cannot be negative'],
    index: true
  },
  saleEndDate: {
    type: Date,
    index: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes for common query patterns
productSchema.index({ category: 1, subCategory: 1, brand: 1 });
productSchema.index({ price: 1, averageRating: -1 });
productSchema.index({ isActive: 1, stock: 1 });

// Virtual for discounted price
productSchema.virtual('discountedPrice').get(function() {
  if (this.salePrice && this.saleEndDate && this.saleEndDate > Date.now()) {
    return this.salePrice;
  }
  return this.price;
});

// Pre-save middleware to update averageRating
productSchema.pre('save', function(next) {
  if (this.ratings && this.ratings.length > 0) {
    const totalRating = this.ratings.reduce((sum, item) => sum + item.rating, 0);
    this.averageRating = totalRating / this.ratings.length;
  }
  next();
});

// Static method to find available products
productSchema.statics.findAvailable = function() {
  return this.find({
    isActive: true,
    stock: { $gt: 0 }
  });
};

// Instance method to check if product is on sale
productSchema.methods.isOnSale = function() {
  return this.salePrice && 
         this.saleEndDate && 
         this.saleEndDate > Date.now();
};

module.exports = mongoose.model('Product', productSchema);

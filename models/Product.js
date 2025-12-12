const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide product name'],
        trim: true,
        maxlength: [100, 'Product name cannot be more than 100 characters']
    },
    image: {
        type: String,
        default: null
    },
    productCode: {
        type: String,
        required: [true, 'Please provide product code'],
        unique: true,
        trim: true,
        uppercase: true
    },
    price: {
        type: Number,
        required: [true, 'Please provide product price'],
        min: [0, 'Price cannot be negative']
    },
    originalPrice: {
        type: Number,
        required: true,
        min: [0, 'Original price cannot be negative']
    },
    category: {
        type: String,
        required: [true, 'Please provide product category'],
        trim: true
    },
    manufactureDate: {
        type: Date,
        required: [true, 'Please provide manufacture date']
    },
    expiryDate: {
        type: Date,
        required: [true, 'Please provide expiry date']
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'expired'],
        default: 'active'
    }
}, {
    timestamps: true
});

productSchema.index({ name: 'text', productCode: 'text' });

productSchema.pre('save', function(next) {
    if (this.expiryDate <= this.manufactureDate) {
        next(new Error('Expiry date must be after manufacture date'));
    }
    next();
});

module.exports = mongoose.model('Product', productSchema);


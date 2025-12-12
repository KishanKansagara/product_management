const Product = require('../models/Product');
const { validationResult } = require('express-validator');

const createProduct = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { name, productCode, price, category, manufactureDate, expiryDate, status } = req.body;

        const existingProduct = await Product.findOne({ productCode: productCode.toUpperCase() });
        if (existingProduct) {
            return res.status(400).json({
                success: false,
                message: 'Product with this code already exists'
            });
        }

        const productData = {
            name,
            productCode,
            price,
            originalPrice: price,
            category,
            manufactureDate,
            expiryDate,
            status: status || 'active',
            owner: req.user._id
        };

        if (req.file) {
            productData.image = req.file.filename;
        }

        const product = await Product.create(productData);

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

const getProducts = async (req, res) => {
    try {
        const { search, category, status, page = 1, limit = 10 } = req.query;

        let query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { productCode: { $regex: search, $options: 'i' } }
            ];
        }

        if (category) {
            query.category = { $regex: category, $options: 'i' };
        }

        if (status) {
            query.status = status;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const products = await Product.find(query)
            .populate('owner', 'name email')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await Product.countDocuments(query);

        res.status(200).json({
            success: true,
            count: products.length,
            total,
            totalPages: Math.ceil(total / parseInt(limit)),
            currentPage: parseInt(page),
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('owner', 'name email');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        if (product.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to update this product. Only the owner can update their products.'
            });
        }

        if (req.body.price !== undefined) {
            const newPrice = parseFloat(req.body.price);
            const originalPrice = product.originalPrice;
            const minPrice = originalPrice * 0.9;
            const maxPrice = originalPrice * 1.1;

            if (newPrice < minPrice || newPrice > maxPrice) {
                return res.status(400).json({
                    success: false,
                    message: `Price change must be within -10% to +10% of original price. Allowed range: ${minPrice.toFixed(2)} to ${maxPrice.toFixed(2)}`
                });
            }
        }

        const updateData = { ...req.body };

        if (req.file) {
            productData.image = req.file.filename;
        }

        delete updateData.owner;
        delete updateData.originalPrice;

        product = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).populate('owner', 'name email');

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        if (product.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this product. Only the owner can delete their products.'
            });
        }

        await Product.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

const getMyProducts = async (req, res) => {
    try {
        const { search, category, status, page = 1, limit = 10 } = req.query;

        let query = { owner: req.user._id };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' }, owner: req.user._id },
                { productCode: { $regex: search, $options: 'i' }, owner: req.user._id }
            ];
        }

        if (category) {
            query.category = { $regex: category, $options: 'i' };
        }

        if (status) {
            query.status = status;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const products = await Product.find(query)
            .populate('owner', 'name email')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await Product.countDocuments(query);

        res.status(200).json({
            success: true,
            count: products.length,
            total,
            totalPages: Math.ceil(total / parseInt(limit)),
            currentPage: parseInt(page),
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    getMyProducts
};


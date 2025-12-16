const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    getMyProducts
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const createProductValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Product name is required')
        .isLength({ max: 100 })
        .withMessage('Product name cannot be more than 100 characters'),
    body('productCode')
        .trim()
        .notEmpty()
        .withMessage('Product code is required'),
    body('price')
        .notEmpty()
        .withMessage('Price is required')
        .isNumeric()
        .withMessage('Price must be a number')
        .custom(value => value >= 0)
        .withMessage('Price cannot be negative'),
    body('category')
        .trim()
        .notEmpty()
        .withMessage('Category is required'),
    body('manufactureDate')
        .notEmpty()
        .withMessage('Manufacture date is required')
        .isISO8601()
        .withMessage('Please provide a valid manufacture date'),
    body('expiryDate')
        .notEmpty()
        .withMessage('Expiry date is required')
        .isISO8601()
        .withMessage('Please provide a valid expiry date')
];

const updateProductValidation = [
    body('name')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Product name cannot be more than 100 characters'),
    body('price')
        .optional()
        .isNumeric()
        .withMessage('Price must be a number')
        .custom(value => value >= 0)
        .withMessage('Price cannot be negative'),
    body('manufactureDate')
        .optional()
        .isISO8601()
        .withMessage('Please provide a valid manufacture date'),
    body('expiryDate')
        .optional()
        .isISO8601()
        .withMessage('Please provide a valid expiry date')
];

router.use(protect);

router.route('/')
    .get(getProducts)
    .post(upload.single('image'), createProductValidation, createProduct);

router.get('/my-products', getMyProducts);
router.get('/getOneProduct/:id',getProduct)
router.put('/updateProduct/:id',upload.single('image'), updateProductValidation, updateProduct)
router.delete("/deleteProduct",deleteProduct)

module.exports = router;


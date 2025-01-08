import { ProductModel } from "../models/productModel.js";
import { ApiFeatures } from "../utils/apifeatures.js";
import { TryCatchHandler, ErrorHandler } from "../utils/handlers.js";

// Get all products
export const getAllProducts = TryCatchHandler(async (req, res, next) => {
    const resultPerPage = Number(req.query.limit) || 10;
    const productCount = await ProductModel.countDocuments();

    // Get all products
    const features = new ApiFeatures(ProductModel.find(), req.query).search().filter().pagination(resultPerPage);
    const products = await features.query;

    // Return the response
    res.status(200).json({
        success: true,
        message: "Fetched all products successfully",
        data: {
            products,
            productCount,
            resultPerPage
        }
    });
});

// Get product details
export const getProductDetails = TryCatchHandler(async (req, res, next) => {
    // Get product id from request params
    const productid = req.params.id;

    // Check if the product exists in the db or not
    const productExists = await ProductModel.findById(productid);
    if (!productExists) {
        throw new ErrorHandler("Product does not exists", 404);
    }

    // Return the response
    res.status(200).json({
        success: true,
        message: "Fetched product details successfully",
        data: productExists
    });
});

// Create product (Admin)
export const createProduct = TryCatchHandler(async (req, res, next) => {
    // Create a new product
    const product = await ProductModel.create(req.body);

    // Return the response
    res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product
    });
});

// Update product (Admin)
export const updateProduct = TryCatchHandler(async (req, res, next) => {
    // Get data from request body
    const updatedProductData = req.body;

    // Get product id from request params
    const productid = req.params.id;

    // Check if the product exists in the db or not
    const productExists = await ProductModel.findById(productid);
    if (!productExists) {
        throw new ErrorHandler("Product does not exists", 404);
    }

    // Update the product
    const updatedProduct = await ProductModel.findByIdAndUpdate(productid, updatedProductData, { new: true, runValidators: true });

    // Return the response
    res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: updatedProduct
    });
});

// Delete product (Admin)
export const deleteProduct = TryCatchHandler(async (req, res, next) => {
    // Get product id from request params
    const productid = req.params.id;

    // Check if the product exists in the db or not
    const productExists = await ProductModel.findById(productid);
    if (!productExists) {
        throw new ErrorHandler("Product does not exists", 404);
    }

    // Update the product
    await productExists.deleteOne();

    // Return the response
    res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    });
});

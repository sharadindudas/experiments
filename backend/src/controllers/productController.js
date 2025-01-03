import { ProductModel } from "../models/productModel.js";

// Create product (Admin)
export const createProduct = async (req, res, next) => {
    // Create a new product
    const product = await ProductModel.create(req.body);

    // Return the response
    res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product
    });
};

// Get all products
export const getAllProducts = async (req, res) => {
    // Get all products
    const products = await ProductModel.find().lean();

    // Return the response
    res.status(200).json({
        success: true,
        message: "Fetched all products successfully",
        data: products
    });
};

// Update product (Admin)
export const updateProduct = async (req, res, next) => {
    // Get data from request body
    const updatedProductData = req.body;

    // Get product id from request params
    const productid = req.params.id;

    // Check if the product exists in the db or not
    const productExists = await ProductModel.findById(productid);
    if (!productExists) {
        res.status(404).json({
            success: false,
            message: "Product does not exists"
        });
    }

    // Update the product
    const updatedProduct = await ProductModel.findByIdAndUpdate(productid, updatedProductData, { new: true, runValidators: true });

    // Return the response
    res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: updatedProduct
    });
};

// Delete product (Admin)
export const deleteProduct = async (req, res, next) => {
    // Get product id from request params
    const productid = req.params.id;

    // Check if the product exists in the db or not
    const productExists = await ProductModel.findById(productid);
    if (!productExists) {
        res.status(404).json({
            success: false,
            message: "Product does not exists"
        });
    }

    // Update the product
    await productExists.deleteOne();

    // Return the response
    res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    });
};

// Get product details
export const getProductDetails = async (req, res, next) => {
    // Get product id from request params
    const productid = req.params.id;

    // Check if the product exists in the db or not
    const productExists = await ProductModel.findById(productid);
    if (!productExists) {
        return res.status(404).json({
            success: false,
            message: "Product does not exists"
        });
    }

    // Return the response
    res.status(200).json({
        success: true,
        message: "Fetched product details successfully",
        data: productExists
    });
};

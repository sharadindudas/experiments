import { Router } from "express";
import { createProduct, deleteProduct, getAllProducts, getProductDetails, updateProduct } from "../controllers/productController.js";

const productRouter = Router();

productRouter.route("/all").get(getAllProducts);
productRouter.route("/add").post(createProduct);
productRouter.route("/:id").put(updateProduct).delete(deleteProduct).get(getProductDetails);

export default productRouter;

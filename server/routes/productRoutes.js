import express from 'express';
import { deleteProduct, getProductData } from '../controllers/productController.js';
import { createProduct } from '../controllers/productController.js';
import { updateProduct } from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.get('/data', getProductData);
productRouter.post('/create-product', createProduct);
productRouter.put('/update-product', updateProduct);
productRouter.post('/delete-product', deleteProduct);

export default productRouter;
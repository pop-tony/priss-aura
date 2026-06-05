import productModel from "../models/productsModel.js";
import cloudinary from "../lib/cloudinary.js";

export const createProduct = async (req, res) => {
  try {
    const { name, price, image, video, quantity, description, brand, color, topSell, featured, discount } = req.body;

    // Validate required fields
    if (!name || !price || !quantity) {
      return res.status(400).json({ success: false, message: 'Missing Required Details' });
    }

    // Validate data types
    if (typeof price !== 'number' || price < 0) {
      return res.status(400).json({ success: false, message: 'Invalid price' });
    }

    if (typeof quantity !== 'number' || quantity < 1 || quantity % 1 !== 0) {
      return res.status(400).json({ success: false, message: 'Invalid quantity' });
    }

    let imageUrl, videoUrl;

    // Upload image
    if (image) {
      const uploadImg = await cloudinary.uploader.upload(image, { resource_type: 'image' });
      imageUrl = uploadImg.secure_url;
    }

    // Upload video
    if (video) {
      const uploadVid = await cloudinary.uploader.upload(video, { resource_type: 'video' });
      videoUrl = uploadVid.secure_url;
    }

    // Create product
    const product = new productModel({ name, price, quantity, description, brand, color, image: imageUrl, video: videoUrl, topSell, featured, discount });
    await product.save();

    return res.json({ success: true, message: "Product successfully added" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

export const updateProduct = async (req, res) => {
    
  try {
    const { name, price, productId, productImage, quantity, description, brand, color, video, topSell, featured, discount } = req.body;

    let updatedProduct, imageUrl, videoUrl;

    if (productImage) {
      const uploadImg = await cloudinary.uploader.upload(productImage, { resource_type: 'image' });
      imageUrl = uploadImg.secure_url;
    }

    if (video) {
      const uploadVid = await cloudinary.uploader.upload(video, { resource_type: 'video' });
      videoUrl = uploadVid.secure_url;
    }

    updatedProduct = await productModel.findByIdAndUpdate(productId,
        { name, price, quantity, description, brand, color, image: imageUrl, video: videoUrl, featured, topSell, discount },
        { new: true });
    

    if (!updatedProduct) {
      return res.json({ success: false, message: 'Product not found' });
    }

    return res.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: 'Failed to update product' });
  }
}

export const deleteProduct = async (req, res) => {

    const { productId } = req.body

  try {
    await productModel.deleteOne({ _id: productId });
    return res.json({ success: true, message: "Product Deleted!" });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: 'Failed to delete product' });
  }
}

export const getProductData = async (req, res) => {
  try {
    const products = await productModel.find();

    if (!products.length) {
      return res.json({ success: false, message: "No products found!" });
    }

    return res.json({ success: true, products });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: 'Failed to get products' });
  }
}
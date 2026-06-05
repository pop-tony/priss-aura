import mongoose from "mongoose";

const productShema = new mongoose.Schema({
    name: {type: String, required: true},
    price: {type: mongoose.Types.Decimal128, required: true},
    image: {type: String, required: true},
    video: {type: String, required: true},
    quantity: {type: Number, required: true},
    description: {type: String, default: ""},
    brand: {type: String, default: ""},
    color: {type: String, default: ""},
    featured: {type: Boolean, default: false},
    topSell: {type: Boolean, default: false},
    discount: {type: Number, default: 0},
})

const productModel = mongoose.models.products || mongoose.model('product', productShema);

export default productModel;
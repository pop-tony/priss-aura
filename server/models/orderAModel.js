import mongoose from "mongoose";

const ordersShema = new mongoose.Schema({
    customerName: {type: String, required: true},
    itemName: {type: String, required: true},
    address: {type: String, required: true},
    price: {type: String, required: true},
    phone: {type: String, required: true},
    email: {type: String, required: true},
    quantity:{type: Number, required: true},
    total:{type: Number, required: true},
    paymentRef:{type: String, required: true},
    status: {type: String, default: "order made"},
    color:{type: String},
    image:{type: String, required: true},
    size:{type: String}
},{timestamps: true},)

const orderAModel = mongoose.models.prisorders || mongoose.model('prisorders', ordersShema);

export default orderAModel;
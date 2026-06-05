import express from 'express';
import { createConsult, createOrder, createOrderA, deleteConsult, deleteOrder, getConsultData, getOrderData, getOrderDataIndividual, updateConsult, updateOrder } from '../controllers/orderControllers.js';

const orderRouter = express.Router();

orderRouter.get('/data', getOrderData);
orderRouter.get('/i-data', getOrderDataIndividual);
orderRouter.get('/c-data', getConsultData);
orderRouter.post('/create-order', createOrder);
orderRouter.post('/create-orderA', createOrderA);
orderRouter.post('/consult', createConsult);
orderRouter.put('/update-order', updateOrder);
orderRouter.put('/update-consult', updateConsult);
orderRouter.post('/delete-order', deleteOrder);
orderRouter.post('/delete-consult', deleteConsult);

export default orderRouter;
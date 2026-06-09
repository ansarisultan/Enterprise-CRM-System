import express from 'express';
import Customer from '../models/Customer.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 }).limit(10);
    res.json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to load customers' });
  }
});

router.post('/', async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Failed to create customer', error: error.message });
  }
});

export default router;

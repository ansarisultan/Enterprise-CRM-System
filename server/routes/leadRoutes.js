import express from 'express';
import Lead from '../models/Lead.js';

const router = express.Router();

// GET /api/leads - Get all leads
router.get('/', async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ message: 'Failed to fetch leads', error: error.message });
  }
});

// GET /api/leads/:id - Get single lead
router.get('/:id', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    res.json(lead);
  } catch (error) {
    console.error('Error fetching lead:', error);
    res.status(500).json({ message: 'Failed to fetch lead', error: error.message });
  }
});

// POST /api/leads - Create new lead
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, company, status } = req.body;
    
    // Check for existing lead with same email
    const existingLead = await Lead.findOne({ email: email.toLowerCase() });
    if (existingLead) {
      return res.status(400).json({ message: 'A lead with this email already exists' });
    }

    const lead = new Lead({
      name,
      email: email.toLowerCase(),
      phone,
      company,
      status,
    });

    await lead.save();
    res.status(201).json(lead);
  } catch (error) {
    console.error('Error creating lead:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: 'Validation error', errors });
    }
    res.status(500).json({ message: 'Failed to create lead', error: error.message });
  }
});

// PUT /api/leads/:id - Update lead
router.put('/:id', async (req, res) => {
  try {
    const { name, email, phone, company, status } = req.body;
    
    // Check if email is taken by another lead
    if (email) {
      const existingLead = await Lead.findOne({ 
        email: email.toLowerCase(),
        _id: { $ne: req.params.id }
      });
      if (existingLead) {
        return res.status(400).json({ message: 'A lead with this email already exists' });
      }
    }

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email: email?.toLowerCase(),
        phone,
        company,
        status,
      },
      { new: true, runValidators: true }
    );

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.json(lead);
  } catch (error) {
    console.error('Error updating lead:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: 'Validation error', errors });
    }
    res.status(500).json({ message: 'Failed to update lead', error: error.message });
  }
});

// DELETE /api/leads/:id - Delete lead
router.delete('/:id', async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Error deleting lead:', error);
    res.status(500).json({ message: 'Failed to delete lead', error: error.message });
  }
});

export default router;

import { Router } from 'express';
import { FundService } from '../services/fundService';

const router = Router();
const fundService = new FundService();

// Get all funds
router.get('/funds', (req, res) => {
  try {
    const funds = fundService.getAllFunds();
    res.json(funds);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch funds' });
  }
});

// Get single fund by name
router.get('/funds/:name', (req, res) => {
  try {
    const fund = fundService.getFundByName(req.params.name);
    if (fund) {
      res.json(fund);
    } else {
      res.status(404).json({ error: 'Fund not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch fund' });
  }
});

// Update fund
router.put('/funds/:name', (req, res) => {
  try {
    const updatedFund = fundService.updateFund(req.params.name, req.body);
    if (updatedFund) {
      res.json(updatedFund);
    } else {
      res.status(404).json({ error: 'Fund not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update fund' });
  }
});

// Delete fund
router.delete('/funds/:name', (req, res) => {
  try {
    const success = fundService.deleteFund(req.params.name);
    if (success) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Fund not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete fund' });
  }
});

export default router; 
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
    const fundName = decodeURIComponent(req.params.name);
    console.log('Getting fund with name:', fundName);
    const fund = fundService.getFundByName(fundName);
    if (fund) {
      res.json(fund);
    } else {
      console.log('Fund not found:', fundName);
      res.status(404).json({ error: 'Fund not found' });
    }
  } catch (error) {
    console.error('Error fetching fund:', error);
    res.status(500).json({ error: 'Failed to fetch fund' });
  }
});

// Update fund
router.put('/funds/:name', (req, res) => {
  try {
    const fundName = decodeURIComponent(req.params.name);
    console.log('Updating fund with name:', fundName);
    console.log('Update data:', req.body);
    const updatedFund = fundService.updateFund(fundName, req.body);
    if (updatedFund) {
      console.log('Fund updated successfully:', fundName);
      res.json(updatedFund);
    } else {
      console.log('Fund not found for update:', fundName);
      const allFunds = fundService.getAllFunds();
      console.log('Available fund names:', allFunds.map(f => f.name));
      res.status(404).json({ error: 'Fund not found' });
    }
  } catch (error) {
    console.error('Error updating fund:', error);
    res.status(500).json({ error: 'Failed to update fund' });
  }
});

// Delete fund
router.delete('/funds/:name', (req, res) => {
  try {
    const fundName = decodeURIComponent(req.params.name);
    console.log('Deleting fund with name:', fundName);
    const success = fundService.deleteFund(fundName);
    if (success) {
      console.log('Fund deleted successfully:', fundName);
      res.status(204).send();
    } else {
      console.log('Fund not found for deletion:', fundName);
      res.status(404).json({ error: 'Fund not found' });
    }
  } catch (error) {
    console.error('Error deleting fund:', error);
    res.status(500).json({ error: 'Failed to delete fund' });
  }
});

export default router; 
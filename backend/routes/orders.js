const express = require('express');
const router = express.Router();

// Get all orders
router.get('/', async (req, res) => {
  try {
    // Mock data - replace with actual database queries
    const orders = [
      { 
        _id: '1', 
        userName: 'John Smith',
        amount: 99.99,
        type: 'Membership',
        status: 'Completed',
        date: '2024-01-10'
      },
      { 
        _id: '2', 
        userName: 'Sarah Johnson',
        amount: 199.99,
        type: 'Personal Training',
        status: 'Completed',
        date: '2024-01-12'
      },
      { 
        _id: '3', 
        userName: 'Mike Davis',
        amount: 49.99,
        type: 'Supplements',
        status: 'Pending',
        date: '2024-01-11'
      }
    ];
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
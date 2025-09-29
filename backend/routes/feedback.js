const express = require('express');
const router = express.Router();

// Get all feedback
router.get('/', async (req, res) => {
  try {
    // Mock data - replace with actual database queries
    const feedback = [
      { 
        _id: '1', 
        userName: 'John Smith',
        rating: 5,
        comment: 'Excellent facilities and great trainers!',
        date: '2024-01-10',
        status: 'Reviewed'
      },
      { 
        _id: '2', 
        userName: 'Sarah Johnson',
        rating: 4,
        comment: 'Love the new equipment, but could use more yoga classes.',
        date: '2024-01-12',
        status: 'New'
      },
      { 
        _id: '3', 
        userName: 'Mike Davis',
        rating: 5,
        comment: 'Best gym in town! Highly recommended.',
        date: '2024-01-11',
        status: 'Resolved'
      }
    ];
    
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
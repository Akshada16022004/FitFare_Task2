const express = require('express');
const Member = require('../models/Member');
const router = express.Router();

router.get('/stats', async (req, res) => {
  try {
    const totalMembers = await Member.countDocuments({ status: 'active' });
    
    res.json({
      stats: {
        totalMembers,
        totalStaff: 12,
        monthlyRevenue: 15000,
        totalClasses: 45
      },
      membershipDistribution: [
        { _id: 'Basic', count: 10 },
        { _id: 'Premium', count: 5 },
        { _id: 'VIP', count: 2 }
      ],
      monthlyRevenueTrend: [
        { month: 'Jan', revenue: 12000 },
        { month: 'Feb', revenue: 15000 },
        { month: 'Mar', revenue: 18000 }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
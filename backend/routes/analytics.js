const express = require('express');
const router = express.Router();

// Get dashboard analytics
router.get('/dashboard', async (req, res) => {
  try {
    // Mock data - replace with actual database queries
    const analyticsData = {
      totalUsers: 1248,
      activeUsers: 892,
      totalRevenue: 42580,
      monthlyRevenue: 8420,
      membershipDistribution: [
        { _id: 'Basic', count: 560 },
        { _id: 'Premium', count: 437 },
        { _id: 'VIP', count: 251 }
      ],
      recentUsers: [
        { name: 'John Smith', joinDate: '2023-10-15', membership: 'Premium' },
        { name: 'Sarah Johnson', joinDate: '2023-11-20', membership: 'VIP' },
        { name: 'Mike Davis', joinDate: '2023-09-05', membership: 'Basic' }
      ]
    };
    
    res.json(analyticsData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get revenue data for charts
router.get('/revenue', async (req, res) => {
  try {
    const revenueData = [
      { month: 'Jan', revenue: 4000, orders: 45 },
      { month: 'Feb', revenue: 3000, orders: 38 },
      { month: 'Mar', revenue: 5000, orders: 52 },
      { month: 'Apr', revenue: 2780, orders: 41 },
      { month: 'May', revenue: 1890, orders: 35 },
      { month: 'Jun', revenue: 2390, orders: 42 },
    ];
    
    res.json(revenueData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
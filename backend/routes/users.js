// const express = require('express');
// const router = express.Router();

// // Get all users
// router.get('/', async (req, res) => {
//   try {
//     // Mock data - replace with actual database queries
//     const users = [
//       { 
//         _id: '1', 
//         name: 'John Smith', 
//         email: 'john@example.com', 
//         membershipType: 'Premium', 
//         status: 'Active', 
//         joinDate: '2023-10-15',
//         lastVisit: '2024-01-10'
//       },
//       { 
//         _id: '2', 
//         name: 'Sarah Johnson', 
//         email: 'sarah@example.com', 
//         membershipType: 'VIP', 
//         status: 'Active', 
//         joinDate: '2023-11-20',
//         lastVisit: '2024-01-12'
//       },
//       { 
//         _id: '3', 
//         name: 'Mike Davis', 
//         email: 'mike@example.com', 
//         membershipType: 'Basic', 
//         status: 'Active', 
//         joinDate: '2023-09-05',
//         lastVisit: '2024-01-11'
//       },
//       { 
//         _id: '4', 
//         name: 'Emily Wilson', 
//         email: 'emily@example.com', 
//         membershipType: 'Premium', 
//         status: 'Inactive', 
//         joinDate: '2023-08-12',
//         lastVisit: '2023-12-15'
//       }
//     ];
    
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get all users
router.get('/', async (req, res) => {
  try {
    // Get users from actual database
    const users = await User.find().select('-password');
    
    // If no users in database, return mock data
    if (users.length === 0) {
      const mockUsers = [
        { 
          _id: '1', 
          name: 'John Smith', 
          email: 'john@example.com', 
          membershipType: 'Premium', 
          status: 'Active', 
          joinDate: '2023-10-15',
          lastVisit: '2024-01-10'
        },
        { 
          _id: '2', 
          name: 'Sarah Johnson', 
          email: 'sarah@example.com', 
          membershipType: 'VIP', 
          status: 'Active', 
          joinDate: '2023-11-20',
          lastVisit: '2024-01-12'
        },
        { 
          _id: '3', 
          name: 'Mike Davis', 
          email: 'mike@example.com', 
          membershipType: 'Basic', 
          status: 'Active', 
          joinDate: '2023-09-05',
          lastVisit: '2024-01-11'
        },
        { 
          _id: '4', 
          name: 'Emily Wilson', 
          email: 'emily@example.com', 
          membershipType: 'Premium', 
          status: 'Inactive', 
          joinDate: '2023-08-12',
          lastVisit: '2023-12-15'
        }
      ];
      return res.json(mockUsers);
    }
    
    // Format database users to match expected structure
    const formattedUsers = users.map(user => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      membershipType: user.membershipType || 'Basic',
      status: user.status || 'Active',
      joinDate: user.createdAt || new Date(),
      lastVisit: user.lastVisit || new Date()
    }));
    
    res.json(formattedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prevent admin from deleting themselves
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete admin user' });
    }
    
    await User.findByIdAndDelete(userId);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;
    
    // Remove password from updates if present
    delete updates.password;
    
    const user = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
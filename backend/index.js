// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Test route
// app.get('/api/test', (req, res) => {
//   res.json({ message: 'Backend is working!' });
// });

// // MongoDB Connection
// const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gymdashboard';

// mongoose.connect(MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('Connected to MongoDB'))
// .catch(err => console.error('MongoDB connection error:', err));

// // Import and use routes
// app.use('/api/users', require('./routes/users'));
// app.use('/api/analytics', require('./routes/analytics'));
// app.use('/api/orders', require('./routes/orders'));
// app.use('/api/feedback', require('./routes/feedback'));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// const express = require('express');
// const mongoose = require('mongoose');
// require('dotenv').config();

// const app = express();

// // Manual CORS middleware
// app.use((req, res, next) => {
//   const allowedOrigins = [
//     'http://localhost:3000',
//     'http://localhost:5173',
//     'http://127.0.0.1:5173'
//   ];
  
//   const origin = req.headers.origin;
//   if (allowedOrigins.includes(origin)) {
//     res.header('Access-Control-Allow-Origin', origin);
//   }
  
//   res.header('Access-Control-Allow-Credentials', 'true');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
//   // Handle preflight requests
//   if (req.method === 'OPTIONS') {
//     return res.status(200).end();
//   }
  
//   next();
// });

// app.use(express.json());

// // MongoDB Connection
// const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gymdashboard';

// mongoose.connect(MONGODB_URI)
// .then(() => console.log('Connected to MongoDB'))
// .catch(err => console.error('MongoDB connection error:', err));

// // Import routes
// const authRoutes = require('./routes/auth');
// const usersRoutes = require('./routes/users');
// const analyticsRoutes = require('./routes/analytics');
// const ordersRoutes = require('./routes/orders');
// const feedbackRoutes = require('./routes/feedback');

// // Routes
// app.use('/api/auth', authRoutes.router);

// // Protected routes (require admin authentication)
// app.use('/api/users', authRoutes.authMiddleware, authRoutes.adminMiddleware, usersRoutes);
// app.use('/api/analytics', authRoutes.authMiddleware, authRoutes.adminMiddleware, analyticsRoutes);
// app.use('/api/orders', authRoutes.authMiddleware, authRoutes.adminMiddleware, ordersRoutes);
// app.use('/api/feedback', authRoutes.authMiddleware, authRoutes.adminMiddleware, feedbackRoutes);

// // Test route
// app.get('/api/test', (req, res) => {
//   res.json({ message: 'Backend is working!' });
// });

// // Create default admin user
// const createDefaultAdmin = async () => {
//   try {
//     const User = require('./models/User');
//     const adminExists = await User.findOne({ role: 'admin' });
    
//     if (!adminExists) {
//       const adminUser = new User({
//         name: 'Admin User',
//         email: 'admin@gympro.com',
//         password: 'admin123',
//         role: 'admin'
//       });
//       await adminUser.save();
//       console.log('Default admin user created: admin@gympro.com / admin123');
//     }
//   } catch (error) {
//     console.log('Admin user already exists or error:', error.message);
//   }
// };

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
//   console.log('Manual CORS middleware enabled');
//   createDefaultAdmin();
// });
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Manual CORS middleware
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  next();
});

app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const analyticsRoutes = require('./routes/analytics');
const ordersRoutes = require('./routes/orders');
const feedbackRoutes = require('./routes/feedback');

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Function to create default admin
const createDefaultAdmin = async () => {
  try {
    const User = require('./models/User');
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (!adminExists) {
      const adminUser = new User({
        name: 'Admin User',
        email: 'admin@gympro.com',
        password: 'admin123', // Ideally hash this in production
        role: 'admin'
      });
      await adminUser.save();
      console.log('Default admin user created: admin@gympro.com / admin123');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error creating default admin:', error.message);
  }
};

// MongoDB connection and server start
const startServer = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gymdashboard';
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB');

    // Routes that require connection can be registered now
    app.use('/api/auth', authRoutes.router);
    app.use('/api/users', authRoutes.authMiddleware, authRoutes.adminMiddleware, usersRoutes);
    app.use('/api/analytics', authRoutes.authMiddleware, authRoutes.adminMiddleware, analyticsRoutes);
    app.use('/api/orders', authRoutes.authMiddleware, authRoutes.adminMiddleware, ordersRoutes);
    app.use('/api/feedback', authRoutes.authMiddleware, authRoutes.adminMiddleware, feedbackRoutes);

    // Create default admin
    await createDefaultAdmin();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1); // Exit if DB connection fails
  }
};

startServer();

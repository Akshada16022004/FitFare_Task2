const mongoose = require('mongoose');
require('dotenv').config();

const checkDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gymdashboard');
    console.log('Connected to MongoDB');

    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nCollections:');
    collections.forEach(collection => {
      console.log('-', collection.name);
    });

    // Check indexes on users collection (correct method)
    console.log('\nIndexes on users collection:');
    const indexes = await mongoose.connection.db.collection('users').indexes();
    console.log(JSON.stringify(indexes, null, 2));

    // Check existing users
    console.log('\nExisting users:');
    const User = require('./models/User');
    const users = await User.find({});
    console.log(users);

    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
};

checkDatabase();
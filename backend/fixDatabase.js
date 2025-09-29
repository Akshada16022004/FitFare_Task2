const mongoose = require('mongoose');
require('dotenv').config();

const fixDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gymdashboard');
    console.log('Connected to MongoDB');

    // Drop the problematic username index
    try {
      await mongoose.connection.db.collection('users').dropIndex('username_1');
      console.log('✅ Dropped username index');
    } catch (error) {
      console.log('ℹ️  Username index already removed or not found');
    }

    // Update existing users to fix schema
    const usersCollection = mongoose.connection.db.collection('users');
    
    // For users with username but no name, copy username to name
    await usersCollection.updateMany(
      { name: { $exists: false }, username: { $exists: true } },
      { $rename: { username: 'name' } }
    );
    console.log('✅ Fixed users: moved username to name field');

    // Remove username field from all users
    await usersCollection.updateMany(
      { username: { $exists: true } },
      { $unset: { username: '' } }
    );
    console.log('✅ Removed username field from all users');

    // Ensure all users have required fields
    await usersCollection.updateMany(
      { membershipType: { $exists: false } },
      { $set: { membershipType: 'Basic' } }
    );
    console.log('✅ Added missing membershipType fields');

    await usersCollection.updateMany(
      { status: { $exists: false } },
      { $set: { status: 'Active' } }
    );
    console.log('✅ Added missing status fields');

    // Verify the fix
    const users = await usersCollection.find({}).toArray();
    console.log('\n✅ Updated users:');
    users.forEach(user => {
      console.log(`- ${user.name || 'No name'} (${user.email})`);
    });

    mongoose.connection.close();
    console.log('\n🎉 Database fixed successfully!');
  } catch (error) {
    console.error('❌ Error fixing database:', error);
    mongoose.connection.close();
  }
};

fixDatabase();
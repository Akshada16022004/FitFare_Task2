const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  specialization: {
    type: String,
    enum: ['Strength Training', 'Cardio', 'Yoga', 'Pilates', 'CrossFit', 'Nutrition'],
    required: true
  },
  hireDate: {
    type: Date,
    default: Date.now
  },
  salary: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  photo: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    maxlength: 500
  },
  certifications: [String],
  assignedMembers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Staff', staffSchema);
const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 0,
    max: 120
  },
  phone: {
    type: String,
    required: true,
    unique: true, // ✅ No duplicate phone numbers
    trim: true
  },
  allergies: {
    type: String,
    default: 'Không có'
  },
  medicalHistory: {
    type: String,
    default: 'Không có'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

patientSchema.index({ fullName: 'text', phone: 1 });

module.exports = mongoose.model('Patient12', patientSchema);

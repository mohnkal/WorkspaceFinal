
const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  resume: String, 
  dateAvailable: Date,
  desiredPay: String,
  experienceOSGI: Number,
});

module.exports = mongoose.model('JobApplication', jobApplicationSchema);

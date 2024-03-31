const JobApplication = require('../models/JobApplication');

exports.submitApplication = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, dateAvailable, desiredPay, experienceOSGI } = req.body;
    const resume = req.file;
    console.log(req.body)

    const newApplication = new JobApplication({
      firstName,
      lastName,
      email,
      phone,
      
      dateAvailable,
      desiredPay,
      experienceOSGI,
    });

    console.log(newApplication);

    await newApplication.save();

    res.status(201).json({ message: 'Job application submitted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

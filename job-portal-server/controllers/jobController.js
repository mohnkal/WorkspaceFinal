// // controllers/jobController.js
// const Job = require('../models/Job');

// const postJob = async (req, res) => {
//   const job = new Job(req.body);
//   try {
//     await job.save();
//     res.status(201).send(job);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// };

// const getAllJobs = async (req, res) => {
//   try {
//     const jobs = await Job.find({});
//     res.send(jobs);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// };

// const getJobById = async (req, res) => {
//   const id = req.params.id;
//   try {
//     const job = await Job.findById(id);
//     if (!job) {
//       return res.status(404).send({ message: "Job not found" });
//     }
//     res.send(job);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// };

// const getJobsByEmail = async (req, res) => {
//   const email = req.params.email;
//   try {
//     const jobs = await Job.find({ postedBy: email });
//     res.send(jobs);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// };

// const deleteJobById = async (req, res) => {
//   const id = req.params.id;
//   try {
//     const result = await Job.deleteOne({ _id: id });
//     res.send(result);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// };

// const updateJobById = async (req, res) => {
//   const id = req.params.id;
//   try {
//     const job = await Job.findByIdAndUpdate(id, req.body, { new: true });
//     if (!job) {
//       return res.status(404).send({ message: "Job not found" });
//     }
//     res.send(job);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// };

// module.exports = {
//   postJob,
//   getAllJobs,
//   getJobById,
//   getJobsByEmail,
//   deleteJobById,
//   updateJobById
// };

const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  addLogoUrl: {
    type: String,
    required: true,
  },
  jobPosition: {
    type: String,
    required: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  jobType: {
    type: String,
    required: true,
    enum: ["full-time", "part-time", "contract", "internship", "freelance"],
  },
  jobLocation: {
    type: String,
    required: true,
    enum: ["Remote", "office"],
  },
  jobDescription: {
    type: String,
    required: true,
  },
  aboutCompany: {
    type: String,
    required: true,
  },
  skillRequired: {
    type: [String],
    required: true,
    enum: ["JavaScript", "React"], // Valid skills
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Job", jobSchema);

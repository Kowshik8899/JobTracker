const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    company: {
      type: String,
      required: [true, "Please provide the company name"],
      trim: true,
    },
    role: {
      type: String,
      required: [true, "Please provide the job role"],
      trim: true,
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    jobType: {
      type: String,
      enum: ["internship", "fulltime", "parttime", "contract", "remote", ""],
      default: "",
    },
    salary: {
      type: String,
      trim: true,
      default: "",
    },
    companyWebsite: {
      type: String,
      trim: true,
      default: "",
    },
    applicationDate: {
      type: Date,
      default: Date.now,
    },
    deadline: {
      type: Date,
    },
    status: {
      type: String,
      required: true,
      enum: [
        "applied",
        "oa-test",
        "interview",
        "offer",
        "rejected",
        "pending",
        "wishlist",
        "withdrawn",
      ],
      default: "applied",
    },
    interviewDate: {
      type: Date,
    },
    source: {
      type: String,
      enum: [
        "linkedin",
        "naukri",
        "company",
        "referral",
        "internshala",
        "glassdoor",
        "other",
        "",
      ],
      default: "",
    },
    priority: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "medium",
    },
    contactPerson: {
      type: String,
      trim: true,
      default: "",
    },
    contactEmail: {
      type: String,
      trim: true,
      default: "",
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    resumeLink: {
      type: String,
      trim: true,
      default: "",
    },
    coverLetterLink: {
      type: String,
      trim: true,
      default: "",
    },
    skills: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries by user and status
applicationSchema.index({ user: 1, status: 1 });
applicationSchema.index({ user: 1, applicationDate: -1 });

module.exports = mongoose.model("Application", applicationSchema);

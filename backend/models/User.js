const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't return password in queries by default
    },
    goal: {
      type: String,
      enum: ["internship", "fulltime", "switch", "freelance", ""],
      default: "",
    },
    weeklyGoal: {
      type: Number,
      default: 0,
    },
    education: [
      {
        degree: { type: String, trim: true },
        institution: { type: String, trim: true },
        startDate: { type: String, trim: true },
        endDate: { type: String, trim: true },
        cgpa: { type: String, trim: true },
        achievements: { type: String, trim: true },
      },
    ],
    year: { type: String, trim: true, default: "" },
    cgpa: { type: String, trim: true, default: "" },
    location: { type: String, trim: true, default: "" },
    institution: { type: String, trim: true, default: "" },
    phone: { type: String, trim: true, default: "" },
    linkedin: { type: String, trim: true, default: "" },
    github: { type: String, trim: true, default: "" },
    professionalSummary: { type: String, trim: true, default: "" },
    technicalSkills: {
      languages: { type: [String], default: [] },
      frameworks: { type: [String], default: [] },
      concepts: { type: [String], default: [] }
    },
    workExperience: [
      {
        company: { type: String, trim: true },
        role: { type: String, trim: true },
        location: { type: String, trim: true },
        startDate: { type: String, trim: true },
        endDate: { type: String, trim: true },
        current: { type: Boolean, default: false },
        description: { type: String, trim: true }
      }
    ],
    resume: {
      fileName: { type: String, trim: true, default: "" },
      data: { type: String, default: "" } // Base64 or URL
    }
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);

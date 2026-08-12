const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, goal } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please provide name, email, and password");
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("An account with this email already exists");
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      goal: goal || "",
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        goal: user.goal,
        weeklyGoal: user.weeklyGoal,
        education: user.education || [],
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Login user & return JWT
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      res.status(400);
      throw new Error("Please provide email and password");
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select("+password");

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        goal: user.goal,
        weeklyGoal: user.weeklyGoal,
        education: user.education || [],
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        goal: user.goal,
        weeklyGoal: user.weeklyGoal,
        education: user.education || [],
        year: user.year || "",
        cgpa: user.cgpa || "",
        location: user.location || "",
        institution: user.institution || "",
        phone: user.phone || "",
        linkedin: user.linkedin || "",
        github: user.github || "",
        professionalSummary: user.professionalSummary || "",
        technicalSkills: user.technicalSkills || { languages: [], frameworks: [], concepts: [] },
        workExperience: user.workExperience || [],
        resume: user.resume || { fileName: "", data: "" },
        createdAt: user.createdAt,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update current user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      const updatableFields = [
        "name", "goal", "weeklyGoal", "education", "year", "cgpa", "location", 
        "institution", "phone", "linkedin", "github", 
        "professionalSummary", "technicalSkills", "workExperience", "resume"
      ];

      updatableFields.forEach(field => {
        if (req.body[field] !== undefined) {
          user[field] = req.body[field];
        }
      });

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        goal: updatedUser.goal,
        weeklyGoal: updatedUser.weeklyGoal,
        education: updatedUser.education || [],
        year: updatedUser.year || "",
        cgpa: updatedUser.cgpa || "",
        location: updatedUser.location || "",
        institution: updatedUser.institution || "",
        phone: updatedUser.phone || "",
        linkedin: updatedUser.linkedin || "",
        github: updatedUser.github || "",
        professionalSummary: updatedUser.professionalSummary || "",
        technicalSkills: updatedUser.technicalSkills || { languages: [], frameworks: [], concepts: [] },
        workExperience: updatedUser.workExperience || [],
        resume: updatedUser.resume || { fileName: "", data: "" },
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };

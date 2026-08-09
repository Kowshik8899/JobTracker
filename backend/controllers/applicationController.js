const Application = require("../models/Application");

// @desc    Create a new application
// @route   POST /api/applications
// @access  Private
const createApplication = async (req, res, next) => {
  try {
    const {
      company,
      role,
      location,
      jobType,
      salary,
      companyWebsite,
      applicationDate,
      deadline,
      status,
      interviewDate,
      source,
      priority,
      contactPerson,
      contactEmail,
      notes,
      resumeLink,
      coverLetterLink,
      skills,
    } = req.body;

    if (!company || !role) {
      res.status(400);
      throw new Error("Please provide company name and job role");
    }

    const application = await Application.create({
      user: req.user._id,
      company,
      role,
      location,
      jobType,
      salary,
      companyWebsite,
      applicationDate,
      deadline,
      status: status || "applied",
      interviewDate,
      source,
      priority,
      contactPerson,
      contactEmail,
      notes,
      resumeLink,
      coverLetterLink,
      skills: skills || [],
    });

    res.status(201).json(application);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications for logged-in user
// @route   GET /api/applications
// @access  Private
const getApplications = async (req, res, next) => {
  try {
    const { search, status, sort } = req.query;

    // Build query — always filter by current user
    const query = { user: req.user._id };

    // Filter by status
    if (status && status !== "all") {
      query.status = status;
    }

    // Search by company or role
    if (search) {
      query.$or = [
        { company: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } },
      ];
    }

    // Build sort
    let sortOption = { applicationDate: -1 }; // Default: newest first
    if (sort === "deadline") {
      sortOption = { deadline: 1 };
    } else if (sort === "company") {
      sortOption = { company: 1 };
    } else if (sort === "status") {
      sortOption = { status: 1 };
    }

    const applications = await Application.find(query).sort(sortOption);

    res.json(applications);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single application by ID
// @route   GET /api/applications/:id
// @access  Private
const getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      res.status(404);
      throw new Error("Application not found");
    }

    // Verify ownership
    if (application.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to access this application");
    }

    res.json(application);
  } catch (error) {
    next(error);
  }
};

// @desc    Update an application
// @route   PUT /api/applications/:id
// @access  Private
const updateApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      res.status(404);
      throw new Error("Application not found");
    }

    // Verify ownership
    if (application.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to update this application");
    }

    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedApplication);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an application
// @route   DELETE /api/applications/:id
// @access  Private
const deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      res.status(404);
      throw new Error("Application not found");
    }

    // Verify ownership
    if (application.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to delete this application");
    }

    await Application.findByIdAndDelete(req.params.id);

    res.json({ message: "Application deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
};

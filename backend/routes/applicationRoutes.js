const express = require("express");
const router = express.Router();
const {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
} = require("../controllers/applicationController");
const { protect } = require("../middleware/authMiddleware");

// All routes are protected
router.use(protect);

router.route("/").post(createApplication).get(getApplications);

router
  .route("/:id")
  .get(getApplicationById)
  .put(updateApplication)
  .delete(deleteApplication);

module.exports = router;

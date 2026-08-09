const Application = require("../models/Application");

// @desc    Get analytics data for logged-in user
// @route   GET /api/analytics
// @access  Private
const getAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Total applications
    const totalApplications = await Application.countDocuments({ user: userId });

    // Count by status
    const statusCounts = await Application.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Convert to a clean object
    const statusMap = {};
    const statusLabels = [
      "applied",
      "oa-test",
      "interview",
      "offer",
      "rejected",
      "pending",
      "wishlist",
      "withdrawn",
    ];
    statusLabels.forEach((s) => (statusMap[s] = 0));
    statusCounts.forEach((item) => {
      statusMap[item._id] = item.count;
    });

    // Monthly application trends (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const monthlyTrends = await Application.aggregate([
      {
        $match: {
          user: userId,
          applicationDate: { $gte: twelveMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$applicationDate" },
            month: { $month: "$applicationDate" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Format monthly data with month names
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const monthlyData = monthlyTrends.map((item) => ({
      month: monthNames[item._id.month - 1],
      year: item._id.year,
      count: item.count,
    }));

    // Response rate = (interview + offer + rejected) / total
    const responded =
      (statusMap["interview"] || 0) +
      (statusMap["offer"] || 0) +
      (statusMap["rejected"] || 0);
    const responseRate =
      totalApplications > 0
        ? Math.round((responded / totalApplications) * 100)
        : 0;

    // Offer rate = offers / total
    const offerRate =
      totalApplications > 0
        ? Math.round(((statusMap["offer"] || 0) / totalApplications) * 100)
        : 0;

    // Top companies by application count
    const topCompanies = await Application.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$company", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]);

    res.json({
      totalApplications,
      statusCounts: statusMap,
      monthlyTrends: monthlyData,
      responseRate,
      offerRate,
      topCompanies: topCompanies.map((c) => ({
        company: c._id,
        count: c.count,
      })),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAnalytics };

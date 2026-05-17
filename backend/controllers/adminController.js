const { getAdminOverview, getUsersList } = require("../services/analyticsService");

const getOverview = async (req, res) => {
  try {
    const overview = await getAdminOverview();
    return res.status(200).json(overview);
  } catch (error) {
    return res.status(500).json({ message: "Could not load admin overview", error: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await getUsersList();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Could not fetch users", error: error.message });
  }
};

module.exports = { getOverview, getUsers };

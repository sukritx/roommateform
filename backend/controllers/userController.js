const User = require('../models/user.model');

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCurrentUser,
  getFavorites
};
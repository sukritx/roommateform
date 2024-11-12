const { FAQ, Guide } = require('../models/faq.model');

const getFAQs = async (req, res) => {
  try {
    const { category } = req.query;
    const query = category ? { category } : {};
    
    const faqs = await FAQ.find(query);
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getGuides = async (req, res) => {
  try {
    const { category } = req.query;
    const query = category ? { category } : {};
    
    const guides = await Guide.find(query);
    res.json(guides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getFAQs,
  getGuides
}; 
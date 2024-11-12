const Form = require('../models/form.model');
const User = require('../models/user.model');
const Payment = require('../models/payment.model');

const createForm = async (req, res) => {
  try {
    const form = new Form({
      owner: req.user.id,
      roomDetails: req.body.roomDetails,
      ownerDetails: req.body.ownerDetails,
      filters: req.body.filters,
      publishDate: new Date(),
      expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      location: req.body.location
    });

    const savedForm = await form.save();
    await User.findByIdAndUpdate(req.user.id, {
      $push: { createdForms: savedForm._id }
    });

    res.status(201).json(savedForm);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getForms = async (req, res) => {
  try {
    const { university, minPrice, maxPrice, ...filters } = req.query;
    let query = { isActive: true };

    if (university) {
      query['roomDetails.nearbyUniversity'] = university;
    }

    if (minPrice || maxPrice) {
      query['roomDetails.monthlyRent'] = {};
      if (minPrice) query['roomDetails.monthlyRent'].$gte = Number(minPrice);
      if (maxPrice) query['roomDetails.monthlyRent'].$lte = Number(maxPrice);
    }

    const forms = await Form.find(query)
      .populate('owner', 'name email')
      .sort({ boostStatus: -1, publishDate: -1 });

    res.json(forms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFormById = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id)
      .populate('owner', 'name email contactInfo')
      .populate('applications.submissionId');

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    // Increment view count
    form.analytics.views += 1;
    await form.save();

    res.json(form);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    if (form.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedForm = await Form.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(updatedForm);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const formId = req.params.id;

    const isFavorited = user.favorites.includes(formId);
    
    if (isFavorited) {
      await User.findByIdAndUpdate(req.user.id, {
        $pull: { favorites: formId }
      });
    } else {
      await User.findByIdAndUpdate(req.user.id, {
        $push: { favorites: formId }
      });
    }

    res.json({ message: isFavorited ? 'Removed from favorites' : 'Added to favorites' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const boostListing = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    if (form.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    form.boostStatus = true;
    form.boostedUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days boost
    await form.save();

    res.json(form);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createForm,
  getForms,
  getFormById,
  updateForm,
  toggleFavorite,
  boostListing
}; 
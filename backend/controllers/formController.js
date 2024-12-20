const Form = require('../models/form.model');
const User = require('../models/user.model');
const Payment = require('../models/payment.model');

const createForm = async (req, res) => {
  try {
    const formData = JSON.parse(req.body.data);
    
    // Get the image URL from the file-upload middleware
    const imageUrl = req.file?.location;

    const form = new Form({
      owner: req.user.id,
      ...formData,
      roomDetails: {
        ...formData.roomDetails,
        images: imageUrl ? [imageUrl] : []
      }
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
    const { university, minPrice, maxPrice, faculty, year, ...filters } = req.query;
    let query = { isActive: true };

    if (university) {
      query['roomDetails.nearbyUniversity'] = university;
    }

    if (minPrice || maxPrice) {
      query['roomDetails.monthlyRent'] = {};
      if (minPrice) query['roomDetails.monthlyRent'].$gte = Number(minPrice);
      if (maxPrice) query['roomDetails.monthlyRent'].$lte = Number(maxPrice);
    }

    if (faculty) {
      query['owner.faculty'] = faculty;
    }

    if (year && !isNaN(year)) {
      query['owner.year'] = Number(year);
    }

    const forms = await Form.find(query)
      .populate('owner', 'name email contactInfo faculty year')
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

    // Only allow updating certain fields
    const allowedUpdates = {
      'roomDetails.description': req.body.roomDetails?.description,
      'roomDetails.currency': req.body.roomDetails?.currency,
      'isActive': req.body.isActive,
      'ownerDetails.personality': req.body.ownerDetails?.personality,
      'ownerDetails.morningOrLateNight': req.body.ownerDetails?.morningOrLateNight,
      'ownerDetails.cleanliness': req.body.ownerDetails?.cleanliness,
      'ownerDetails.partying': req.body.ownerDetails?.partying,
      'ownerDetails.smoking': req.body.ownerDetails?.smoking,
      'ownerDetails.hobbies': req.body.ownerDetails?.hobbies,
      'ownerDetails.faculty': req.body.ownerDetails?.faculty,
      'ownerDetails.year': req.body.ownerDetails?.year
    };

    // Remove undefined values
    Object.keys(allowedUpdates).forEach(key => 
      allowedUpdates[key] === undefined && delete allowedUpdates[key]
    );

    const updatedForm = await Form.findByIdAndUpdate(
      req.params.id,
      { $set: allowedUpdates },
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

const getMyListings = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const forms = await Form.find({ owner: req.user.id })
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });

    res.json(forms);
  } catch (error) {
    console.error('Error in getMyListings:', error);
    res.status(500).json({ 
      message: 'Failed to fetch your listings',
      error: error.message 
    });
  }
};

module.exports = {
  createForm,
  getForms,
  getFormById,
  updateForm,
  toggleFavorite,
  boostListing,
  getMyListings
}; 
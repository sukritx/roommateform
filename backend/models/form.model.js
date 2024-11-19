const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    roomDetails: {
      name: String,
      address: String,
      nearbyUniversity: String,
      totalBedrooms: Number,
      totalBathrooms: Number,
      description: String,
      monthlyRent: Number,
      currency: { type: String, default: 'USD' },
      securityDeposit: Number,
      images: [String],
      furniture: [String],
      leaseTerms: String,
      priceRange: { min: Number, max: Number },
      nearbyLocations: [String] // e.g., ['University A', 'Gym', 'Cafe']
    },
    ownerDetails: {
      personality: String,
      morningOrLateNight: String,
      cleanliness: String,
      partying: String,
      smoking: String,
      hobbies: [String],
      gender: String,
      preferredGender: String,
      faculty: String,
      year: { type: Number }
    },
    filters: {
      personality: String,
      cleanliness: String,
      morningOrLateNight: String
    },
    boostStatus: { type: Boolean, default: false },
    boostedUntil: Date,
    isActive: { type: Boolean, default: true },
    publishDate: Date,
    expirationDate: Date,
    location: {
      address: String,
      coordinates: {
        lat: Number,
        long: Number
      },
      nearbyPlaces: [String], // e.g., ['Cafe', 'Gym', 'Library']
      commuteTimes: [{
        destination: String,
        timeInMinutes: Number
      }]
    },
    analytics: {
      views: { type: Number, default: 0 },
      applicationCount: { type: Number, default: 0 },
      responseRate: { type: Number, default: 0 }
    },
    applications: [{
      submissionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Submission' },
      status: { type: String, enum: ['pending', 'rejected'], default: 'pending' }
    }]
  }, { timestamps: true });
  
  module.exports = mongoose.model('Form', formSchema);
  
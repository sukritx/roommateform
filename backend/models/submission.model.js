const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  form: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
  submitter: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    personality: String,
    morningOrLateNight: String,
    cleanliness: String,
    partying: String,
    smoking: String,
    gender: String,
    hobbies: [String],
    contactInfo: [
      {
        platform: { type: String, enum: ['whatsapp', 'instagram', 'facebook', 'email', 'phone'], required: true },
        username: { type: String, required: true }
      }
    ],
    faculty: { type: String },
    year: { type: Number },
    notes: String,
  },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);

const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  form: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
  submitter: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    personality: { type: String, required: true },
    morningOrLateNight: { type: String, required: true },
    cleanliness: { type: String, required: true },
    partying: { type: String, required: true },
    smoking: { type: String, required: true },
    gender: { type: String, required: true },
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

const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String },
    personality: String,
    morningOrLateNight: String,
    cleanliness: String,
    partying: String,
    hobbies: [String],
    faculty: { type: String, required: true },
    year: { type: Number, required: true },
    contactInfo: { ig: String },
    createdForms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Form' }],
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Form' }],
    privacySettings: {
        showLastName: { type: Boolean, default: false },
        showContactInfo: { type: Boolean, default: false }
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

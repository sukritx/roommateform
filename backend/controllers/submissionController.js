const Submission = require('../models/submission.model');
const Form = require('../models/form.model');
const jwt = require('jsonwebtoken');

const createSubmission = async (req, res) => {
  try {
    const form = await Form.findById(req.body.formId);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    // Create base submission data
    const submissionData = {
      form: req.body.formId,
      submitter: req.body.submitter
    };

    // If there's an authenticated user (checked by cookie token), add their ID
    const token = req.cookies.token;
    if (token) {
      try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        submissionData.submitter.userId = user.id;
      } catch (err) {
        // Token verification failed, continue without user ID
        console.log('Token verification failed:', err.message);
      }
    }

    const submission = new Submission(submissionData);
    const savedSubmission = await submission.save();

    // Update form with new submission
    await Form.findByIdAndUpdate(req.body.formId, {
      $push: { applications: { submissionId: savedSubmission._id } },
      $inc: { 'analytics.applicationCount': 1 }
    });

    res.status(201).json(savedSubmission);
  } catch (error) {
    console.error('Error creating submission:', error);
    res.status(500).json({ message: error.message });
  }
};

const getSubmissions = async (req, res) => {
  try {
    // First check if the user owns the form
    const form = await Form.findById(req.params.formId);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    if (form.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view these submissions' });
    }

    const submissions = await Submission.find({ form: req.params.formId })
      .populate('form', 'roomDetails.name')
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserSubmissions = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'Authentication required to view your submissions' });
    }

    const submissions = await Submission.find({ 'submitter.userId': req.user.id })
      .populate({
        path: 'form',
        select: 'roomDetails.name roomDetails.nearbyUniversity roomDetails.monthlyRent roomDetails.currency'
      })
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (error) {
    console.error('Error getting user submissions:', error);
    res.status(500).json({ message: error.message });
  }
};

const updateSubmissionStatus = async (req, res) => {
  try {
    const { formId, submissionId } = req.params;
    const { status } = req.body;

    const form = await Form.findById(formId);
    if (!form || form.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Form.updateOne(
      { _id: formId, 'applications.submissionId': submissionId },
      { $set: { 'applications.$.status': status } }
    );

    res.json({ message: 'Submission status updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    // First check if the user owns the form
    const submission = await Submission.findById(req.params.submissionId).populate('form');
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    if (submission.form.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to mark this submission as read' });
    }

    const updatedSubmission = await Submission.findByIdAndUpdate(
      req.params.submissionId,
      { isRead: true },
      { new: true }
    );

    res.json(updatedSubmission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSubmission,
  getSubmissions,
  updateSubmissionStatus,
  markAsRead,
  getUserSubmissions
};
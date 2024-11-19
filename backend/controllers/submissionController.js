const Submission = require('../models/submission.model');
const Form = require('../models/form.model');

const createSubmission = async (req, res) => {
  try {
    const form = await Form.findById(req.body.formId);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    const submission = new Submission({
      form: req.body.formId,
      submitter: req.body.submitter
    });

    const savedSubmission = await submission.save();

    // Update form with new submission
    await Form.findByIdAndUpdate(req.body.formId, {
      $push: { applications: { submissionId: savedSubmission._id } },
      $inc: { 'analytics.applicationCount': 1 }
    });

    res.status(201).json(savedSubmission);
  } catch (error) {
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
      .populate('form', 'roomDetails.name') // Populate form name
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (error) {
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
    ).populate('form', 'roomDetails.name');

    res.json(updatedSubmission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSubmission,
  getSubmissions,
  updateSubmissionStatus,
  markAsRead
};
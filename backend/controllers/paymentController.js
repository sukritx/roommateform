const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/payment.model');
const Form = require('../models/form.model');

const createPaymentIntent = async (req, res) => {
  try {
    const { packageType } = req.body;
    
    let amount;
    if (packageType === 'monthly') {
      amount = 899; // $8.99
    } else if (packageType === 'until-found') {
      amount = 1299; // $12.99
    } else {
      return res.status(400).json({ message: 'Invalid package type' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: { 
        userId: req.user.id,
        packageType
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const handlePaymentSuccess = async (req, res) => {
  try {
    const { formId, packageType, stripePaymentId } = req.body;

    const payment = new Payment({
      user: req.user.id,
      form: formId,
      packageType,
      amount: packageType === 'monthly' ? 899 : 1299,
      paymentDate: new Date(),
      stripePaymentId
    });

    await payment.save();

    // Set form expiration based on package type
    const expirationDate = packageType === 'monthly'
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)  // 30 days
      : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year (for until-found)

    await Form.findByIdAndUpdate(formId, {
      isActive: true,
      publishDate: new Date(),
      expirationDate
    });

    res.json({ message: 'Payment processed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id })
      .populate('form', 'roomDetails.name roomDetails.address')
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPaymentIntent,
  handlePaymentSuccess,
  getPaymentHistory
}; 
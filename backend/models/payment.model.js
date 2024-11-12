const paymentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    form: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
    packageType: {
      type: String,
      enum: ['monthly', 'untilFound'],
      required: true
    },
    amount: Number,
    paymentDate: Date,
    paymentStatus: { type: String, enum: ['succeeded', 'failed'], default: 'succeeded' },
    stripePaymentId: String // to track the transaction on Stripe
  }, { timestamps: true });
  
  module.exports = mongoose.model('Payment', paymentSchema);
  
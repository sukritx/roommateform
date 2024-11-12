const faqSchema = new mongoose.Schema({
    question: String,
    answer: String,
    category: { type: String, enum: ['Roommate Guide', 'Help Center'] }
  });
  
  const guideSchema = new mongoose.Schema({
    title: String,
    content: String,
    category: { type: String, enum: ['Roommate Guide', 'Safety Tips', 'Lease Understanding'] }
  });
  
  module.exports = {
    FAQ: mongoose.model('FAQ', faqSchema),
    Guide: mongoose.model('Guide', guideSchema)
  };
  
import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, default: Date.now },
  image: { type: String },
  hash: { type: String }, // Blockchain transaction hash
  status: { 
    type: String, 
    enum: ['found', 'claimed', 'returned'], 
    default: 'found' 
  },
  verificationQuestions: [{
    question: { type: String, required: true },
    answer: { type: String, required: true } // Stored as plain text or hashed
  }]
}, { timestamps: true });

export const Item = mongoose.model('Item', itemSchema);
import mongoose from 'mongoose';

const claimSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  answers: [{
    questionId: String,
    answer: String
  }],
  verified: { type: Boolean, default: false },
  phoneNumber: { type: String },
  otp: { type: String },
  otpExpiry: { type: Date },
  qrCode: { type: String }, // QR code data (claim ID)
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'completed'], 
    default: 'pending' 
  }
}, { timestamps: true });

export const Claim = mongoose.model('Claim', claimSchema);
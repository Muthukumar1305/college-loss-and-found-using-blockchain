import { Response } from 'express';
import { Claim } from '../models/Claim';
import { Item } from '../models/Item';
import { AuthRequest } from '../middleware/auth';

const normalizePhoneNumber = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return `+91${digits.slice(1)}`;
  }
  if (digits.length > 10 && digits.startsWith('91')) {
    return `+${digits}`;
  }
  return phone.startsWith('+') ? phone : `+${digits}`;
};

export const submitAnswers = async (req: AuthRequest, res: Response) => {
  try {
    const { itemId, answers } = req.body;
    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Compare answers (case-insensitive and trimmed)
    let allCorrect = true;
    item.verificationQuestions.forEach((q: any) => {
      const questionId = q._id.toString();
      const userAnswer = answers[questionId];
      
      if (!userAnswer || userAnswer.toLowerCase().trim() !== q.answer.toLowerCase().trim()) {
        allCorrect = false;
      }
    });

    if (!allCorrect) {
      return res.status(400).json({ message: 'Verification failed. Incorrect answers provided.' });
    }

    // Create a new claim if answers are correct
    const claim = await Claim.create({
      userId: req.user!.id,
      itemId,
      answers: Object.entries(answers).map(([id, ans]) => ({ 
        questionId: id, 
        answer: ans as string 
      })),
      status: 'pending',
      verified: true
    });

    claim.qrCode = claim._id.toString();
    await claim.save();

    res.status(201).json({ 
      message: 'Answers verified successfully', 
      claimId: claim._id 
    });
  } catch (error) {
    console.error('Error submitting answers:', error);
    res.status(500).json({ message: 'Server error during answer verification' });
  }
};

export const generateOTP = async (req: AuthRequest, res: Response) => {
  try {
    const { claimId, phone } = req.body;

    if (!phone || typeof phone !== 'string' || phone.replace(/\D/g, '').length < 10) {
      return res.status(400).json({ message: 'Please provide a valid mobile number' });
    }

    const normalizedPhone = normalizePhoneNumber(phone);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    const claim = await Claim.findByIdAndUpdate(
      claimId,
      { phoneNumber: normalizedPhone, otp, otpExpiry: expiry },
      { new: true }
    );

    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    console.log(`[OTP] Generated OTP ${otp} for claim ${claimId} and phone ${normalizedPhone}`);

    res.json({
      message: 'OTP generated successfully',
      phone: normalizedPhone,
      otp,
      debug: true,
      debugMsg: 'OTP is displayed here for testing purposes only.'
    });
  } catch (error) {
    console.error('Error generating OTP:', error);
    res.status(500).json({ message: 'Server error generating OTP' });
  }
};

export const verifyOTP = async (req: AuthRequest, res: Response) => {
  try {
    const { claimId, otp, phone } = req.body;
    const claim = await Claim.findById(claimId);

    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    const normalizedPhone = normalizePhoneNumber(phone);
    if (!claim.phoneNumber || claim.phoneNumber !== normalizedPhone) {
      return res.status(400).json({ message: 'Phone number does not match the claim' });
    }

    if (!claim.otp || claim.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (claim.otpExpiry && new Date() > claim.otpExpiry) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    claim.verified = true;
    claim.otp = undefined;
    claim.otpExpiry = undefined;
    claim.qrCode = claimId; // Store claim ID as QR code data
    await claim.save();

    res.json({ 
      message: 'OTP verified successfully. QR code generated for admin approval.',
      qrCode: claimId,
      claimId 
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Server error verifying OTP' });
  }
};

export const getClaims = async (req: AuthRequest, res: Response) => {
  try {
    const claims = await Claim.find()
      .populate('userId', 'name email')
      .populate('itemId', 'name location')
      .sort({ createdAt: -1 });
    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching claims' });
  }
};

export const verifyQR = async (req: AuthRequest, res: Response) => {
  try {
    const { claimId, qrData } = req.body;
    const claim = await Claim.findById(claimId);

    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    if (claim.status !== 'pending') {
      return res.status(400).json({ message: 'Claim is not in pending status' });
    }

    // Check if QR data matches the claim ID
    if (qrData !== claimId) {
      return res.status(400).json({ success: false, message: 'QR code does not match this claim' });
    }

    // Update claim status to approved
    claim.status = 'approved';
    await claim.save();

    // Update item status
    await Item.findByIdAndUpdate(claim.itemId, { status: 'claimed' });

    res.json({ success: true, message: 'Claim approved successfully via QR scan' });
  } catch (error) {
    console.error('Error verifying QR:', error);
    res.status(500).json({ message: 'Server error verifying QR code' });
  }
};

export const approveClaim = async (req: AuthRequest, res: Response) => {
  try {
    const { claimId } = req.body;
    const claim = await Claim.findById(claimId);

    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    if (claim.status !== 'pending') {
      return res.status(400).json({ message: 'Claim is not in pending status' });
    }

    claim.status = 'approved';
    await claim.save();

    // Update item status
    await Item.findByIdAndUpdate(claim.itemId, { status: 'claimed' });

    res.json({ message: 'Claim approved successfully' });
  } catch (error) {
    console.error('Error approving claim:', error);
    res.status(500).json({ message: 'Server error approving claim' });
  }
};

export const rejectClaim = async (req: AuthRequest, res: Response) => {
  try {
    const { claimId } = req.body;
    const claim = await Claim.findById(claimId);

    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    if (claim.status !== 'pending') {
      return res.status(400).json({ message: 'Claim is not in pending status' });
    }

    claim.status = 'rejected';
    await claim.save();

    res.json({ message: 'Claim rejected successfully' });
  } catch (error) {
    console.error('Error rejecting claim:', error);
    res.status(500).json({ message: 'Server error rejecting claim' });
  }
};
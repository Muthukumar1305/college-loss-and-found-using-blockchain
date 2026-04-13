import express from 'express';
import { generateOTP, verifyOTP, getClaims, submitAnswers, verifyQR, approveClaim, rejectClaim } from '../controllers/claimController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.get('/', protect, authorize('admin'), getClaims);
router.post('/submit-answers', protect, submitAnswers);
router.post('/generate-otp', protect, generateOTP);
router.post('/verify-otp', protect, verifyOTP);
router.post('/verify-qr', protect, authorize('admin'), verifyQR);
router.post('/approve', protect, authorize('admin'), approveClaim);
router.post('/reject', protect, authorize('admin'), rejectClaim);

export default router;
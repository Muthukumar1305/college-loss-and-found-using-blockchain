import express from 'express';
import { addFoundItem, getFoundItems, getQuestions } from '../controllers/itemController';
import { protect, authorize } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();

router.get('/found', getFoundItems);
router.get('/:itemId/questions', getQuestions);
router.post('/add-found', protect, authorize('admin'), upload.single('image'), addFoundItem);

export default router;
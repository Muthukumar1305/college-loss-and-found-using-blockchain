import { Request, Response } from 'express';
import { Item } from '../models/Item';
import { AuthRequest } from '../middleware/auth';

export const addFoundItem = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, location, date, verificationQuestions } = req.body;
    
    // Parse verification questions if they come as a string (common with FormData)
    let parsedQuestions = verificationQuestions;
    if (typeof verificationQuestions === 'string') {
      parsedQuestions = JSON.parse(verificationQuestions);
    }

    const newItem = await Item.create({
      name,
      description,
      location,
      date: date || Date.now(),
      image: req.file ? `/uploads/${req.file.filename}` : '',
      verificationQuestions: parsedQuestions,
      status: 'found'
    });

    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ message: 'Server error while adding item' });
  }
};

export const getFoundItems = async (req: Request, res: Response) => {
  try {
    const items = await Item.find({ status: 'found' }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching items' });
  }
};

export const getQuestions = async (req: Request, res: Response) => {
  try {
    const item = await Item.findById(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    
    // Only return questions, not answers
    const questions = item.verificationQuestions.map(q => ({
      id: (q as any)._id,
      question: q.question
    }));
    
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching questions' });
  }
};
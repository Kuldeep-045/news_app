import express from 'express';
import { markAsRead, deleteNewsItem, getUserNewsItems, getUserNewsItem } from '../controllers/userController.js';
import { isAuthenticated } from '../middlewares/auth.js'
const router = express.Router();

router.put('/news/:id', isAuthenticated, markAsRead);
router.delete('/news/:id', isAuthenticated, deleteNewsItem);
router.get('/news', isAuthenticated, getUserNewsItems);
router.get('/news/:id', isAuthenticated, getUserNewsItem);

export default router;

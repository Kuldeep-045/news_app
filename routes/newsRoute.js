import express from 'express';
import { fetchAndStoreNews } from '../controllers/newsController.js';
import {isAuthenticated} from '../middlewares/auth.js'
const router = express.Router();

// router.get('/fetch', fetchAndStoreNews);
router.get('/',isAuthenticated, fetchAndStoreNews);

export default router;

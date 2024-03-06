import express from 'express';
import { create, getComments } from '../controllers/comment.controller.js';
import { verifyToken } from '../utils/verifyToken.js';

const router = express.Router();

router.post('/create', verifyToken, create);
router.post('/:postId', getComments);

export default router;
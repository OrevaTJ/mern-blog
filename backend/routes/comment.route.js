import express from 'express';
import { create, getComments, editComment } from '../controllers/comment.controller.js';
import { verifyToken } from '../utils/verifyToken.js';

const router = express.Router();

router.post('/create', verifyToken, create);
router.put('/likeComment/:commentId', verifyToken, likeComment);
router.put('/editComment/:commentId', verifyToken, editComment);
router.get('/:postId', getComments);

export default router;
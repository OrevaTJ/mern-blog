import express from 'express';
import { create, getComments, editComment, deleteComment, likeComment, getAllComments } from '../controllers/comment.controller.js';
import { verifyToken } from '../utils/verifyToken.js';

const router = express.Router();

router.post('/create', verifyToken, create);
router.put('/likeComment/:commentId', verifyToken, likeComment);
router.put('/editComment/:commentId', verifyToken, editComment);
router.delete('/deleteComment/:commentId', verifyToken, deleteComment);
router.get('/:postId', getComments);
router.get('/', verifyToken, getAllComments);

export default router;
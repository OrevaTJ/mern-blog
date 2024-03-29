import express from "express";
import { updateUser, deleteUser, signout, getUsers, getSingleUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router()

router.put('/update/:id', verifyToken, updateUser)
router.delete('/delete/:id',verifyToken, deleteUser)
router.post('/signout', signout);
router.get('/', verifyToken, getUsers);
router.get('/:userId', getSingleUser);

export default router
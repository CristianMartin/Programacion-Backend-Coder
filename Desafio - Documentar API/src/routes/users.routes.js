import { Router } from "express";
import { getUsers, getUser, putUser, deleteUser } from '../controllers/users.controller.js';
import { passportError, authorization } from '../middleware/messageError.js';

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/:id', getUser);
userRouter.put('/:id', passportError('jwt'), authorization('user'),  putUser);
userRouter.delete('/:id', passportError('jwt'), authorization('user'), deleteUser);

export default userRouter;
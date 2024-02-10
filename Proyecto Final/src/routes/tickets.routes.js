import { Router } from 'express';
import { getTickets, getTicket, postTicket } from '../controllers/ticket.controller.js';
import { passportError, authorization } from '../middleware/messageError.js';

const ticketRouter = Router();

ticketRouter.get('/', passportError('jwt'), authorization('user'), getTickets);
ticketRouter.get('/:tid', passportError('jwt'), authorization('user'), getTicket);
ticketRouter.post('/:cid/purchase', passportError('jwt'), authorization('user'), postTicket);

export default ticketRouter;
import { Schema, model } from 'mongoose';

const ticketSchema = new Schema({
    code: {
        type: String,
        default: crypto.randomUUID(),
        unique: true
    },
    purchase_datetime: {
        type: Date,
        default: new Date(Date.now()).toUTCString()
    },
    amount: { 
        type: Number
    },
    purchaser: {
        type: String
    },
});

export const ticketsModel = model('tickets', ticketSchema);
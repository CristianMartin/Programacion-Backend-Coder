import { Schema, model } from "mongoose";

const userSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true,
        index: true
    },
    edad: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        default: 'user',
        required: true
    },
    last_connection: {
        type: String
    },
    documents: {
        type: [
            {
                name: String,
                reference: String
            }
        ],
        default: []
    }
});

export const userModel = model('users', userSchema);

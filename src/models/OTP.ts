import { Schema, Document, model } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

export interface IOTP extends Document {
    _id: string
    phone: number
    email: string
    code: number
    created_at: string
}

const OTPSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    phone: {
        type: Number
    },
    email: {
        type: String
    },
    code: {
        type: Number,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

OTPSchema.index({ created_at: 1 }, { expireAfterSeconds: 180 });

export default model<IOTP>('otpes', OTPSchema)
import mongpose, { Schema, Document, model } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
export interface IMessage extends Document {
    _id: string
    sender_id: string
    receiver_id: string
    body: Object
    reply_to: string
    createdAt: number
    updatedAt: number
}

const messageSchema = new Schema<IMessage>(
    {
        _id: {
            type: String,
            default: uuidv4
        },
        sender_id: {
            type: String,
            ref: 'User',
            required: true
        },
        receiver_id: {
            type: String,
            ref: 'User',
            required: true
        },
        body: {
            type: Object
        },
        reply_to: {
            type: String
        }
    },
    { timestamps: true }
)

export default model<IMessage>('Message', messageSchema)

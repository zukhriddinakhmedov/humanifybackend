import { Schema, Document, model } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

export interface IConversation extends Document {
    _id: string
    receiver_id: string
    sender_id: string
    createdAt: number
    updatedAt: number
}

const Conversationchema = new Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    receiver_id: {
        type: String
    },
    sender_id: {
        type: String
    }
}, { timestamps: true })

export default model<IConversation>('Conversation', Conversationchema)
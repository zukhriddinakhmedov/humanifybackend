import { required, string } from 'joi';
import mongpose, { Schema, Document, model } from "mongoose"
import { v4 as uuidv4 } from "uuid"
export interface IFollows extends Document {
    _id: string
    user_id: string
    follower_id: string
    status: string
    follow: string
    createdAt: number
    updatedAt: number
}

const followsSchema = new Schema<IFollows>({
    _id: {
        type: String,
        default: uuidv4
    },
    user_id: {
        type: String,
        ref: 'User',
        required: true
    },
    follower_id: {
        type: String,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'pending'],
        required: true
    },
    follow: {
        type: String,
        default: 'unfollow'
    }
}, { timestamps: true })

export default model<IFollows>('Follows', followsSchema)


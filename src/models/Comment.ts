import { Schema, Document, model } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

export interface IComment extends Document {
    _id: string
    reply_id: string
    post_id: string
    owner_id: string
    body: string
    likes: string[]
    createdAt: number
    updatedAt: number
}

const commentSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    reply_id: {
        type: String,
        ref: 'Comment',
    },
    post_id: {
        type: String,
        required: true
    },
    owner_id: {
        type: String,
        ref: 'User',
        required: true
    },
    body: {
        type: String,
        required: true
    },
    likes: {
        type: [String],
    },
}, { timestamps: true })

export default model<IComment>('Comment', commentSchema)
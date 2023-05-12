import mongpose, { Schema, Document, model } from "mongoose"
import { v4 as uuidv4 } from "uuid"
export interface IPost extends Document {
    _id: string
    owner_id: string
    owner_type: string
    category: string[]
    body: string
    media: [
        {
            url: string
            type: string
        }
    ]
    likes: string[]
    comments: number
    status: string
    views: number
    createdAt: number
    updatedAt: number
}

const postSchema = new Schema<IPost>({
    _id: {
        type: String,
        default: uuidv4
    },
    owner_id: {
        type: String,
        ref: 'User',
        required: true
    },
    owner_type: {
        type: String,
        enum: ['user', 'business', 'professional'],
        required: true
    },
    category: {
        type: [String]
    },
    body: {
        type: String
    },
    media: [
        {
            url: {
                type: String
            },
            type: {
                type: String
            }
        }
    ],
    likes: {
        type: [String]
    },
    comments: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    views: {
        type: Number,
        default: 100
    }
}, { timestamps: true })

export default model<IPost>('Post', postSchema)


import mongpose, { Schema, Document, model } from "mongoose"
import { v4 as uuidv4 } from "uuid"
export interface IDeletedPost extends Document {
    _id: string
    owner_id: string
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
    views: number
    createdAt: number
    updatedAt: number
}

const deletedPostSchema = new Schema<IDeletedPost>({
    _id: {
        type: String,
        default: uuidv4
    },
    owner_id: {
        type: String,
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
        type: Number
    },
    views: {
        type: Number,
        default: 100
    }
}, { timestamps: true })

export default model<IDeletedPost>('DeletedPost', deletedPostSchema)


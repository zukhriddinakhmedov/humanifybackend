import mongpose, { Schema, Document, model } from "mongoose"
import { v4 as uuidv4 } from "uuid"
export interface INotification extends Document {
    _id: string
    receiver_id: string
    type: string
    follower_id: string
    post_id: string
    createdAt: number
    updatedAt: number
}

const notificationSchema = new Schema<INotification>({
    _id: {
        type: String,
        default: uuidv4
    },
    receiver_id: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['new_follow', 'waiting_follow', 'comment', 'like', 'message'],
        required: true
    },
    follower_id: {
        type: String,
        ref: 'User'
    },
    post_id: {
        type: String,
        ref: 'Post'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

notificationSchema.index({ created_at: 1 }, { expireAfterSeconds: 259200 });

export default model<INotification>('Notification', notificationSchema)


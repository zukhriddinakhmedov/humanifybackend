import { Schema, Document, model } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

export interface IMakeInfluencer extends Document {
    _id: string
    user_id: string
    description: string
    influencer_type: string
    createdAt: number
    updatedAt: number
}

const makeInfluencerSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    user_id: {
        type: String,
        ref: 'User',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    influencer_type: {
        type: String,
        enum: ['business', 'professional'],
        required: true
    }
}, { timestamps: true })

export default model<IMakeInfluencer>('makeInfluencer', makeInfluencerSchema)
import mongpose, { Schema, Document, model } from "mongoose"
import { v4 as uuidv4 } from "uuid"
export interface IReport extends Document {
    _id: string
    owner_id: string
    receiver_id: string
    collection_type: string
    report_type: string
    createdAt: number
    updatedAt: number
}

const reportSchema = new Schema<IReport>({
    _id: {
        type: String,
        default: uuidv4
    },
    owner_id: {
        type: String,
        required: true
    },
    receiver_id: {
        type: String,
        required: true
    },
    collection_type: {
        type: String,
        enum: ['users', 'posts', 'comments'],
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inprogress', 'reviewed'],
        default: 'active'
    },
    report_type: {
        type: String,
        required: true
    }
}, { timestamps: true })

export default model<IReport>('Report', reportSchema)


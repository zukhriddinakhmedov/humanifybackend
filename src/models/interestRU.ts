import mongpose, { Schema, Document, model } from "mongoose"
import { v4 as uuidv4 } from "uuid"
export interface IInterestRU extends Document {
    _id: string
    title: string
    media: string
    createdAt: number
    updatedAt: number
}

const interestRUSchema = new Schema<IInterestRU>({
    _id: {
        type: String,
        default: uuidv4
    },
    title: {
        type: String,
        unique: true,
        required: true
    },
    refId: {
        type: String,
        required: true
    },
    media: {
        type: String,
        required: true
    }
}, { timestamps: true })

export default model<IInterestRU>('InterestRU', interestRUSchema)


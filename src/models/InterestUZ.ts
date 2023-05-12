import mongpose, { Schema, Document, model } from "mongoose"
import { v4 as uuidv4 } from "uuid"
export interface IInterestUZ extends Document {
    _id: string
    title: string
    media: string
    refId: string
    createdAt: number
    updatedAt: number
}

const interestUZSchema = new Schema<IInterestUZ>({
    _id: {
        type: String,
        default: uuidv4
    },
    refId: {
        type: String
    },
    title: {
        type: String,
        unique: true,
        required: true
    },
    media: {
        type: String,
        required: true
    }
}, { timestamps: true })

export default model<IInterestUZ>('InterestUZ', interestUZSchema)


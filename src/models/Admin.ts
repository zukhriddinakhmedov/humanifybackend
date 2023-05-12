import mongpose, { Schema, Document, model } from "mongoose"
import { v4 as uuidv4 } from "uuid"
export interface IAdmin extends Document {
    _id: string
    first_name: string
    last_name: string
    email: string
    role: string
    avatar: string
    status: string
    login: string
    password: string
    phone: string
    createdAt: number
    updatedAt: number
}

const adminSchema = new Schema<IAdmin>({
    _id: {
        type: String,
        default: uuidv4
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        required: true,
        enum: ['superadmin', 'admin']
    },
    avatar: {
        type: String
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    login: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    }
}, { timestamps: true })

export default model<IAdmin>('Admin', adminSchema)


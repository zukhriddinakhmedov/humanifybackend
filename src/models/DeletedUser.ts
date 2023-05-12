import mongpose, { Schema, Document, model } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

export interface IDeletedUser extends Document {
    _id: string
    first_name: string
    last_name: string
    email: string
    avatar: string
    birthday: string
    address: {
        long: number
        lat: number
    }
    gender: string
    followers: number
    follows: number
    interests: string[]
    username: string
    status: string
    type: string
    password: string
    phone: string
    createdAt: number
    updatedAt: number
}

const deletedUserSchema = new Schema<IDeletedUser>(
    {
        _id: {
            type: String,
            default: uuidv4
        },
        first_name: {
            type: String
        },
        last_name: {
            type: String
        },
        email: {
            type: String
        },
        avatar: {
            type: String
        },
        birthday: {
            type: String
        },
        address: {
            long: {
                type: Number
            },
            lat: {
                type: Number
            }
        },
        gender: {
            type: String,
            enum: ['Male', 'Female']
        },
        followers: {
            type: Number
        },
        follows: {
            type: Number
        },
        interests: {
            type: [String]
        },
        username: {
            type: String
        },
        phone: {
            type: Number
        }
    },
    { timestamps: true }
)

export default model<IDeletedUser>('DeletedUser', deletedUserSchema)

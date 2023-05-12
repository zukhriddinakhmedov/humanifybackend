import { required } from 'joi'
import mongpose, { Schema, Document, model } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

export interface IUser extends Document {
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
    posts: number
    notifications: number
    username: string
    bio: string
    category: string
    status: string
    type: string
    account_type: string
    password: string
    phone: string
    createdAt: number
    updatedAt: number
}

const userSchema = new Schema<IUser>(
    {
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
            type: String
        },
        avatar: {
            type: String
        },
        birthday: {
            type: String,
            required: true
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
            required: true,
            enum: ['Male', 'Female']
        },
        followers: {
            type: Number,
            default: 0
        },
        follows: {
            type: Number,
            default: 0
        },
        interests: [{
            type: String,
            default: []
        }],
        posts: {
            type: Number,
            default: 0
        },
        notifications: {
            type: Number,
            default: 0
        },
        username: {
            type: String,
            required: true,
            unique: true
        },
        bio: {
            type: String
        },
        category: {
            type: String
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active'
        },
        type: {
            type: String,
            enum: ['private', 'public'],
            required: true
        },
        account_type: {
            type: String,
            enum: ['user', 'business', 'profesional'],
            default: 'user'
        },
        password: {
            type: String,
            required: true
        },
        phone: {
            type: Number
        }
    },
    { timestamps: true }
)

export default model<IUser>('User', userSchema)

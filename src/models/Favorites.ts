import { required, string } from 'joi';
import mongpose, { Schema, Document, model } from "mongoose"
import { v4 as uuidv4 } from "uuid"
export interface IFavorites extends Document {
    _id: string
    user_id: string
    body: {
        name: string
        image: any
        list: string[]
    }[]
    createdAt: number
    updatedAt: number
}

const favoritesSchema = new Schema<IFavorites>({
    _id: {
        type: String,
        default: uuidv4
    },
    user_id: {
        type: String,
        required: true
    },
    body: {
        type: [{
            name: {
                type: String,
                unique: true
            },
            image: {
                type: String
            },
            list: [String]
        }],
        default: []
    }
}, { timestamps: true })

export default model<IFavorites>('Favorites', favoritesSchema)


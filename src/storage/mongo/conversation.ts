import { ConversationRepo } from '../repo/conversation'
import Conversation, { IConversation } from '../../models/Conversation'
import { logger } from '../../config/logger'
import AppError from '../../utils/appError'

export class ConversationStorage implements ConversationRepo {
    private scope = 'storage.conversation'

    async findAll(id: string, postLimit: number, postPage: number): Promise<Object> {
        try {
            let dbObj = await Conversation.aggregate([
                { $match: { sender_id: id } },
                {
                    $lookup: {
                        from: "users",
                        localField: "receiver_id",
                        foreignField: "_id",
                        as: "receiver",
                    },
                },
                { $skip: postPage },
                { $limit: postLimit },
                {
                    $unset: [
                        "receiver.email",
                        "receiver.followers",
                        "receiver.follows",
                        "receiver.interests",
                        "receiver.posts",
                        "receiver.notifications",
                        "receiver.birthday",
                        "receiver.gender",
                        "receiver.password",
                        "receiver.bio",
                        "receiver.createdAt",
                        "receiver.updatedAt",
                        "receiver.__v"
                    ],
                }
            ])
            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.find: finished with error: ${error}`)
            throw error
        }
    }

    async findOne(query: Object): Promise<any> {
        try {
            const conversation = await Conversation.findOne(query)
            return conversation
        } catch (error) {
            logger.error(`${this.scope}.findOne: finished with error: ${error}`)
            throw error
        }
    }

    async create(payload: Object): Promise<IConversation> {
        try {
            const newConversation = await Conversation.create(payload)
            return newConversation
        } catch (error) {
            logger.error(`${this.scope}.create: finished with error: ${error}`)
            throw error
        }
    }

    async delete(query: Object): Promise<IConversation> {
        try {
            const conversation = await Conversation.findOneAndDelete(query)

            if (!conversation) {
                logger.warn(`${this.scope}.delete failed to findOneAndDelete`)
                throw new AppError(404, 'conversation_404')
            }

            return conversation
        } catch (error) {
            logger.error(`${this.scope}.delete: finished with error: ${error}`)
            throw error
        }
    }
}

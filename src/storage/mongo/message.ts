import { MessageRepo, IMessageAllResponse } from '../repo/message'
import Message, { IMessage } from '../../models/Message'
import { logger } from '../../config/logger'
import AppError from '../../utils/appError'

export class MessageStorage implements MessageRepo {
    private scope = 'storage.post'

    async find(sender_id: string, receiver_id: string, postLimit: number, postPage: number): Promise<Object> {
        try {
            let dbObj = await Message.aggregate([
                { $match: { $and: [{ "sender_id": sender_id }, { "receiver_id": receiver_id }, { "sender_id": receiver_id }, { "receiver_id": sender_id }] } },
                { $sort: { createdAt: -1 } },
                { $skip: postPage },
                { $limit: postLimit },
            ])
            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.find: finished with error: ${error}`)
            throw error
        }
    }

    async findOne(query: Object): Promise<IMessage> {
        try {
            let dbObj = await Message.findOne({ ...query }).populate(
                'owner_id',
                'first_name last_name avatar'
            )

            if (!dbObj) {
                logger.warn(`${this.scope}.get failed to findOne`)
                throw new AppError(404, 'post_404')
            }

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.findOne: finished with error: ${error}`)
            throw error
        }
    }

    async create(payload: IMessage): Promise<IMessage> {
        try {
            let dbObj = await Message.create(payload)

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.create: finished with error: ${error}`)
            throw error
        }
    }

    async update(id: Object, payload: IMessage): Promise<IMessage> {
        try {
            let dbObj = await Message.findByIdAndUpdate(id, payload, {
                new: true
            })

            if (!dbObj) {
                logger.warn(`${this.scope}.update failed to findByIdAndUpdate`)
                throw new AppError(404, 'admin_404')
            }

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.update: finished with error: ${error}`)
            throw error
        }
    }

    async delete(id: Object): Promise<any> {
        try {
            let dbObj = await Message.findByIdAndDelete(id)

            if (!dbObj) {
                logger.warn(`${this.scope}.delete failed to findByIdAndDelete`)
                throw new AppError(404, 'admin_404')
            }

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.delete: finished with error: ${error}`)
            throw error
        }
    }
}

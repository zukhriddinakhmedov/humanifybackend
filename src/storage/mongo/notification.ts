import { NotificationRepo, INotificationAllResponse } from '../repo/notification'
import Notification, { INotification } from '../../models/Notification'
import { logger } from '../../config/logger'
import AppError from '../../utils/appError'

export class NotificationStorage implements NotificationRepo {
    private scope = 'storage.notification'

    async findAll(id: string): Promise<INotification[]> {
        try {
            let dbObj = await Notification.aggregate([
                { $match: { receiver_id: id } },
                {
                    $lookup: {
                        from: "users",
                        localField: "follower_id",
                        foreignField: "_id",
                        as: "creator",
                    },
                },
                {
                    $unset: [
                        "creator.email",
                        "creator.followers",
                        "creator.follows",
                        "creator.interests",
                        "creator.posts",
                        "creator.notifications",
                        "creator.birthday",
                        "creator.gender",
                        "creator.password",
                        "creator.bio",
                        "creator.createdAt",
                        "creator.updatedAt",
                        "creator.__v"
                    ],
                }
            ])
            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.find: finished with error: ${error}`)
            throw error
        }
    }

    async findOne(query: Object): Promise<INotification> {
        try {
            let dbObj = await Notification.findOne({ ...query })

            if (!dbObj) {
                logger.warn(`${this.scope}.get failed to findOne`)
                throw new AppError(404, 'notification_404')
            }

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.findOne: finished with error: ${error}`)
            throw error
        }
    }

    async create(payload: INotification): Promise<INotification> {
        try {
            let dbObj = await Notification.create(payload)

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.create: finished with error: ${error}`)
            throw error
        }
    }

    async delete(id: string): Promise<any> {
        try {
            let dbObj = await Notification.findByIdAndDelete(id)

            if (!dbObj) {
                logger.warn(`${this.scope}.delete failed to findByIdAndDelete`)
                throw new AppError(404, 'notification_404')
            }

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.delete: finished with error: ${error}`)
            throw error
        }
    }
}

import { ReportRepo, IReportAllResponse } from '../repo/report'
import Report, { IReport } from '../../models/Report'
import { logger } from '../../config/logger'
import AppError from '../../utils/appError'
import { array } from 'joi'

export class ReportStorage implements ReportRepo {
    private scope = 'storage.report'

    async findAll(status: string, type: string, postLimit: number, postPage: number): Promise<IReport[]> {
        try {
            let dbObj = await Report.aggregate([
                { $match: { status: status, collection_type: type } },
                {
                    $lookup: {
                        from: 'users',
                        localField: "owner_id",
                        foreignField: "_id",
                        as: "creator",
                    },
                },
                { $group: { _id: "$receiver_id", content: { $push: "$$ROOT" } } },
                {
                    $lookup: {
                        from: type,
                        localField: "_id",
                        foreignField: "_id",
                        as: "content_category",
                    },
                },
                {
                    $addFields: {
                        contentAmount: {
                            $size: "$content",
                        },
                    },
                },
                { $sort: { contentAmount: -1 } },
                { $skip: postPage },
                { $limit: postLimit },
                {
                    $unset: [
                        "content.creator.email",
                        "content.creator.followers",
                        "content.creator.follows",
                        "content.creator.interests",
                        "content.creator.posts",
                        "content.creator.notifications",
                        "content.creator.birthday",
                        "content.creator.gender",
                        "content.creator.password",
                        "content.creator.bio",
                        "content.creator.createdAt",
                        "content.creator.updatedAt",
                        "content.creator.__v",
                        "content.status",
                        "content.receiver_id",
                        "content.collection_type",
                        "content.owner_id",
                        "content.__v",
                        "content_category.likes",
                        "content_category.__v",
                        "content_category.createdAt",
                        "content_category.updatedAt",
                        "content_category.owner_type",
                        "content_category.comments",
                        "content_category.views",
                        "content_category.category",
                        "content_category.followers",
                        "content_category.follows",
                        "content_category.interests",
                        "content_category.posts",
                        "content_category.notifications",
                        "content_category.gender",
                        "content_category.password",
                        "content_category.email",
                        "content_category.phone"
                    ],
                }
            ])

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.find: finished with error: ${error}`)
            throw error
        }
    }

    async findOne(query: Object): Promise<IReport> {
        try {
            let dbObj = await Report.findOne({ ...query })

            if (!dbObj) {
                logger.warn(`${this.scope}.get failed to findOne`)
                throw new AppError(404, 'report_404')
            }

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.findOne: finished with error: ${error}`)
            throw error
        }
    }

    async create(payload: IReport): Promise<IReport> {
        try {
            let dbObj = await Report.create(payload)

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.create: finished with error: ${error}`)
            throw error
        }
    }

    async updateMany(query: object, payload: object): Promise<Object> {
        try {
            let dbObj = await Report.updateMany(query, payload)
            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.find: finished with error: ${error}`)
            throw error
        }
    }

    async delete(id: string): Promise<any> {
        try {
            let dbObj = await Report.deleteMany({ receiver_id: id })

            if (!dbObj) {
                logger.warn(`${this.scope}.delete failed to findByIdAndDelete`)
                throw new AppError(404, 'report_404')
            }

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.delete: finished with error: ${error}`)
            throw error
        }
    }
}

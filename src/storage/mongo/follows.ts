import { FollowsRepo, IFollowsAllResponse } from '../repo/follows'
import Follows, { IFollows } from '../../models/Follows'
import { logger } from '../../config/logger'
import AppError from '../../utils/appError'
import { array } from 'joi'

export class FollowsStorage implements FollowsRepo {
    private scope = 'storage.follows'

    async find(query: Object): Promise<IFollows[]> {
        try {
            let dbObj = await Follows.find({ ...query })

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.find: finished with error: ${error}`)
            throw error
        }
    }

    async findIn(query: any, id: string): Promise<IFollows[]> {
        try {
            let dbObj = await Follows.find({ 'user_id': { $in: query }, 'follower_id': id })

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.find: finished with error: ${error}`)
            throw error
        }
    }

    async findPending(query: any): Promise<{ result: IFollows[], next: Boolean, previous: Boolean }> {
        try {
            const limit = parseInt(query.limit) || 9
            const page = parseInt(query.page) || 1
            let previous = true
            let next = true
            delete query.limit
            delete query.page
            const startIndex = (page - 1) * limit
            const endIndex = page * limit
            const result = await Follows.find({ ...query }).populate([
                { path: 'follower_id', select: 'first_name last_name category avatar type username' },
                { path: 'user_id', select: 'first_name last_name category avatar type username' }
            ]).limit(limit * 1).skip(startIndex).exec()
            const nextPage = await Follows.find({ ...query }).limit(limit * 1).skip(endIndex).exec()
            if (page === 1) {
                previous = false
            }
            if (!nextPage.length) {
                next = false
            }
            let dbObj = {
                result,
                next,
                previous
            }
            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.find: finished with error: ${error}`)
            throw error
        }
    }

    async findOne(query: Object): Promise<IFollows> {
        try {
            let dbObj = await Follows.findOne({ ...query })

            if (!dbObj) {
                logger.warn(`${this.scope}.get failed to findOne`)
                throw new AppError(404, 'follow_404')
            }

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.findOne: finished with error: ${error}`)
            throw error
        }
    }

    async create(payload: IFollows): Promise<IFollows> {
        try {
            let dbObj = await Follows.create(payload)

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.create: finished with error: ${error}`)
            throw error
        }
    }

    async update(id: Object, payload: IFollows | Object): Promise<IFollows> {
        try {
            let dbObj = await Follows.findByIdAndUpdate(id, payload, {
                new: true
            })

            if (!dbObj) {
                logger.warn(`${this.scope}.update failed to findByIdAndUpdate`)
                throw new AppError(404, 'follow_404')
            }

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.update: finished with error: ${error}`)
            throw error
        }
    }

    async delete(id: string): Promise<any> {
        try {
            let dbObj = await Follows.findByIdAndDelete(id)

            if (!dbObj) {
                logger.warn(`${this.scope}.delete failed to findByIdAndDelete`)
                throw new AppError(404, 'follow_404')
            }

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.delete: finished with error: ${error}`)
            throw error
        }
    }
}

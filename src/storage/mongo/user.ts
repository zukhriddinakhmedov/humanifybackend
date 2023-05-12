import { UserRepo, IUserAllResponse } from '../repo/user'
import User, { IUser } from '../../models/User'
import { logger } from '../../config/logger'
import AppError from '../../utils/appError'

export class UserStorage implements UserRepo {
    private scope = 'storage.user'

    async findLogin(query: Object): Promise<IUser[]> {
        try {
            let dbObj = await User.find({ ...query })

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.find: finished with error: ${error}`)
            throw error
        }
    }

    async find(query: Object): Promise<IUser[]> {
        try {
            let dbObj = await User.find({ ...query })
            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.find: finished with error: ${error}`)
            throw error
        }
    }
    async findSearch(query: any): Promise<Object> {
        try {
            const limit = parseInt(query.limit) || 9
            const page = parseInt(query.page) || 1
            let previous = true
            let next = true
            delete query.limit
            delete query.page
            const startIndex = (page - 1) * limit
            const endIndex = page * limit
            const result = await User.find({ ...query }, { first_name: true, last_name: true, avatar: true, category: true, type: true, username: true, status: true }).limit(limit * 1).skip(startIndex).exec()
            const nextPage = await User.find({ ...query }, { first_name: true }).limit(limit * 1).skip(endIndex).exec()
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
    async findDelete(query: Object): Promise<IUser> {
        try {
            let dbObj = await User.findOne({ ...query })

            if (!dbObj) {
                logger.warn(`${this.scope}.get failed to findOne`)
                throw new AppError(404, 'user_404')
            }

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.findOne: finished with error: ${error}`)
            throw error
        }
    }

    async findOne(query: Object): Promise<IUser> {
        try {
            let dbObj = await User.findOne({ ...query }, { password: false })

            if (!dbObj) {
                logger.warn(`${this.scope}.get failed to findOne`)
                throw new AppError(404, 'user_404')
            } else if (dbObj.status !== 'active') {
                throw new AppError(403, 'auth_401.1')
            }

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.findOne: finished with error: ${error}`)
            throw error
        }
    }

    async create(payload: IUser): Promise<IUser> {
        try {
            let dbObj = await User.create(payload)

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.create: finished with error: ${error}`)
            throw error
        }
    }

    async update(id: string, payload: IUser | Object): Promise<IUser> {
        try {
            let dbObj = await User.findByIdAndUpdate(id, payload, {
                new: true
            })

            if (!dbObj) {
                logger.warn(`${this.scope}.update failed to findByIdAndUpdate`)
                throw new AppError(404, 'user_404')
            }

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.update: finished with error: ${error}`)
            throw error
        }
    }

    async delete(id: string): Promise<any> {
        try {
            let dbObj = await User.findByIdAndDelete(id)

            if (!dbObj) {
                logger.warn(`${this.scope}.delete failed to findByIdAndDelete`)
                throw new AppError(404, 'user_404')
            }

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.delete: finished with error: ${error}`)
            throw error
        }
    }
}

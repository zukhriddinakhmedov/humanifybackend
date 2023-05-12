import { DeletedUserRepo, IDeletedUserAllResponse } from '../repo/deletedUser'
import DeletedUser, { IDeletedUser } from '../../models/DeletedUser'
import { logger } from '../../config/logger'
import AppError from '../../utils/appError'

export class DeletedUserStorage implements DeletedUserRepo {
    private scope = 'storage.deletedUser'

    async find(query: any): Promise<{ result: IDeletedUser[], next: Boolean, previous: Boolean }> {
        try {
            const limit = parseInt(query.limit) || 9
            const page = parseInt(query.page) || 1
            let previous = true
            let next = true
            delete query.limit
            delete query.page
            const startIndex = (page - 1) * limit
            const endIndex = page * limit
            const result = await DeletedUser.find({ ...query }).limit(limit * 1).skip(startIndex).exec()
            const nextPage = await DeletedUser.find({ ...query }).limit(limit * 1).skip(endIndex).exec()
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

    async findOne(query: Object): Promise<IDeletedUser> {
        try {
            let dbObj = await DeletedUser.findOne({ ...query }, { password: false })

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

    async create(payload: IDeletedUser): Promise<IDeletedUser> {
        try {
            let dbObj = await DeletedUser.create(payload)

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.create: finished with error: ${error}`)
            throw error
        }
    }

    async delete(id: string): Promise<any> {
        try {
            let dbObj = await DeletedUser.findByIdAndDelete(id)

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

import { DeletedPostRepo, IDeletedPostAllResponse } from '../repo/deletedPost'
import DeletedPost, { IDeletedPost } from '../../models/DeletedPost'
import { logger } from '../../config/logger'
import AppError from '../../utils/appError'

export class DeletedPostStorage implements DeletedPostRepo {
    private scope = 'storage.deletedPost'

    async find(query: Object): Promise<IDeletedPost[]> {
        try {
            let dbObj = await DeletedPost.find({ ...query })

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.find: finished with error: ${error}`)
            throw error
        }
    }

    async findOne(query: Object): Promise<IDeletedPost> {
        try {
            let dbObj = await DeletedPost.findOne({ ...query })

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

    async create(payload: IDeletedPost): Promise<IDeletedPost> {
        try {
            let dbObj = await DeletedPost.create(payload)

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.create: finished with error: ${error}`)
            throw error
        }
    }

    async delete(id: string): Promise<any> {
        try {
            let dbObj = await DeletedPost.findByIdAndDelete(id)

            if (!dbObj) {
                logger.warn(`${this.scope}.delete failed to findByIdAndDelete`)
                throw new AppError(404, 'post_404')
            }

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.delete: finished with error: ${error}`)
            throw error
        }
    }
}

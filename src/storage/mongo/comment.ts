import { CommentRepo, ICommentAllResponse } from '../repo/comment'
import Comment, { IComment } from '../../models/Comment'
import { logger } from '../../config/logger'
import AppError from '../../utils/appError'

export class CommentStorage implements CommentRepo {
    private scope = 'storage.comment'

    async find(query: Object): Promise<IComment[]> {
        try {
            let dbObj = await Comment.find({ ...query })

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.find: finished with error: ${error}`)
            throw error
        }
    }

    async findOne(query: Object): Promise<IComment> {
        try {
            let dbObj = await Comment.findOne({ ...query })

            if (!dbObj) {
                logger.warn(`${this.scope}.get failed to findOne`)
                throw new AppError(404, 'comment_404')
            }

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.findOne: finished with error: ${error}`)
            throw error
        }
    }

    async create(payload: Object): Promise<IComment> {
        try {
            let dbObj = await Comment.create(payload)

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.create: finished with error: ${error}`)
            throw error
        }
    }

    async update(id: Object, payload: IComment | Object): Promise<IComment> {
        try {
            let dbObj = await Comment.findByIdAndUpdate(id, payload, {
                new: true
            })

            if (!dbObj) {
                logger.warn(`${this.scope}.update failed to findByIdAndUpdate`)
                throw new AppError(404, 'comment_404')
            }

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.update: finished with error: ${error}`)
            throw error
        }
    }

    async delete(id: string): Promise<IComment> {
        try {
            let dbObj = await Comment.findByIdAndDelete(id)

            if (!dbObj) {
                logger.warn(`${this.scope}.delete failed to findByIdAndDelete`)
                throw new AppError(404, 'comment_404')
            }

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.delete: finished with error: ${error}`)
            throw error
        }
    }

    async deleteMany(id: string): Promise<any> {
        try {
            let dbObj = await Comment.deleteMany({ post_id: id })

            if (!dbObj) {
                logger.warn(`${this.scope}.delete failed to findByIdAndDelete`)
                throw new AppError(404, 'comment_404')
            }

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.delete: finished with error: ${error}`)
            throw error
        }
    }
}

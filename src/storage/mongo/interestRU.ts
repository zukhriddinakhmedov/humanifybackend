import { InterestRURepo, IInterestRUAllResponse } from '../repo/interestRU'
import InterestRU, { IInterestRU } from '../../models/interestRU'
import { logger } from '../../config/logger'
import AppError from '../../utils/appError'

export class InterestRUStorage implements InterestRURepo {
    private scope = 'storage.interestUZ'

    async find(query: Object): Promise<IInterestRU[]> {
        try {
            let dbObj = await InterestRU.find({ ...query })

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.find: finished with error: ${error}`)
            throw error
        }
    }

    async findOne(query: Object): Promise<IInterestRU> {
        try {
            let dbObj = await InterestRU.findOne({ ...query })

            if (!dbObj) {
                logger.warn(`${this.scope}.get failed to findOne`)
                throw new AppError(404, 'interest_404')
            }

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.findOne: finished with error: ${error}`)
            throw error
        }
    }

    async create(payload: IInterestRU | object): Promise<IInterestRU> {
        try {
            let dbObj = await InterestRU.create(payload)

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.create: finished with error: ${error}`)
            throw error
        }
    }

    async update(id: Object, payload: IInterestRU): Promise<IInterestRU> {
        try {
            let dbObj = await InterestRU.findByIdAndUpdate(id, payload, {
                new: true
            })

            if (!dbObj) {
                logger.warn(`${this.scope}.update failed to findByIdAndUpdate`)
                throw new AppError(404, 'interest_404')
            }

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.update: finished with error: ${error}`)
            throw error
        }
    }

    async delete(id: Object): Promise<any> {
        try {
            let dbObj = await InterestRU.findByIdAndDelete(id)

            if (!dbObj) {
                logger.warn(`${this.scope}.delete failed to findByIdAndDelete`)
                throw new AppError(404, 'interest_404')
            }

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.delete: finished with error: ${error}`)
            throw error
        }
    }
}

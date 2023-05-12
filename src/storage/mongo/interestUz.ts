import { InterestUZRepo, IInterestUZAllResponse } from '../repo/interestUZ'
import InterestUZ, { IInterestUZ } from '../../models/InterestUZ'
import { logger } from '../../config/logger'
import AppError from '../../utils/appError'

export class InterestUZStorage implements InterestUZRepo {
    private scope = 'storage.interestUZ'

    async find(query: Object): Promise<IInterestUZ[]> {
        try {
            let dbObj = await InterestUZ.find({ ...query })

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.find: finished with error: ${error}`)
            throw error
        }
    }

    async findOne(query: Object): Promise<IInterestUZ> {
        try {
            let dbObj = await InterestUZ.findOne({ ...query })

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

    async create(payload: IInterestUZ | object): Promise<IInterestUZ> {
        try {
            let dbObj = await InterestUZ.create(payload)

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.create: finished with error: ${error}`)
            throw error
        }
    }

    async update(id: Object, payload: IInterestUZ | Object): Promise<IInterestUZ> {
        try {
            let dbObj = await InterestUZ.findByIdAndUpdate(id, payload, {
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
            let dbObj = await InterestUZ.findByIdAndDelete(id)

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

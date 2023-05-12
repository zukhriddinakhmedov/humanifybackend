import { MakeInfluencerRepo, IMakeInfluencerAllResponse } from '../repo/makeInfluencer'
import MakeInfluencer, { IMakeInfluencer } from '../../models/MakeInfluencer'
import { logger } from '../../config/logger'
import AppError from '../../utils/appError'

export class MakeInfluencerStorage implements MakeInfluencerRepo {
    private scope = 'storage.makeInfluencer'

    async find(query: Object): Promise<IMakeInfluencer[]> {
        try {
            let dbObj = await MakeInfluencer.find({ ...query }).populate([
                { path: 'user_id', select: 'first_name last_name category avatar type username' },
            ])

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.find: finished with error: ${error}`)
            throw error
        }
    }

    async findOne(query: Object): Promise<IMakeInfluencer> {
        try {
            let dbObj = await MakeInfluencer.findOne({ ...query })

            if (!dbObj) {
                logger.warn(`${this.scope}.get failed to findOne`)
                throw new AppError(404, 'influencer_404')
            }

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.findOne: finished with error: ${error}`)
            throw error
        }
    }

    async create(payload: IMakeInfluencer | object): Promise<IMakeInfluencer> {
        try {
            let dbObj = await MakeInfluencer.create(payload)

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.create: finished with error: ${error}`)
            throw error
        }
    }

    async delete(id: Object): Promise<any> {
        try {
            let dbObj = await MakeInfluencer.findByIdAndDelete(id)

            if (!dbObj) {
                logger.warn(`${this.scope}.delete failed to findByIdAndDelete`)
                throw new AppError(404, 'influencer_404')
            }

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.delete: finished with error: ${error}`)
            throw error
        }
    }
}

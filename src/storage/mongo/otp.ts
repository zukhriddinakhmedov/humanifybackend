import { OTPRepo } from '../repo/otp'
import OTP, { IOTP } from '../../models/OTP'
import { logger } from '../../config/logger'
import AppError from '../../utils/appError'

export class OTPStorage implements OTPRepo {
    private scope = 'storage.OTP'

    async find(query: Object): Promise<IOTP[]> {
        try {
            const otpes = await OTP.find(query)

            return otpes
        } catch (error) {
            logger.error(`${this.scope}.find: finished with error: ${error}`)
            throw error
        }
    }

    async findOne(query: Object): Promise<IOTP> {
        try {
            const otp = await OTP.findOne(query)

            if (!otp) {
                logger.warn(`${this.scope}.get failed to findOne`)
                throw new AppError(404, 'otp_404')
            }

            return otp
        } catch (error) {
            logger.error(`${this.scope}.findOne: finished with error: ${error}`)
            throw error
        }
    }

    async create(payload: Object): Promise<IOTP> {
        try {
            const newOTP = await OTP.create(payload)
            return newOTP
        } catch (error) {
            logger.error(`${this.scope}.create: finished with error: ${error}`)
            throw error
        }
    }

    async update(query: Object, payload: IOTP): Promise<IOTP> {
        try {
            const otp = await OTP.findOneAndUpdate(query, payload, {
                new: true
            })

            if (!otp) {
                logger.warn(`${this.scope}.update failed to findOneAndUpdate`)
                throw new AppError(404, 'otp_404')
            }

            return otp
        } catch (error) {
            logger.error(`${this.scope}.update: finished with error: ${error}`)
            throw error
        }
    }

    async delete(query: Object): Promise<IOTP> {
        try {
            const otp = await OTP.findOneAndDelete(query)

            if (!otp) {
                logger.warn(`${this.scope}.delete failed to findOneAndDelete`)
                throw new AppError(404, 'otp_404')
            }

            return otp
        } catch (error) {
            logger.error(`${this.scope}.delete: finished with error: ${error}`)
            throw error
        }
    }
}

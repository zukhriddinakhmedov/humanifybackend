import { IOTP } from '../../models/OTP'

export interface OTPRepo {
    find(query: Object): Promise<IOTP[]>
    findOne(query: Object): Promise<IOTP>
    create(payload: IOTP): Promise<IOTP>
    update(id: string, payload: IOTP): Promise<IOTP>
    delete(id: string): Promise<IOTP>
}
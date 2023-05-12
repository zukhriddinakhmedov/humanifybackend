import { IInterestUZ } from '../../models/InterestUZ'

export interface IInterestUZAllResponse {
    payloads: IInterestUZ[]
    count: number
}

export interface InterestUZRepo {
    find(query: Object): Promise<IInterestUZ[]>
    findOne(query: Object): Promise<IInterestUZ>
    create(payload: IInterestUZ): Promise<IInterestUZ>
    update(id: string, payload: IInterestUZ): Promise<IInterestUZ>
    delete(id: string): Promise<IInterestUZ>
}

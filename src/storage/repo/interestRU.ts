import { IInterestRU } from '../../models/interestRU'

export interface IInterestRUAllResponse {
    payloads: IInterestRU[]
    count: number
}

export interface InterestRURepo {
    find(query: Object): Promise<IInterestRU[]>
    findOne(query: Object): Promise<IInterestRU>
    create(payload: IInterestRU): Promise<IInterestRU>
    update(id: string, payload: IInterestRU): Promise<IInterestRU>
    delete(id: string): Promise<IInterestRU>
}

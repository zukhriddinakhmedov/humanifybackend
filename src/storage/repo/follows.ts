import { IFollows } from '../../models/Follows';

export interface IFollowsAllResponse {
    payloads: IFollows[]
    count: number
}

export interface FollowsRepo {
    find(query: Object): Promise<any>
    findOne(query: Object): Promise<IFollows>
    create(payload: IFollows): Promise<IFollows>
    update(id: string, payload: IFollows): Promise<IFollows>
    delete(id: string): Promise<IFollows>
}
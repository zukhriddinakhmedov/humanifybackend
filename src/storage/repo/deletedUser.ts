import { IDeletedUser } from '../../models/DeletedUser'

export interface IDeletedUserAllResponse {
    payloads: IDeletedUser[]
    count: number
}

export interface DeletedUserRepo {
    find(query: Object): Promise<Object>
    findOne(query: Object): Promise<IDeletedUser>
    create(payload: IDeletedUser): Promise<IDeletedUser>
    delete(id: string): Promise<IDeletedUser>
}

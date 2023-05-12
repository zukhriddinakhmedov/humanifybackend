import { IDeletedPost } from '../../models/DeletedPost'

export interface IDeletedPostAllResponse {
    payloads: IDeletedPost[]
    count: number
}

export interface DeletedPostRepo {
    find(query: Object): Promise<IDeletedPost[]>
    findOne(query: Object): Promise<IDeletedPost>
    create(payload: IDeletedPost): Promise<IDeletedPost>
    delete(id: string): Promise<IDeletedPost>
}

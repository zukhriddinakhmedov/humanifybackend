import { IPost } from '../../models/Post'

export interface IPostAllResponse {
    payloads: IPost[]
    count: number
}

export interface PostRepo {
    findOne(query: Object): Promise<IPost>
    create(payload: IPost): Promise<IPost>
    update(id: string, payload: IPost): Promise<IPost>
    delete(id: string): Promise<IPost>
}

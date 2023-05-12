import { IComment } from '../../models/Comment';

export interface ICommentAllResponse {
    payloads: IComment[]
    count: number
}

export interface CommentRepo {
    find(query: Object): Promise<any>
    findOne(query: Object): Promise<IComment>
    create(payload: IComment): Promise<IComment>
    update(id: string, payload: IComment): Promise<IComment>
    delete(id: string): Promise<IComment>
}
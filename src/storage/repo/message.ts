import { IMessage } from '../../models/Message'

export interface IMessageAllResponse {
    payloads: IMessage[]
    count: number
}

export interface MessageRepo {
    findOne(query: Object): Promise<IMessage>
    create(payload: IMessage): Promise<IMessage>
    update(id: string, payload: IMessage): Promise<IMessage>
    delete(id: string): Promise<IMessage>
}

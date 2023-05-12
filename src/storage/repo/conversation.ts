import { IConversation } from '../../models/Conversation'

export interface ConversationRepo {
    findOne(query: Object): Promise<IConversation>
    create(payload: IConversation): Promise<IConversation>
    delete(id: string): Promise<IConversation>
}
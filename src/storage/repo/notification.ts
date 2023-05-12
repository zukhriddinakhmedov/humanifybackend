import { INotification } from './../../models/Notification';

export interface INotificationAllResponse {
    payloads: INotification[]
    count: number
}

export interface NotificationRepo {
    findOne(query: Object): Promise<INotification>
    create(payload: INotification): Promise<INotification>
    delete(id: string): Promise<INotification>
}
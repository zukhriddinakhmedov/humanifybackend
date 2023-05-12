import { IReport } from '../../models/Report';

export interface IReportAllResponse {
    payloads: IReport[]
    count: number
}

export interface ReportRepo {
    findOne(query: Object): Promise<IReport>
    create(payload: IReport): Promise<IReport>
    delete(id: string): Promise<IReport>
}
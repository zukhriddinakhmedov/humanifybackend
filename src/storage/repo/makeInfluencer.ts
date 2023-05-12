import { IMakeInfluencer } from '../../models/MakeInfluencer'

export interface IMakeInfluencerAllResponse {
    payloads: IMakeInfluencer[]
    count: number
}

export interface MakeInfluencerRepo {
    find(query: Object): Promise<IMakeInfluencer[]>
    findOne(query: Object): Promise<IMakeInfluencer>
    create(payload: IMakeInfluencer): Promise<IMakeInfluencer>
    delete(id: string): Promise<IMakeInfluencer>
}
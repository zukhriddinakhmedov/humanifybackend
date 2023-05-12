import { IFavorites } from '../../models/Favorites';

export interface IFavoritesAllResponse {
    payloads: IFavorites[]
    count: number
}

export interface FavoritesRepo {
    find(query: Object): Promise<any>
    findOne(query: Object): Promise<any>
    create(payload: IFavorites): Promise<IFavorites>
    update(id: string, payload: IFavorites): Promise<IFavorites>
    delete(id: string): Promise<IFavorites>
}
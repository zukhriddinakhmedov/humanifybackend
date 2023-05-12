import { FavoritesRepo, IFavoritesAllResponse } from '../repo/favorites'
import Favorites, { IFavorites } from '../../models/Favorites'
import { logger } from '../../config/logger'
import AppError from '../../utils/appError'

export class FavoritesStorage implements FavoritesRepo {
    private scope = 'storage.favorites'

    async find(query: Object): Promise<IFavorites[]> {
        try {
            let dbObj = await Favorites.find({ ...query })

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.find: finished with error: ${error}`)
            throw error
        }
    }

    async findOne(query: Object): Promise<IFavorites> {
        try {
            let dbObj = await Favorites.findOne({ ...query })

            if (!dbObj) {
                logger.warn(`${this.scope}.get failed to findOne`)
                throw new AppError(404, 'favorites_404')
            }

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.findOne: finished with error: ${error}`)
            throw error
        }
    }

    async create(payload: Object): Promise<IFavorites> {
        try {
            let dbObj = await Favorites.create(payload)

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.create: finished with error: ${error}`)
            throw error
        }
    }

    async update(id: Object, payload: IFavorites): Promise<IFavorites> {
        try {
            let dbObj = await Favorites.findByIdAndUpdate(id, payload, {
                new: true
            })

            if (!dbObj) {
                logger.warn(`${this.scope}.update failed to findByIdAndUpdate`)
                throw new AppError(404, 'favorites_404')
            }

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.update: finished with error: ${error}`)
            throw error
        }
    }

    async delete(id: string): Promise<IFavorites> {
        try {
            let dbObj = await Favorites.findByIdAndDelete(id)

            if (!dbObj) {
                logger.warn(`${this.scope}.delete failed to findByIdAndDelete`)
                throw new AppError(404, 'favorites_404')
            }

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.delete: finished with error: ${error}`)
            throw error
        }
    }
}

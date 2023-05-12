import { PostRepo, IPostAllResponse } from '../repo/post'
import Post, { IPost } from '../../models/Post'
import { logger } from '../../config/logger'
import AppError from '../../utils/appError'
import Comment from '../../models/Comment'

export class PostStorage implements PostRepo {
    private scope = 'storage.post'

    async findOneUser(id: string): Promise<Object> {
        try {
            let dbObj = await Post.aggregate([
                { $match: { _id: id } },
                {
                    $lookup: {
                        from: "users",
                        localField: "owner_id",
                        foreignField: "_id",
                        as: "creator",
                    },
                },
                {
                    $addFields: {
                        userLiked: {
                            $in: [id, "$likes"],
                        },
                        likesAmount: {
                            $size: "$likes",
                        },
                    },
                },
                {
                    $unset: [
                        "likes",
                        "owner_id",
                        "creator.email",
                        "creator.followers",
                        "creator.follows",
                        "creator.interests",
                        "creator.posts",
                        "creator.notifications",
                        "creator.birthday",
                        "creator.gender",
                        "creator.password",
                        "creator.bio",
                        "creator.createdAt",
                        "creator.updatedAt",
                        "creator.__v"
                    ],
                }
            ])
            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.find: finished with error: ${error}`)
            throw error
        }
    }

    async findOwnPosts(postLimit: number, postPage: number): Promise<Object> {
        try {
            let dbObj = await Post.aggregate([
                {
                    $addFields: {
                        likesAmount: {
                            $size: "$likes",
                        },
                    },
                },
                { $skip: postPage },
                { $limit: postLimit }
            ])
            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.find: finished with error: ${error}`)
            throw error
        }
    }

    async findAdminUser(postLimit: number, postPage: number, searchValue: string): Promise<Object> {
        try {
            let dbObj = {}
            if (searchValue) {
                dbObj = await Post.aggregate([
                    { $match: { _id: searchValue } },
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner_id",
                            foreignField: "_id",
                            as: "creator",
                        },
                    },
                    {
                        $addFields: {
                            likesAmount: {
                                $size: "$likes",
                            },
                        },
                    },
                    { $skip: postPage },
                    { $limit: postLimit },
                    {
                        $unset: [
                            "likes",
                            "owner_id",
                            "creator.email",
                            "creator.followers",
                            "creator.follows",
                            "creator.interests",
                            "creator.posts",
                            "creator.notifications",
                            "creator.birthday",
                            "creator.gender",
                            "creator.password",
                            "creator.bio",
                            "creator.createdAt",
                            "creator.updatedAt",
                            "creator.__v"
                        ],
                    }
                ])
            } else {
                dbObj = await Post.aggregate([
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner_id",
                            foreignField: "_id",
                            as: "creator",
                        },
                    },
                    {
                        $addFields: {
                            likesAmount: {
                                $size: "$likes",
                            },
                        },
                    },
                    { $skip: postPage },
                    { $limit: postLimit },
                    {
                        $unset: [
                            "likes",
                            "owner_id",
                            "creator.email",
                            "creator.followers",
                            "creator.follows",
                            "creator.interests",
                            "creator.posts",
                            "creator.notifications",
                            "creator.birthday",
                            "creator.gender",
                            "creator.password",
                            "creator.bio",
                            "creator.createdAt",
                            "creator.updatedAt",
                            "creator.__v"
                        ],
                    }
                ])
            }
            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.find: finished with error: ${error}`)
            throw error
        }
    }

    async findLike(id: string, postLimit: number, postPage: number): Promise<Object> {
        try {
            let dbObj = await Post.aggregate([
                { $match: { status: 'active' } },
                {
                    $lookup: {
                        from: "users",
                        localField: "owner_id",
                        foreignField: "_id",
                        as: "creator",
                    },
                },
                {
                    $addFields: {
                        userLiked: {
                            $in: [id, "$likes"],
                        },
                        likesAmount: {
                            $size: "$likes",
                        },
                    },
                },
                { $skip: postPage },
                { $limit: postLimit },
                {
                    $unset: [
                        "likes",
                        "owner_id",
                        "creator.email",
                        "creator.followers",
                        "creator.follows",
                        "creator.interests",
                        "creator.posts",
                        "creator.notifications",
                        "creator.birthday",
                        "creator.gender",
                        "creator.password",
                        "creator.bio",
                        "creator.createdAt",
                        "creator.updatedAt",
                        "creator.__v"
                    ],
                }
            ])
            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.find: finished with error: ${error}`)
            throw error
        }
    }

    async findWithCategory(id: string, postLimit: number, postPage: number, search: any): Promise<Object> {
        try {
            let dbObj = await Post.aggregate([
                {
                    $match: {
                        status: 'active',
                        category: {
                            $in: search
                        }
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "owner_id",
                        foreignField: "_id",
                        as: "creator",
                    },
                },
                {
                    $addFields: {
                        userLiked: {
                            $in: [id, "$likes"],
                        },
                        likesAmount: {
                            $size: "$likes",
                        },
                    },
                },
                { $skip: postPage },
                { $limit: postLimit },
                {
                    $unset: [
                        "likes",
                        "owner_id",
                        "creator.email",
                        "creator.followers",
                        "creator.follows",
                        "creator.interests",
                        "creator.posts",
                        "creator.notifications",
                        "creator.birthday",
                        "creator.gender",
                        "creator.password",
                        "creator.bio",
                        "creator.createdAt",
                        "creator.updatedAt",
                        "creator.__v"
                    ],
                }
            ])
            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.find: finished with error: ${error}`)
            throw error
        }
    }

    async findWithId(id: string, postLimit: number, postPage: number, search: any): Promise<Object> {
        try {
            let dbObj = await Post.aggregate([
                {
                    $match: {
                        status: 'active',
                        _id: { "$in": search },
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "owner_id",
                        foreignField: "_id",
                        as: "creator",
                    },
                },
                {
                    $addFields: {
                        userLiked: {
                            $in: [id, "$likes"],
                        },
                        likesAmount: {
                            $size: "$likes",
                        },
                    },
                },
                { $skip: postPage },
                { $limit: postLimit },
                {
                    $unset: [
                        "likes",
                        "owner_id",
                        "creator.email",
                        "creator.followers",
                        "creator.follows",
                        "creator.interests",
                        "creator.posts",
                        "creator.notifications",
                        "creator.birthday",
                        "creator.gender",
                        "creator.password",
                        "creator.bio",
                        "creator.createdAt",
                        "creator.updatedAt",
                        "creator.__v"
                    ],
                }
            ])
            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.find: finished with error: ${error}`)
            throw error
        }
    }

    async findUserPosts(id: string, postLimit: number, postPage: number, user_id: string): Promise<Object> {
        try {
            let dbObj = await Post.aggregate([
                { $match: { $and: [{ "status": "active" }, { "owner_id": user_id }] } },
                { $sort: { createdAt: -1 } },
                {
                    $lookup: {
                        from: "users",
                        localField: "owner_id",
                        foreignField: "_id",
                        as: "creator",
                    },
                },
                {
                    $addFields: {
                        userLiked: {
                            $in: [id, "$likes"],
                        },
                        likesAmount: {
                            $size: "$likes",
                        },
                    },
                },
                { $skip: postPage },
                { $limit: postLimit },
                {
                    $unset: [
                        "likes",
                        "owner_id",
                        "creator.email",
                        "creator.followers",
                        "creator.follows",
                        "creator.interests",
                        "creator.posts",
                        "creator.notifications",
                        "creator.birthday",
                        "creator.gender",
                        "creator.password",
                        "creator.bio",
                        "creator.createdAt",
                        "creator.updatedAt",
                        "creator.__v"
                    ],
                }
            ])
            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.find: finished with error: ${error}`)
            throw error
        }
    }

    async findComment(_id: string, postLimit: number, postPage: number, id: string): Promise<Object> {
        try {
            let dbObj = await Comment.aggregate([
                { $match: { post_id: _id } },
                { $sort: { createdAt: -1 } },
                {
                    $lookup: {
                        from: "users",
                        localField: "likes",
                        foreignField: "_id",
                        as: "liker",
                    },
                },
                {
                    $lookup: {
                        from: "comments",
                        localField: "reply_id",
                        foreignField: "_id",
                        as: "reply",
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "reply.owner_id",
                        foreignField: "_id",
                        as: "username",
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "owner_id",
                        foreignField: "_id",
                        as: "creator",
                    },
                },
                { $skip: postPage },
                { $limit: postLimit },
                {
                    $addFields: {
                        userLiked: {
                            $in: [id, "$likes"],
                        },
                        likesAmount: {
                            $size: "$likes",
                        },
                    },
                },
                {
                    $unset: [
                        "likes",
                        "owner_id",
                        "reply_id",
                        "liker.email",
                        "liker.first_name",
                        "liker.last_name",
                        "liker.avatar",
                        "liker.followers",
                        "liker.follows",
                        "liker.interests",
                        "liker.posts",
                        "liker.notifications",
                        "liker.birthday",
                        "liker.gender",
                        "liker.phone",
                        "liker.password",
                        "liker.bio",
                        "liker.type",
                        "liker.account_type",
                        "liker.status",
                        "liker.createdAt",
                        "liker.updatedAt",
                        "liker.__v",
                        "creator.email",
                        "creator.followers",
                        "creator.follows",
                        "creator.interests",
                        "creator.posts",
                        "creator.notifications",
                        "creator.birthday",
                        "creator.gender",
                        "creator.password",
                        "creator.bio",
                        "creator.phone",
                        "creator.type",
                        "creator.account_type",
                        "creator.status",
                        "creator.createdAt",
                        "creator.updatedAt",
                        "creator.__v",
                        "username.email",
                        "username.first_name",
                        "username.last_name",
                        "username.followers",
                        "username.follows",
                        "username.interests",
                        "username.posts",
                        "username.notifications",
                        "username.birthday",
                        "username.gender",
                        "username.password",
                        "username.bio",
                        "username.phone",
                        "username.type",
                        "username.account_type",
                        "username.status",
                        "username.createdAt",
                        "username.updatedAt",
                        "username.__v",
                        "username._id",
                        "username.avatar",
                        "reply.createdAt",
                        "reply.updatedAt",
                        "reply.post_id",
                        "reply.likes",
                    ],
                }
            ])
            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.find: finished with error: ${error}`)
            throw error
        }
    }

    async updateMany(query: object, payload: Object): Promise<Object> {
        try {
            let dbObj = await Post.updateMany(query, payload)
            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.find: finished with error: ${error}`)
            throw error
        }
    }

    async findOne(query: Object): Promise<IPost> {
        try {
            let dbObj = await Post.findOne({ ...query }).populate('owner_id', 'first_name last_name avatar username')

            if (!dbObj) {
                logger.warn(`${this.scope}.get failed to findOne`)
                throw new AppError(404, 'post_404')
            }

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.findOne: finished with error: ${error}`)
            throw error
        }
    }

    async findOneLike(query: Object): Promise<IPost> {
        try {
            let dbObj = await Post.findOne({ ...query })

            if (!dbObj) {
                logger.warn(`${this.scope}.get failed to findOne`)
                throw new AppError(404, 'post_404')
            }

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.findOne: finished with error: ${error}`)
            throw error
        }
    }

    async create(payload: IPost): Promise<IPost> {
        try {
            let dbObj = await Post.create(payload)

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.create: finished with error: ${error}`)
            throw error
        }
    }

    async update(id: Object, payload: IPost | Object): Promise<IPost> {
        try {
            let dbObj = await Post.findByIdAndUpdate(id, payload, {
                new: true
            })

            if (!dbObj) {
                logger.warn(`${this.scope}.update failed to findByIdAndUpdate`)
                throw new AppError(404, 'post_404')
            }

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.update: finished with error: ${error}`)
            throw error
        }
    }

    async delete(id: Object): Promise<any> {
        try {
            let dbObj = await Post.findByIdAndDelete(id)

            if (!dbObj) {
                logger.warn(`${this.scope}.delete failed to findByIdAndDelete`)
                throw new AppError(404, 'post_404')
            }

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.delete: finished with error: ${error}`)
            throw error
        }
    }
}

import { MessageStorage } from './mongo/message';
import { AdminStorage } from './mongo/admin'
import { UserStorage } from './mongo/user'
import { OTPStorage } from './mongo/otp'
import { DeletedUserStorage } from './mongo/deletedUser'
import { DeletedPostStorage } from './mongo/deletedPost'
import { InterestUZStorage } from './mongo/interestUz'
import { InterestRUStorage } from "./mongo/interestRU"
import { PostStorage } from "./mongo/post"
import { NotificationStorage } from "./mongo/notification"
import { FollowsStorage } from "./mongo/follows"
import { FavoritesStorage } from "./mongo/favorites"
import { MakeInfluencerStorage } from "./mongo/makeInfluencer"
import { CommentStorage } from "./mongo/comment"
import { ReportStorage } from "./mongo/report"
import { ConversationStorage } from "./mongo/conversation"
interface IStorage {
    admin: AdminStorage
    user: UserStorage
    interestUZ: InterestUZStorage
    interestRU: InterestRUStorage
    otp: OTPStorage
    deletedUser: DeletedUserStorage
    deletedPost: DeletedPostStorage
    post: PostStorage
    notification: NotificationStorage
    follows: FollowsStorage
    favorites: FavoritesStorage
    makeInfluencer: MakeInfluencerStorage
    comment: CommentStorage
    report: ReportStorage
    message: MessageStorage
    conversation: ConversationStorage
}

export let storage: IStorage = {
    admin: new AdminStorage(),
    user: new UserStorage(),
    otp: new OTPStorage(),
    deletedUser: new DeletedUserStorage(),
    deletedPost: new DeletedPostStorage(),
    interestUZ: new InterestUZStorage(),
    interestRU: new InterestRUStorage(),
    post: new PostStorage(),
    notification: new NotificationStorage(),
    follows: new FollowsStorage(),
    favorites: new FavoritesStorage(),
    makeInfluencer: new MakeInfluencerStorage(),
    comment: new CommentStorage(),
    report: new ReportStorage(),
    message: new MessageStorage(),
    conversation: new ConversationStorage()
}

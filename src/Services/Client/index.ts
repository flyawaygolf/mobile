import RequestEmitter, { requestParams } from './utils/RequestEmitter';
import UserManager from './Managers/UserManager';
import UserFlags from './Permissions/Flags';
import WebSocketRoutes from './Permissions/WebSocket';
import LanguageList from './utils/LanguageList';
import SessionManager from './Managers/SessionManager';
import GuildManager from './Managers/GuildManager';
import BlockManager from './Managers/BlockManager';
import MessageManager from './Managers/MessageManager';
import PushNoficationManager from './Managers/PushNoficationManager';
import SearchManager from './Managers/SearchManager';
import GolfManager from './Managers/GolfManager';
import FollowManager from './Managers/FollowManager';
import PostManager from './Managers/PostManager';
import FavoritesManager from './Managers/FavoritesManager';
import ExploreManager from './Managers/ExploreManager';

export const userFlags = UserFlags;
export const webSocketRoutes = WebSocketRoutes;
export const languageList = LanguageList;

class Client extends RequestEmitter {

    public static userFlags = UserFlags;
    public static webSocketRoutes = WebSocketRoutes;
    public static languageList = LanguageList;

    public user: UserManager;
    public sessions: SessionManager;
    public guilds: GuildManager;
    public block: BlockManager;
    public messages: MessageManager;
    public search: SearchManager;
    public pushNotification: PushNoficationManager;
    public golfs: GolfManager;
    public follows: FollowManager;
    public posts: PostManager;
    public favorites: FavoritesManager;
    public explore: ExploreManager;

    constructor(params: requestParams) {
        super(params);

        this.user = new UserManager(params);
        this.sessions = new SessionManager(params);
        this.guilds = new GuildManager(params);
        this.block = new BlockManager(params);
        this.messages = new MessageManager(params);
        this.search = new SearchManager(params);
        this.pushNotification = new PushNoficationManager(params);
        this.golfs = new GolfManager(params);
        this.follows = new FollowManager(params);
        this.posts = new PostManager(params);
        this.favorites = new FavoritesManager(params);
        this.explore = new ExploreManager(params);
    }

    public async status() {
        const request = await this.getRequest(`/status`);

        const response = request as {
            data: {
                "status": "Beta" | "Live" | "Deprecated",
                "api_version": string,
                "android_version": number,
                "ios_version": number
            }
        };
        return response;
      }

}

export default Client;

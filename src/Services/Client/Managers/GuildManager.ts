import RequestEmitter, { requestParams } from '../utils/RequestEmitter';
import { emptyResponse } from './Interfaces/Global';
import { guildCreateResponse, guildFetchResponse } from './Interfaces/Guild';

class GuildManager extends RequestEmitter {
  constructor(params: requestParams) {
    super(params);
  }

  public async create(users: Array<string>) {
    const request = await this.postRequest(`/guilds`, {
      users: users
    });

    const response = request as guildCreateResponse;
    return response;
  }

  public async leave(guild_id: string) {
    const request = await this.deleteRequest(`/guilds/${guild_id}`);

    const response = request as emptyResponse;
    return response;
  }

  public async fetch() {
    const request = await this.getRequest(`/guilds`);

    const response = request as guildFetchResponse;

    return response;
  }
}

export default GuildManager;

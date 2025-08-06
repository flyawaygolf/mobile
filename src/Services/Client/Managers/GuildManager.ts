import RequestEmitter, { requestParams } from '../utils/RequestEmitter';
import { emptyResponse, successResponse } from './Interfaces/Global';
import { fetchGuildResponseSchema, guildCreateResponse, guildFetchResponse, guildMembersFetchResponse, guildUpdateParams, guildUserAddResponse } from './Interfaces/Guild';

class GuildManager extends RequestEmitter {
  constructor(params: requestParams) {
    super(params);
  }

  public async fetch(guild_id: string) {
    const request = await this.getRequest(`/guilds/${guild_id}`);
    const response = request as fetchGuildResponseSchema;
    return response;
  }

  public async edit(guild_id: string, data: guildUpdateParams) {
    const request = await this.patchRequest(`/guilds/${guild_id}`, data);
    const response = request as successResponse;
    return response;
  }

  public async create(users: Array<string>) {
    const request = await this.postRequest(`/guilds`, {
      users: users,
    });

    const response = request as guildCreateResponse;
    return response;
  }

  public async leave(guild_id: string) {
    const request = await this.deleteRequest(`/guilds/${guild_id}`);

    const response = request as emptyResponse;
    return response;
  }

  public async list() {
    const request = await this.getRequest(`/guilds`);

    const response = request as guildFetchResponse;

    return response;
  }

  public async members(guild_id: string, pagination_key?: string) {
    let _url = `/guilds/${guild_id}/members`;
    const parameters = [];

    if (pagination_key) parameters.push(`pagination_key=${pagination_key}`);
    
    if (parameters.length > 0) _url = _url.concat("?");
    const request = await this.getRequest(_url.concat(parameters.join("&")));

    const response = request as guildMembersFetchResponse;

    return response;
  }

  public async add(guild_id: string, users_id: string[]) {
    const request = await this.postRequest(`/guilds/${guild_id}/members`, {
      user_ids: users_id,
    });
    const response = request as guildUserAddResponse;
    return response;
  }

  public async kick(guild_id: string, user_id: string) {
    const request = await this.deleteRequest(`/guilds/${guild_id}/members/${user_id}`);
    const response = request as successResponse;
    return response;
  }
}

export default GuildManager;

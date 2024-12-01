import RequestEmitter, { requestParams } from '../utils/RequestEmitter';
import { successResponse } from './Interfaces/Global';
import { fetchGolfUsers } from './Interfaces/Golf';
import { fetchMultipleGolfResponse, golfInterface } from './Interfaces/Search';

class GolfLinkManager extends RequestEmitter {
  constructor(params: requestParams) {
    super(params);
  }

  public async fetch(golf_id: string) {
    const request = await this.getRequest(`/golfs/${golf_id}`);
    const response = request as golfInterface;

    return response;
  }

  public async create(golf_id: string) {
    const request = await this.postRequest(`/golfs/${golf_id}/link`);
    const response = request as successResponse;

    return response;
  }

  public async delete(golf_id: string) {
    const request = await this.deleteRequest(`/golfs/${golf_id}/link`);
    const response = request as successResponse;

    return response;
  }

  public async users(golf_id: string) {
    const request = await this.getRequest(`/golfs/${golf_id}/users`);
    const response = request as fetchGolfUsers;

    return response;
  }

  public async golfs(user_id: string) {
    const request = await this.getRequest(`/golfs/${user_id}/linked`);
    const response = request as fetchMultipleGolfResponse;

    return response;
  }
}

export default GolfLinkManager;

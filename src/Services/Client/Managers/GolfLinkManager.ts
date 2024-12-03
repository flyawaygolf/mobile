import RequestEmitter, { requestParams } from '../utils/RequestEmitter';
import { paginationParams, successResponse } from './Interfaces/Global';
import { fetchGolfUsers } from './Interfaces/Golf';
import { fetchMultipleGolfResponse } from './Interfaces/Search';

class GolfLinkManager extends RequestEmitter {
  constructor(params: requestParams) {
    super(params);
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

  public async users(golf_id: string, options?: {
    pagination?: paginationParams,
  }) {
    let _url = `/golfs/${golf_id}/users`;
    const parameters = []

    if (options?.pagination) {
      const { pagination_key, limit } = options.pagination;
      if (pagination_key) parameters.push(`pagination_key=${pagination_key}`);
      if (limit) parameters.push(`limit=${limit}`);
    }
    if (parameters.length > 0) _url = _url.concat("?");
    const request = await this.getRequest(_url.concat(parameters.join("&")));
    const response = request as fetchGolfUsers;

    return response;
  }

  public async golfs(user_id: string, options?: {
    pagination?: paginationParams,
  }) {
    let _url = `/golfs/${user_id}/linked`;
    const parameters = []

    if (options?.pagination) {
      const { pagination_key, limit } = options.pagination;
      if (pagination_key) parameters.push(`pagination_key=${pagination_key}`);
      if (limit) parameters.push(`limit=${limit}`);
    }
    if (parameters.length > 0) _url = _url.concat("?");
    const request = await this.getRequest(_url.concat(parameters.join("&")));
    const response = request as fetchMultipleGolfResponse;

    return response;
  }
}

export default GolfLinkManager;

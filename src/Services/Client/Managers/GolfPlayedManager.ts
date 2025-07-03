import RequestEmitter, { requestParams } from '../utils/RequestEmitter';
import { paginationParams, successResponse } from './Interfaces/Global';
import { fetchMultipleGolfResponse } from './Interfaces/Search';

class GolfPlayedManager extends RequestEmitter {
  constructor(params: requestParams) {
    super(params);
  }

  public async markAsPlayed(golf_id: string) {
    const request = await this.postRequest(`/golfs/${golf_id}/played`);
    const response = request as successResponse;

    return response;
  }

  public async unmarkAsPlayed(golf_id: string) {
    const request = await this.deleteRequest(`/golfs/${golf_id}/played`);
    const response = request as successResponse;

    return response;
  }

  public async playedGolfs(user_id: string, options?: {
    pagination?: paginationParams,
  }) {
    let _url = `/golfs/${user_id}/played`;
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

export default GolfPlayedManager;

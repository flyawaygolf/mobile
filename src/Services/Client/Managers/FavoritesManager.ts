import RequestEmitter, { requestParams } from '../utils/RequestEmitter';
import { favoritesResponseInterface } from './Interfaces/Favorites';
import { emptyResponse, successResponse } from './Interfaces/Global';

class FavoritesManager extends RequestEmitter {
  constructor(params: requestParams) {
    super(params);
  }

  public async create(target_id: string) {
    const request = await this.postRequest(`/favorites/${target_id}`, {});
    const response = request as successResponse;

    return response;
  }

  public async delete(target_id: string) {
    const request = await this.deleteRequest(`/favorites/${target_id}`);
    const response = request as emptyResponse;

    return response;
  }

  public async fetch() {
    const request = await this.getRequest(`/favorites`);
    const response = request as favoritesResponseInterface;

    return response;
  }
}

export default FavoritesManager;

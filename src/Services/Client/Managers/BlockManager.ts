import RequestEmitter, { requestParams } from '../utils/RequestEmitter';
import { blockUserReponse } from './Interfaces/Block';
import { emptyResponse } from './Interfaces/Global';

class BlockManager extends RequestEmitter {
  constructor(params: requestParams) {
    super(params);
  }

  public async create(target_id: string) {
    const request = await this.postRequest(`/block/users/${target_id}`, {});
    const response = request as emptyResponse;

    return response;
  }

  public async delete(target_id: string) {
    const request = await this.deleteRequest(`/block/users/${target_id}`);
    const response = request as emptyResponse;

    return response;
  }

  public async fetch() {
    const request = await this.getRequest(`/block/users`);
    const response = request as blockUserReponse;

    return response;
  }
}

export default BlockManager;

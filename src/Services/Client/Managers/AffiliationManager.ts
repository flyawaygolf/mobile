import type { AffiliationInterface } from './Interfaces';
import RequestEmitter, { requestParams } from '../utils/RequestEmitter';
import type { emptyResponse } from './Interfaces/Global';

class AffiliationManager extends RequestEmitter {
  constructor(params: requestParams) {
    super(params);
  }

  public async set(code: string) {
    const request = await this.postRequest(`/affiliations`, { code: code });
    const response = request as AffiliationInterface.affiliationCreateResponse;

    return response;
  }

  public async delete() {
    const request = await this.deleteRequest(`/affiliations`);
    const response = request as emptyResponse;

    return response;
  }

  public async fetch() {
    const request = await this.getRequest(`/affiliations`);
    const response = request as AffiliationInterface.affiliationFetchResponse;

    return response;
  }
}

export default AffiliationManager;

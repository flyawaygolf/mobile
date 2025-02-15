import RequestEmitter, { requestParams } from '../utils/RequestEmitter';
import type { SubscriptionInterface } from './Interfaces';

class SubscriptionManager extends RequestEmitter {

  constructor(params: requestParams) {
    super(params);
  }

  public async dashboard() {
    const request = await this.getRequest(`/dashboard`);

    const response = request as SubscriptionInterface.createDashboardResponse;
    return response;
  }

  public async fetch() {
    const request = await this.getRequest(`/items`);

    const response = request as SubscriptionInterface.getSubscriptionsResponse;

    return response;
  }
}

export default SubscriptionManager;

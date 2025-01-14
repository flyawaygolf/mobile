import RequestEmitter, { requestParams } from '../utils/RequestEmitter';
import type { GlobalInterface, NotificationInterface } from './Interfaces';

class NotificationManager extends RequestEmitter {
  constructor(params: requestParams) {
    super(params);
  }

  public async fetch(params?: GlobalInterface.paginationParams) {

    let _url = `/notifications`;
    const parameters = [];

    if(params?.pagination_key) parameters.push(`pagination_key=${params.pagination_key}`);
    if(parameters.length > 0) _url = _url.concat("?")

    const request = await this.getRequest(_url.concat(parameters.join("&")));

    const response = request as NotificationInterface.notificationFetchResponse;

    return response;
  }

  public async read() {
    const request = await this.postRequest(`/notifications`);
    const response = request as GlobalInterface.successResponse;

    return response;
  }

  public async readOne(notification_id: string) {
    const request = await this.postRequest(`/notifications/${notification_id}`);
    const response = request as GlobalInterface.successResponse;

    return response;
  }
}

export default NotificationManager;

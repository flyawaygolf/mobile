import RequestEmitter, { requestParams } from '../utils/RequestEmitter';
import { emptyResponse, successResponse } from './Interfaces/Global';

class PushNoficationManager extends RequestEmitter {
  constructor(params: requestParams) {
    super(params);
  }

  public async register(fcmToken: string) {
    const request = await this.postRequest(`/notifications/push`, {
      fcmToken: fcmToken
    });
    const response = request as successResponse;

    return response;
  }

  public async delete(fcmToken: string) {
    const request = await this.deleteRequest(`/notifications/push`, {
      fcmToken: fcmToken
    });
    const response = request as emptyResponse;

    return response;
  }
}

export default PushNoficationManager;

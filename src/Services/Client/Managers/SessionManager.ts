import RequestEmitter, { requestParams } from '../utils/RequestEmitter';
import { emptyResponse, successResponse } from './Interfaces/Global';
import { createSessionFetchResponse, sessionFetchResponse } from './Interfaces/Session';

class SessionManager extends RequestEmitter {
  constructor(params: requestParams) {
    super(params);
  }

  public async logout() {
    const request = await this.deleteRequest(`/sessions/logout`);

    const response = request as successResponse;
    return response;
  }

  public async deleteOne(session_id: string, params: { password: string }) {
    const request = await this.deleteRequest(`/sessions/${session_id}`, {
      password: params.password
    });

    const response = request as successResponse;
    return response;
  }

  public async deleteAll(password: string) {
    const request = await this.deleteRequest(`/sessions`, {
      password: password
    });

    const response = request as emptyResponse;
    return response;
  }

  public async fetch() {
    const request = await this.getRequest(`/sessions`);

    const response = request as sessionFetchResponse;

    return response;
  }

  public async create(options: {
    email: string;
    password: string;
    device_name: string;
    captcha_code?: string;
}) {  
    const request = await this.postRequest(`/sessions`, options);

    const response = request as createSessionFetchResponse;

    return response;
  }
}

export default SessionManager;

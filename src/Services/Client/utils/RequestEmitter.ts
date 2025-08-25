import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

import { apibaseurl, usertokenkey } from '../../constante';

export type requestParams = {
  token: string;
  websocketurl?: string;
  apiurl?: string;
  cdnurl?: string;
  autoTranslate?: boolean;
};

class RequestEmitter {
  private instance: AxiosInstance;

  constructor(params: requestParams) {
    this.instance = axios.create({
      baseURL: params?.apiurl ?? apibaseurl,
      headers: {
        [usertokenkey]: params?.token ?? '',
      },
      validateStatus: s => s < 501,
    });
  }

  protected async postRequest(url: string, data?: object) {
    const request = await this.instance({
      method: 'POST',
      url: url,
      data: data,
    });

    return request.data;
  }

  protected async uploadFiles(url: string, data: FormData) {
    const request = await this.instance({
      method: 'POST',
      headers: {
        'content-type': 'multipart/form-data',
      },
      url: url,
      data: data,
    });

    return request.data;
  }

  protected async patchRequest(url: string, data?: object, params?: AxiosRequestConfig) {
    const request = await this.instance({
      method: 'PATCH',
      url: url,
      data: data,
      params,
    });

    return request.data;
  }

  protected async putRequest(url: string, data?: object) {
    const request = await this.instance({
      method: 'PUT',
      url: url,
      data: data,
    });

    return request.data;
  }

  protected async getRequest(url: string) {
    const request = await this.instance({
      method: 'GET',
      url: url,
    });

    return request.data;
  }

  protected async deleteRequest(url: string, data?: object) {
    const request = await this.instance({
      method: 'DELETE',
      url: url,
      data: data,
    });

    return request.data;
  }
}

export default RequestEmitter;

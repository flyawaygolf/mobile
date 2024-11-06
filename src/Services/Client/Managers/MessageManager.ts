import RequestEmitter, { requestParams } from '../utils/RequestEmitter';
import { paginationParams, successResponse } from './Interfaces/Global';
import { createParams, messageCreateResponse, messageFetchResponse, unreadFetchResponse } from './Interfaces/Message';

class MessageManager extends RequestEmitter {
  constructor(params: requestParams) {
    super(params);
  }

  public async create(channel_id: string, params: createParams) {
    const request = await this.postRequest(`/messages/${channel_id}`, {
      attachments: params?.attachments,
      content: params.content,
    });

    const response = request as messageCreateResponse;
    return response;
  }

  public async fetch(channel_id: string, params?: paginationParams) {

    let _url = `/messages/${channel_id}`;
    const parameters = [];

    if(params?.skip) parameters.push(`skip=${params.skip.toString()}`);
    if(params?.limit) parameters.push(`limit=${params.limit.toString()}`);
    if(params?.pagination_key) parameters.push(`pagination_key=${params.pagination_key}`);
    if(parameters.length > 0) _url = _url.concat("?")

    const request = await this.getRequest(_url.concat(parameters.join("&")));
    const response = request as messageFetchResponse;

    return response;
  }

  public async unreads() {
    const request = await this.getRequest(`/messages/unreads`);

    const response = request as unreadFetchResponse;

    return response;
  }

  public async read(channel_id: string, message_id: string) {
    const request = await this.postRequest(`/messages/${channel_id}/${message_id}`);

    const response = request as successResponse;

    return response;
  }

  public async delete(channel_id: string, message_id: string) {
    const request = await this.deleteRequest(`/messages/${channel_id}/${message_id}`);

    const response = request as successResponse;
    return response;
  }

  public async report(target_id: string, reason: number, description?: string) {
    const request = await this.postRequest(`/messages/${target_id}/reports`, {
      reason: reason,
      description: description,
    });
    const response = request as successResponse;

    return response;
  }
}

export default MessageManager;

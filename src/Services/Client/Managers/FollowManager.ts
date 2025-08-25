import { FollowInterface } from './Interfaces';
import RequestEmitter, { requestParams } from '../utils/RequestEmitter';
import { paginationParams } from './Interfaces/Global';

class FollowManager extends RequestEmitter {
  constructor(params: requestParams) {
    super(params);
  }

  public async delete(target_id: string) {
    const request = await this.deleteRequest(`/follows/${target_id}`);
    const response = request as FollowInterface.followInformations;

    return response;
  }

  public async create(target_id: string) {
    const request = await this.postRequest(`/follows/${target_id}`, {});
    const response = request as FollowInterface.followInformations;

    return response;
  }

  public async accept(follow_id: string) {
    const request = await this.putRequest(`/follows/accept`, {
      follow_id: follow_id
    });

    const response = request as FollowInterface.followInformations;

    return response;
  }

  public async unacceptedList() {
    const request = await this.getRequest('/follows');

    const response = request as FollowInterface.notificationFollowResponse;

    return response;
  }

  public async follows(nickname: string, params?: paginationParams) {

    let _url = `/users/${nickname}/follows`;
    const parameters = [];

    if(params?.pagination_key) parameters.push(`pagination_key=${params.pagination_key}`);
    if(parameters.length > 0) _url = _url.concat("?")

    const request = await this.getRequest(_url.concat(parameters.join("&")));

    const response = request as FollowInterface.profileFollowResponse;

    return response;
  }

  public async followers(nickname: string, params?: paginationParams) {

    let _url = `/users/${nickname}/followers`;
    const parameters = [];

    if(params?.pagination_key) parameters.push(`pagination_key=${params.pagination_key}`);
    if(parameters.length > 0) _url = _url.concat("?")

    const request = await this.getRequest(_url.concat(parameters.join("&")));

    const response = request as FollowInterface.profileFollowResponse;

    return response;
  }
}

export default FollowManager;

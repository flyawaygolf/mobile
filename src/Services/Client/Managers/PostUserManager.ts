import RequestEmitter, { requestParams } from '../utils/RequestEmitter';
import type { GlobalInterface, PostInterface } from './Interfaces';

class PostUserManager extends RequestEmitter {
  constructor(params: requestParams) {
    super(params);
  }

  public async fetch(nickname: string, params?: GlobalInterface.paginationParams) {

    let _url = `/users/${nickname}/posts`;
    const parameters = [];

    if(params?.pagination_key) parameters.push(`pagination_key=${params.pagination_key}`);
    if(parameters.length > 0) _url = _url.concat("?")

    const request = await this.getRequest(_url.concat(parameters.join("&")));
    const response = request as PostInterface.postResponse;

    return response;
  }
}

export default PostUserManager;

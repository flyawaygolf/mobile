import RequestEmitter, { requestParams } from '../utils/RequestEmitter';
import type { GlobalInterface, PostInterface } from './Interfaces';

class PostUserManager extends RequestEmitter {
  private translate: boolean;

  constructor(params: requestParams) {
    super(params);

    this.translate = params?.autoTranslate ?? false;
  }

  public async fetch(nickname: string, translateTo: string, params?: GlobalInterface.paginationParams) {

    let _url = `/users/${nickname}/posts`;
    const parameters = [];

    if(this.translate) parameters.push(`translateTo=${translateTo}`);
    if(params?.pagination_key) parameters.push(`pagination_key=${params.pagination_key}`);
    if(parameters.length > 0) _url = _url.concat("?")

    const request = await this.getRequest(_url.concat(parameters.join("&")));
    const response = request as PostInterface.postResponse;

    return response;
  }

  public async fetchSocialLinks(nickname: string, translateTo: string, params?: GlobalInterface.paginationParams) {

    let _url = `/users/${nickname}/posts/socials`;
    const parameters = [];

    if(this.translate) parameters.push(`translateTo=${translateTo}`);
    if(params?.pagination_key) parameters.push(`pagination_key=${params.pagination_key}`);
    if(parameters.length > 0) _url = _url.concat("?")

    const request = await this.getRequest(_url.concat(parameters.join("&")));
    const response = request as PostInterface.postResponse;

    return response;
  }
}

export default PostUserManager;

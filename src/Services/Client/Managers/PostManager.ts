import { cdnbaseurl } from '../../constante';
import RequestEmitter, { requestParams } from '../utils/RequestEmitter';
import type { GlobalInterface, PostInterface, SearchInterface } from './Interfaces';
import PostUserManager from './PostUserManager';

class PostManager extends RequestEmitter {
  public user: PostUserManager;
  private cdnurl: string;
  private translate: boolean;

  constructor(params: requestParams) {
    super(params);

    this.user = new PostUserManager(params);
    this.cdnurl = params?.cdnurl ?? cdnbaseurl;
    this.translate = params?.autoTranslate ?? false;
  }

  public file(user_id: string, post_id: string, file_name: string) {
    return `${this.cdnurl}/posts/${user_id}/${post_id}/${file_name}`;
  }

  public async uploadFile(files: Blob) {
    const formdata = new FormData();

    formdata.append('posts', files);

    const request = await this.uploadFiles(`/files/upload?type=posts`, formdata);
    const response = request as GlobalInterface.uploadFiles;

    return response;
  }

  public async create(options: PostInterface.createPostParameters) {
    
    const request = await this.postRequest(`/posts`, options);
    const response = request as PostInterface.createPostReponse;

    return response;
  }

  public async delete(target_id: string) {
    const request = await this.deleteRequest(`/posts/${target_id}`);
    const response = request as GlobalInterface.emptyResponse;

    return response;
  }

  public async unPin(target_id: string) {
    const request = await this.deleteRequest(`/posts/${target_id}/pin`);
    const response = request as GlobalInterface.emptyResponse;

    return response;
  }

  public async pin(target_id: string) {
    const request = await this.postRequest(`/posts/${target_id}/pin`, {});
    const response = request as GlobalInterface.successResponse;

    return response;
  }

  public async getPinPost(target_id: string, translateTo: string) {
    let _url = `/posts/${target_id}/pin`;
    const parameters = [];

    if(this.translate) parameters.push(`translateTo=${translateTo}`);
    if(parameters.length > 0) _url = _url.concat("?")

    const request = await this.getRequest(_url.concat(parameters.join("&")));
    const response = request as PostInterface.pinedPostResponse;

    return response;
  }

  public async like(target_id: string) {
    const request = await this.postRequest(`/posts/${target_id}/likes`, {});
    const response = request as GlobalInterface.successResponse;

    return response;
  }

  public async unlike(target_id: string) {
    const request = await this.deleteRequest(`/posts/${target_id}/likes`);
    const response = request as GlobalInterface.emptyResponse;

    return response;
  }

  public async getLikesPost(target_id: string) {
    const request = await this.getRequest(`/posts/${target_id}/likes`);
    const response = request as SearchInterface.searchUsers;

    return response;
  }

  public async save(target_id: string) {
    const request = await this.postRequest(`/posts/${target_id}/saves`);
    const response = request as GlobalInterface.successResponse;

    return response;
  }

  public async unSave(target_id: string) {
    const request = await this.deleteRequest(`/posts/${target_id}/saves`);
    const response = request as GlobalInterface.emptyResponse;

    return response;
  }

  public async getSavedPost(target_id: string, translateTo: string, params?: GlobalInterface.paginationParams) {
    let _url = `/posts/${target_id}/saves`;
    const parameters = [];

    if(this.translate) parameters.push(`translateTo=${translateTo}`);
    if(params?.pagination_key) parameters.push(`pagination_key=${params.pagination_key}`);
    if(parameters.length > 0) _url = _url.concat("?")

    const request = await this.getRequest(_url.concat(parameters.join("&")));
    const response = request as PostInterface.postResponse;
    return response;
  }

  public async report(target_id: string, reason: number, description?: string) {
    const request = await this.postRequest(`/reports/posts`, {
      target_id: target_id,
      reason: reason,
      description: description
    });
    const response = request as GlobalInterface.successResponse;

    return response;
  }

  public async fetchOne(post_id: string, translateTo: string) {
    let _url = `/posts/${post_id}?`;
    const parameters = [];

    if(this.translate) parameters.push(`translateTo=${translateTo}`);
    if(parameters.length > 0) _url = _url.concat("?")

    const request = await this.getRequest(_url.concat(parameters.join("&")));
    const response = request as PostInterface.fetchOnePost;

    return response;
  }

  public async comments(post_id: string, translateTo: string, params?: GlobalInterface.paginationParams) {

    let _url = `/posts/${post_id}/comments`;
    const parameters = [];

    if(this.translate) parameters.push(`translateTo=${translateTo}`);
    if(params?.pagination_key) parameters.push(`pagination_key=${params.pagination_key}`);
    if(parameters.length > 0) _url = _url.concat("?")

    const request = await this.getRequest(_url.concat(parameters.join("&")));

    const response = request as PostInterface.postResponse;

    return response;
  }

  public async shares(post_id: string, translateTo: string, params?: GlobalInterface.paginationParams) {

    let _url = `/posts/${post_id}/shares`;
    const parameters = [];

    if(this.translate) parameters.push(`translateTo=${translateTo}`);
    if(params?.pagination_key) parameters.push(`pagination_key=${params.pagination_key}`);
    if(parameters.length > 0) _url = _url.concat("?")

    const request = await this.getRequest(_url.concat(parameters.join("&")));

    const response = request as PostInterface.postResponse;

    return response;
  }

  public async fetch(translateTo: string, params?: GlobalInterface.paginationParams) {

    let _url = `/posts`;
    const parameters = []

    if(this.translate) parameters.push(`translateTo=${translateTo}`);
    if(params?.pagination_key) parameters.push(`pagination_key=${params.pagination_key}`);
    if(parameters.length > 0) _url = _url.concat("?")

    const request = await this.getRequest(_url.concat(parameters.join("&")));
    const response = request as PostInterface.postResponse;

    return response;
  }

  public async search(translateTo: string, params?: PostInterface.searchParams) {
    let _url = `/posts/search`;

    const parameters = []

    if(this.translate) parameters.push(`translateTo=${translateTo}`);
    if(params?.after) parameters.push(`after=${params.after.toString()}`);
    if(params?.before) parameters.push(`before=${params.before.toString()}`);
    if(params?.query) parameters.push(`query=${encodeURIComponent(params.query.toString())}`);
    if(params?.pagination_key) parameters.push(`pagination_key=${params.pagination_key.toString()}`);
    if(params?.from) parameters.push(`from=${params.from.toString()}`);
    if(params?.locale) parameters.push(`locale=${params.locale.toString()}`);
    if(params?.type) parameters.push(`type=${params.type.toString()}`);
    if(parameters.length > 0) _url = _url.concat("?")

    
    const request = await this.getRequest(_url.concat(parameters.join("&")));
    const response = request as PostInterface.postResponse;

    return response;
  }

  public async getOriginalText(post_id: string) {
    const request = await this.getRequest(`/posts/${post_id}/text`);
    const response = request as PostInterface.originalTextResponse;

    return response;
  }
}

export default PostManager;

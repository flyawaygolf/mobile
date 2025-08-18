import { cdnbaseurl } from '../../constante';
import RequestEmitter, { requestParams } from '../utils/RequestEmitter';
import GolfLinkManager from './GolfLinkManager';
import GolfPlayedManager from './GolfPlayedManager';
import { EventInterface, PostInterface } from './Interfaces';
import { paginationParams } from './Interfaces/Global';
import { fetchGolfResponse } from './Interfaces/Search';
import { LocationQuery } from './SearchMapManager';

class GolfManager extends RequestEmitter {
  private cdnurl: string;
  public link: GolfLinkManager;
  public played: GolfPlayedManager;

  constructor(params: requestParams) {
    super(params);
    this.cdnurl = params?.cdnurl ?? cdnbaseurl;
    this.link = new GolfLinkManager(params);
    this.played = new GolfPlayedManager(params);
  }

  public avatar(golf_id: string) {
    return `${this.cdnurl}/golfs/avatars/${golf_id}/default.jpg`;
  }

  public cover(golf_id: string) {
    return `${this.cdnurl}/golfs/covers/${golf_id}/default.jpg`;
  }

  public async fetch(golf_id: string, options?: {
    location?: LocationQuery
  }) {
    let _url = `/golfs/${golf_id}`;
    const parameters = []

    if (options?.location) {
      const location = options.location;
      if (location?.max_distance) parameters.push(`max_distance=${location.max_distance}`);
      if (location?.long) parameters.push(`long=${location.long}`);
      if (location?.lat) parameters.push(`lat=${location.lat}`);
    }

    if (parameters.length > 0) _url = _url.concat("?");
    const request = await this.getRequest(_url.concat(parameters.join("&")));
    const response = request as fetchGolfResponse;

    return response;
  }

  public async communityPosts(golf_id: string, options?: {
    pagination?: paginationParams,
    limit?: number;
  }) {
    let _url = `/golfs/${golf_id}/posts/community`;
    const parameters = []

    if (options?.pagination) {
      const { pagination_key, limit } = options.pagination;
      if (pagination_key) parameters.push(`pagination_key=${pagination_key}`);
      if (limit) parameters.push(`limit=${limit}`);
    }
    if (parameters.length > 0) _url = _url.concat("?");
    const request = await this.getRequest(_url.concat(parameters.join("&")));
    const response = request as PostInterface.postResponse;

    return response;
  }

  public async communitySocialLinksPosts(golf_id: string, options?: {
    pagination?: paginationParams,
    limit?: number;
  }) {
    let _url = `/golfs/${golf_id}/posts/social`;
    const parameters = []

    if (options?.pagination) {
      const { pagination_key, limit } = options.pagination;
      if (pagination_key) parameters.push(`pagination_key=${pagination_key}`);
      if (limit) parameters.push(`limit=${limit}`);
    }
    if (parameters.length > 0) _url = _url.concat("?");
    const request = await this.getRequest(_url.concat(parameters.join("&")));
    const response = request as PostInterface.postResponse;

    return response;
  }

  public async officialPosts(golf_id: string, options?: {
    pagination?: paginationParams;
    limit?: number;
  }) {
    let _url = `/golfs/${golf_id}/posts/official`;
    const parameters = []

    if (options?.pagination) {
      const { pagination_key, limit } = options.pagination;
      if (pagination_key) parameters.push(`pagination_key=${pagination_key}`);
      if (limit) parameters.push(`limit=${limit}`);
    }
    if (parameters.length > 0) _url = _url.concat("?");
    const request = await this.getRequest(_url.concat(parameters.join("&")));
    const response = request as PostInterface.postResponse;

    return response;
  }

  public async events(golf_id: string, options?: {
    pagination?: paginationParams;
    limit?: number;
  }) {
    let _url = `/golfs/${golf_id}/events`;
    const parameters = []

    if (options?.pagination) {
      const { pagination_key, limit } = options.pagination;
      if (pagination_key) parameters.push(`pagination_key=${pagination_key}`);
      if (limit) parameters.push(`limit=${limit}`);
    }
    if (parameters.length > 0) _url = _url.concat("?");
    const request = await this.getRequest(_url.concat(parameters.join("&")));
    const response = request as EventInterface.multipleEventsResponse;

    return response;
  }
}

export default GolfManager;

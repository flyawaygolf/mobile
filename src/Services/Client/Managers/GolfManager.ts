import RequestEmitter, { requestParams } from '../utils/RequestEmitter';
import GolfLinkManager from './GolfLinkManager';
import { EventInterface, PostInterface } from './Interfaces';
import { paginationParams } from './Interfaces/Global';
import { fetchGolfResponse } from './Interfaces/Search';
import { LocationQuery } from './SearchMapManager';

class GolfManager extends RequestEmitter {
  public link: GolfLinkManager;

  constructor(params: requestParams) {
    super(params);
    this.link = new GolfLinkManager(params);
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

  public async events(golf_id: string) {
    const request = await this.getRequest(`/golfs/${golf_id}/events`);
    const response = request as EventInterface.golfEventsResponse;

    return response;
  }
}

export default GolfManager;

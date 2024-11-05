import RequestEmitter, { requestParams } from '../utils/RequestEmitter';
import { searchAll, searchUsers, searchGolfs } from './Interfaces/Search';
import SearchMapManager, { LocationQuery } from './SearchMapManager';

class SearchManager extends RequestEmitter {
  
  public map: SearchMapManager;
  constructor(params: requestParams) {
    super(params);
    this.map = new SearchMapManager(params);
  }

  public async all(query: string, options?: {
    location?: LocationQuery
  }) {
    let _url = `/search`;
    const parameters = []

    parameters.push(`query=${encodeURIComponent(query)}`);
    if(options?.location) {
      const location = options.location;
      if (location?.max_distance) parameters.push(`max_distance=${location.max_distance}`);
      if (location?.long) parameters.push(`long=${location.long}`);
      if (location?.lat) parameters.push(`lat=${location.lat}`);
    }
    if (parameters.length > 0) _url = _url.concat("?");

    const request = await this.getRequest(_url.concat(parameters.join("&")));
    const response = request as searchAll;

    return response;
  }

  public async users(query: string, options?: {
    location?: LocationQuery
  }) {
    let _url = `/search/users`;
    const parameters = []

    parameters.push(`query=${encodeURIComponent(query)}`);
    if(options?.location) {
      const location = options.location;
      if (location?.max_distance) parameters.push(`max_distance=${location.max_distance}`);
      if (location?.long) parameters.push(`long=${location.long}`);
      if (location?.lat) parameters.push(`lat=${location.lat}`);
    }
    if (parameters.length > 0) _url = _url.concat("?");
    if (parameters.length > 0) _url = _url.concat("?");

    const request = await this.getRequest(_url.concat(parameters.join("&")));
    const response = request as searchUsers;

    return response;
  }

  public async golfs(query: string, options?: {
    location?: LocationQuery
  }) {
    let _url = `/search/golfs`;
    const parameters = []

    parameters.push(`query=${encodeURIComponent(query)}`);
    if(options?.location) {
      const location = options.location;
      if (location?.max_distance) parameters.push(`max_distance=${location.max_distance}`);
      if (location?.long) parameters.push(`long=${location.long}`);
      if (location?.lat) parameters.push(`lat=${location.lat}`);
    }
    if (parameters.length > 0) _url = _url.concat("?");
    if (parameters.length > 0) _url = _url.concat("?");

    const request = await this.getRequest(_url.concat(parameters.join("&")));
    const response = request as searchGolfs;

    return response;
  }
}

export default SearchManager;

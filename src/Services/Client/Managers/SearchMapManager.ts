import RequestEmitter, { requestParams } from '../utils/RequestEmitter';
import { searchAllMap, searchEventsMap, searchGolfsMap, searchUsersMap } from './Interfaces/Search';

export interface LocationQuery {
  long: number,
  lat: number
  max_distance?: number
}

class SearchMapManager extends RequestEmitter {
  constructor(params: requestParams) {
    super(params);
  }

  public async all(location: LocationQuery) {
    let _url = `/search/map`;
    const parameters = []

    if (location?.max_distance) parameters.push(`max_distance=${location.max_distance}`);
    if (location?.long) parameters.push(`long=${location.long}`);
    if (location?.lat) parameters.push(`lat=${location.lat}`);
    if (parameters.length > 0) _url = _url.concat("?");

    const request = await this.getRequest(_url.concat(parameters.join("&")));
    const response = request as searchAllMap;

    return response;
  }

  public async golfs(location: LocationQuery) {
    let _url = `/search/map/golfs`;
    const parameters = []

    if (location?.max_distance) parameters.push(`max_distance=${location.max_distance}`);
    if (location?.long) parameters.push(`long=${location.long}`);
    if (location?.lat) parameters.push(`lat=${location.lat}`);
    if (parameters.length > 0) _url = _url.concat("?");

    const request = await this.getRequest(_url.concat(parameters.join("&")));
    const response = request as searchGolfsMap;

    return response;
  }

  public async users(location: LocationQuery) {
    let _url = `/search/map/users`;
    const parameters = []

    if (location?.max_distance) parameters.push(`max_distance=${location.max_distance}`);
    if (location?.long) parameters.push(`long=${location.long}`);
    if (location?.lat) parameters.push(`lat=${location.lat}`);
    if (parameters.length > 0) _url = _url.concat("?");

    const request = await this.getRequest(_url.concat(parameters.join("&")));
    const response = request as searchUsersMap;

    return response;
  }

  public async events(location: LocationQuery) {
    let _url = `/search/map/events`;
    const parameters = []

    if (location?.max_distance) parameters.push(`max_distance=${location.max_distance}`);
    if (location?.long) parameters.push(`long=${location.long}`);
    if (location?.lat) parameters.push(`lat=${location.lat}`);
    if (parameters.length > 0) _url = _url.concat("?");

    const request = await this.getRequest(_url.concat(parameters.join("&")));
    const response = request as searchEventsMap;

    return response;
  }
}

export default SearchMapManager;

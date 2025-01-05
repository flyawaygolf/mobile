import RequestEmitter, { requestParams } from '../utils/RequestEmitter';
import type { ExploreInterface, PostInterface } from './Interfaces';
import type { exploreBestUserResponse, exploreRandomUserResponse } from './Interfaces/Explore';

class ExploreManager extends RequestEmitter {
  constructor(params: requestParams) {
    super(params);
  }

  public async recentTrends(params?: ExploreInterface.exploreRecentTrendsParams) {
    let _url = `/explore/trends`;
    const parameters = [];

    if(params?.locale) parameters.push(`locale=${params.locale}`);
    if(params?.limit) parameters.push(`limit=${params.limit.toString()}`);
    if(params?.pagination_key) parameters.push(`pagination_key=${params.pagination_key}`);
    if(params?.type) parameters.push(`type=${params.type.toString()}`);
    if(params?.query) parameters.push(`query=${params.query}`);
    if(parameters.length > 0) _url = _url.concat("?")

    const request = await this.getRequest(_url.concat(parameters.join("&")));
    const response = request as PostInterface.postResponse;
    
    return response;
  }

  public async recentBestTrends(params?: ExploreInterface.exploreRecentTrendsParams) {
    let _url = `/explore/trends/top`;
    const parameters = [];

    if(params?.locale) parameters.push(`locale=${params.locale}`);
    if(params?.limit) parameters.push(`limit=${params.limit.toString()}`);
    if(params?.pagination_key) parameters.push(`pagination_key=${params.pagination_key}`);
    if(params?.type) parameters.push(`type=${params.type.toString()}`);
    if(params?.query) parameters.push(`query=${params.query}`);
    if(parameters.length > 0) _url = _url.concat("?")

    const request = await this.getRequest(_url.concat(parameters.join("&")));

    const response = request as PostInterface.postResponse;
    return response;
  }

  public async bestUsers(params?: ExploreInterface.exploreUsersParams) {
    let _url = `/explore/users/top`;
    const parameters = [];

    if(params?.locale) parameters.push(`locale=${params.locale}`);
    if(params?.limit) parameters.push(`limit=${params.limit.toString()}`);
    if(params?.pagination_key) parameters.push(`pagination_key=${params.pagination_key}`);
    if(parameters.length > 0) _url = _url.concat("?");

    const request = await this.getRequest(_url.concat(parameters.join("&")));

    const response = request as exploreBestUserResponse;
    return response;
  }
  
  public async randomUsers(params?: ExploreInterface.exploreUsersParams) {
    let _url = `/explore/users/random`;
    const parameters = [];

    if(params?.locale) parameters.push(`locale=${params.locale}`);
    if(parameters.length > 0) _url = _url.concat("?");

    const request = await this.getRequest(_url.concat(parameters.join("&")));

    const response = request as exploreRandomUserResponse;
    return response;
  }
}

export default ExploreManager;

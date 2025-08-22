import RequestEmitter, { requestParams } from '../utils/RequestEmitter';
import { ScorecardInterface, GlobalInterface } from './Interfaces';

class UserScoreCardManager extends RequestEmitter {
  constructor(params: requestParams) {
    super(params);
  }

  public async create(params: ScorecardInterface.scorecardCreatorParams) {
    const request = await this.postRequest(`/scorecards`, params);
    const response = request as ScorecardInterface.scorecardCreatorResponse;

    return response;
  }

  public async delete(user_scorecard_id: string) {
    const request = await this.deleteRequest(`/scorecards/${user_scorecard_id}`);
    const response = request as GlobalInterface.successResponse;

    return response;
  }

  public async update(user_scorecard_id: string, params: ScorecardInterface.scorecardUpdateParams) {
    const request = await this.patchRequest(`/scorecards/${user_scorecard_id}`, params);
    const response = request as GlobalInterface.successResponse;

    return response;
  }

  public async fetch(options?: {
    pagination?: GlobalInterface.paginationParams;
    limit?: number;
  }) {
    let _url = `/scorecards`;
    const parameters = []

    if (options?.pagination) {
      const { pagination_key, limit } = options.pagination;
      if (pagination_key) parameters.push(`pagination_key=${pagination_key}`);
      if (limit) parameters.push(`limit=${limit}`);
    }
    if (parameters.length > 0) _url = _url.concat("?");
    const request = await this.getRequest(_url.concat(parameters.join("&")));
    const response = request as ScorecardInterface.multipleUserScoreCardsResponse;

    return response;
  }

  public async fetchOne(user_scorecard_id: string) {
    const request = await this.getRequest(`/scorecards/${user_scorecard_id}`);
    const response = request as ScorecardInterface.userScoreCardResponse;

    return response;
  }
}

export default UserScoreCardManager;

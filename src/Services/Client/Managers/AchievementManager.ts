import RequestEmitter, { requestParams } from '../utils/RequestEmitter';
import { AchievementInterface } from './Interfaces';

class AchievmentManager extends RequestEmitter {
  constructor(params: requestParams) {
    super(params);
  }

  public async fetch(user_id: string) {
    const request = await this.getRequest(`/achievements/${user_id}`);
    const response = request as AchievementInterface.AchievementFetchResponse;

    return response;
  }
}

export default AchievmentManager;

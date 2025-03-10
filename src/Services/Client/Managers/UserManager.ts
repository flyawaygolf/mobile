import dayjs from 'dayjs';
import { cdnbaseurl } from '../../constante';
import RequestEmitter, { requestParams } from '../utils/RequestEmitter';
import { successResponse } from './Interfaces/Global';
import { myInformations } from './Interfaces/Me';
import { modifI } from '../../../Screens/Profile/ProfileEditScreen';
import { fetchUserResponse, profileInformations } from './Interfaces/User';
import { LocationQuery } from './SearchMapManager';
import UserPermissions from '../Permissions/UserPermissions';

class UserManager extends RequestEmitter {
  private cdnurl: string;

  constructor(params: requestParams) {
    super(params);
    this.cdnurl = params?.cdnurl ?? cdnbaseurl;
  }

  public flags(bits?: string) {
    return new UserPermissions(bits);
  }

  public async register(options: {
    email: string;
    username: string;
    password: string;
    birthday: Date;
    affiliation_code?: string;
  }) {
    const request = await this.postRequest(`/users/register`, {
      email: options.email.trim(),
      username: options.username,
      password: options.password,
      birthday: dayjs(options.birthday).format(),
      affiliation_code: options.affiliation_code,
    });

    const response = request as successResponse;
    return response;
  }

  public async verifyEmail(email: string) {
    const request = await this.postRequest(`/users/register/email`, {
      email: email,
    });

    const response = request as successResponse;
    return response;
  }

  public avatar(user_id: string, avatar: string) {
    if (avatar === 'base_1.png' || avatar === 'base_2.png') return `${this.cdnurl}/profile_avatars/${avatar}`;
    return `${this.cdnurl}/profile_avatars/${user_id}/${avatar}`;
  }

  public banner(user_id: string, banner: string) {
    return `${this.cdnurl}/profile_banners/${user_id}/${banner}`;
  }

  public async myinformations() {
    const request = await this.getRequest("/users/me");
    const response = request as myInformations;
    return response;
  }

  public async edit(options: modifI) {
    const request = await this.patchRequest("/users/me", options);
    const response = request as myInformations;
    return response;
  }

  /**
   *
   * @param location [long, lat]
   * @returns
   */
  public async editLocation(location: [number, number]) {
    const request = await this.patchRequest("/users/me", {
      "golf_info": {
        "location": location,
      },
    });

    const response = request as myInformations;

    return response;
  }

  public async report(target_id: string, reason: number, description?: string) {
    const request = await this.postRequest(`/reports/users/${target_id}`, {
      reason: reason,
      description: description,
    });

    const response = request as successResponse;
    return response;
  }

  public async delete(password: string) {
    const request = await this.deleteRequest(`/users/me`, {
      "password": password,
    });

    const response = request as successResponse;
    return response;
  }

  public async fetch(user_id: string, options?: {
    location?: LocationQuery
  }) {
    let _url = `/users/${user_id}`;
    const parameters = []

    if(options?.location) {
      const location = options.location;
      if (location?.max_distance) parameters.push(`max_distance=${location.max_distance}`);
      if (location?.long) parameters.push(`long=${location.long}`);
      if (location?.lat) parameters.push(`lat=${location.lat}`);
    }
    if (parameters.length > 0) _url = _url.concat("?");

    const request = await this.getRequest(_url.concat(parameters.join("&")));
    const response = request as fetchUserResponse;
    return response;
  }

  public async profile(nickname: string) {
    const request = await this.getRequest(`/users/${nickname}/profile`);
    const response = request as profileInformations;
    return response;
  }

}

export default UserManager;

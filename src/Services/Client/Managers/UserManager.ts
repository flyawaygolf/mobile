import dayjs from 'dayjs';
import { cdnbaseurl } from '../../constante';
import RequestEmitter, { requestParams } from '../utils/RequestEmitter';
import { successResponse } from './Interfaces/Global';
import { myInformations } from './Interfaces/Me';
import { searchUsers } from './Interfaces/Search';
import { modifI } from '../../../Screens/ProfileEditScreen';

class UserManager extends RequestEmitter {
  private cdnurl: string;

  constructor(params: requestParams) {
    super(params);
    this.cdnurl = params?.cdnurl ?? cdnbaseurl;
  }

  public async register(options: {
    email: string;
    username: string;
    password: string;
    birthday: Date;
    captcha_code?: string;
  }) {
    const request = await this.postRequest(`/users/register`, {
      email: options.email.trim(),
      username: options.username,
      password: options.password,
      birthday: dayjs(options.birthday).format(),
      captcha_code: options?.captcha_code ?? ""
    });

    const response = request as successResponse;
    return response;
  }

  public async verifyEmail(email: string) {
    const request = await this.postRequest(`/users/register/email`, {
      email: email
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
        "location": location
      }
    });

    const response = request as myInformations;

    return response;
  }

  public async search(query: string, options?: {
    pagination_key?: string,
    long?: number,
    lat?: number
  }) {
    let _url = `/users`;
    const parameters = []

    parameters.push(`query=${encodeURIComponent(query)}`);
    if (options?.pagination_key) parameters.push(`pagination_key=${options.pagination_key}`);
    if (options?.long) parameters.push(`long=${options.long}`);
    if (options?.lat) parameters.push(`lat=${options.lat}`);
    if (parameters.length > 0) _url = _url.concat("?");

    const request = await this.getRequest(_url.concat(parameters.join("&")));
    const response = request as searchUsers;

    return response;
  }

  public async displayUsersMap(long: number, lat: number, options?: {
    max_distance?: number,
    width_m?: number,
    height_m?: number
  }) {
    let _url = `/map/users`;
    const parameters = []

    parameters.push(`long=${encodeURIComponent(long)}`);
    parameters.push(`lat=${encodeURIComponent(lat)}`);
    if (options?.max_distance) parameters.push(`max_distance=${encodeURIComponent(options.max_distance)}`);
    if (options?.width_m) parameters.push(`width_m=${encodeURIComponent(options.width_m)}`);
    if (options?.height_m) parameters.push(`height_m=${encodeURIComponent(options.height_m)}`);
    if (parameters.length > 0) _url = _url.concat("?");

    const request = await this.getRequest(_url.concat(parameters.join("&")));
    const response = request as searchUsers;

    return response;
  }

  public async report(target_id: string, reason: number, description?: string) {
    const request = await this.postRequest(`/reports/users/${target_id}`, {
      reason: reason,
      description: description
    });

    const response = request as successResponse;
    return response;
  }

  public async delete(password: string) {
    const request = await this.deleteRequest(`/users/me`, {
      "password": password
    });

    const response = request as successResponse;
    return response;
  }

}

export default UserManager;

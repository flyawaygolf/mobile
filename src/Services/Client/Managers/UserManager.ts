import dayjs from 'dayjs';
import { cdnbaseurl } from '../../constante';
import RequestEmitter, { requestParams } from '../utils/RequestEmitter';
import { successResponse } from './Interfaces/Global';
import { myInformations } from './Interfaces/Me';
import { modifI } from '../../../Screens/Profile/ProfileEditScreen';

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
      captcha_code: options?.captcha_code ?? "",
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

}

export default UserManager;

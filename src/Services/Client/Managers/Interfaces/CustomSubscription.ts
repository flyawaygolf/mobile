import type { error, userInfo } from "./Global"
import type { currencyType } from "./Subscription";

export interface getUserSubscriptionResponseInterface {
  user_id: string;
  active: boolean;
  currency: currencyType;
  price: number;
  subscription_id: string;
  user_price: number;
}

export interface getUserSubscriptionsResponse {
  error?: error;
  data?: getUserSubscriptionResponseInterface
}

export interface createCustomerSubscriptionParamsInterface {
  price: number;
  currency: currencyType;
  active: boolean;
}

export interface getUserActiveSubscriptionInterface {
  active: boolean;
  last_renew: string;
  next_renew: string;
  user_subscription_id: string;
  canceled: boolean;
  subscription_info: getUserSubscriptionResponseInterface;
  from: userInfo;
}

export interface getUserActiveSubscriptionInterfaceResponse {
  error?: error;
  data?: Array<getUserActiveSubscriptionInterface>
}

export interface getUserActiveCustomSubscriptionInterfaceResponse {
  error?: error;
  data?: {
    active: boolean;
  }
}

export interface getUserConnectDashboarLinkResponse {
  error?: error;
  data?: {
    url: string;
  }
}

export interface getUserConnectRegisterLinkResponse {
  error?: error;
  data?: {
    url: string;
  }
}

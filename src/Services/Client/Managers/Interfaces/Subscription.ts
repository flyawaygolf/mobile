import type { error, premium_type } from "./Global"

export type currencyType = "usd" | "eur";
export type intervalType = "month" | "year";

export interface createDashboardResponseInterface {
  url: string;
}

export interface createDashboardResponse {
  error?: error;
  data?: createDashboardResponseInterface
}

export interface getSubscriptionsResponseInterface {
  currency: currencyType,
  price: number,
  premium_type: premium_type,
  interval: intervalType,
  active: boolean,
  subscription_id: string
}

export interface getSubscriptionsResponse {
  error?: error;
  data?: Array<getSubscriptionsResponseInterface>
}
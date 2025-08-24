import Config from "react-native-config";

export const ON_END_REACHED_THRESHOLD_POSTS = 2;

export const POSTS_LIST_PAGE_SIZE = 15;

export const environment = Config?.ENV ?? 'production';

export const usertokenkey = "flyawaytoken";

export const apibaseurl = Config?.API_BASE_URL ?? "https://api.flyawaygolf.com/v2";
export const websocketurl = Config?.WEBSOCKET_URL ?? 'wss://api.flyawaygolf.com/v2';
export const cdnbaseurl = 'https://cdn.flyawaygolf.com';
export const websiteurl = Config?.WEBSITE_BASE_URL ?? 'https://flyawaygolf.com';
export const posturl = `${websiteurl}/posts`;
export const golfurl = `${websiteurl}/golfs`;
export const eventurl = `${websiteurl}/events`;
export const profileurl = `${websiteurl}/users`;
export const scorecardurl = `${websiteurl}/scorecards`;
export const messageurl = `${websiteurl}/messages`;

export const captchasiteKey = Config?.CAPTCHA_SITE_KEY ?? 'd53ab178-9eea-40c8-b02a-329a87904e70';
export const stripe_public_key = Config?.STRIPE_PUBLIC_KEY ?? 'pk_live_51QpTDFREQUp6NEUldDLOMTHcosl0g6daUJ30iqgKbpL1mTgyJP5upYMQaKktdpoj7o05UKheD2ouSpsLOXIKYJc100ZFiZmsXE';
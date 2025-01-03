import Config from "react-native-config";

export const environment = Config?.ENV ?? 'production';

export const usertokenkey = "flyawaytoken";

export const apibaseurl = Config?.API_BASE_URL ?? 'https://api.flyawaygolf.com/v2';
export const websocketurl = Config?.WEBSOCKET_URL ?? 'wss://api.flyawaygolf.com/v2';
export const cdnbaseurl = Config?.CDN_BASE_URL ?? 'https://cdn.flyawaygolf.com';
export const websiteurl = Config?.WEBSITE_BASE_URL ?? 'https://flyawaygolf.com';
export const posturl = Config?.POST_URL ?? 'https://flyawaygolf.com/posts';

export const captchasiteKey = Config?.CAPTCHA_SITE_KEY ?? 'd53ab178-9eea-40c8-b02a-329a87904e70';
export const strip_public_key = Config?.STRIPE_PUBLIC_KEY ?? 'pk_live_51MgmhMIjDzZnrQfFN0QFCPcbXetzt6u8nwmjAWfW9n8qZoonDe1U6fXhFTxIe8asAm1pehZjBAifxp9aYpvdbZ2d00PuNMWR5o';

import type { ISO_639_CODE_LIST } from "../../utils/ISO-369-1";
import type { attachments, embeds, error, givewayInterface, pollInterface, premium_type, userInfo } from "./Global"
import { myInformationInterface } from "./Me";

/**0 = text only | 1 = image (include gif) | 2 = video | 3 = audio | 4 = others */
export type postTypes = 0 | 1 | 2 | 3 | 4;

export interface createPostParameters {
  request_id?: string;
  /**
   * Use it to create a comment
   */
  attached_post_id?: string;
  /**
   * Use it to create a share
   */
  shared_post_id?: string;
  content: string;
  attachments?: Array<attachments>;
  categories?: number[];
  giveway?: givewayInterface;
  paid?: boolean;
}

export interface createPostResponseInterface {
  post_id: string;
  attached_post_id?: string;
  shared_post_id?: string;
  attachments?: Array<attachments>;
  embeds: Array<embeds>;
  mentions: Array<string>;
  hashtags: Array<string>;
  content: string;
  content_language: ISO_639_CODE_LIST;
  type: postTypes;
  paid?: boolean;
  device?: string;
  // poll?: pollInterface;
  // giveway?: givewayInterface;
  created_at: Date;
}

export interface createPostReponse {
  error?: error;
  data?: createPostResponseInterface
}

export interface postResponseSchema {
  post_id: string;
  content: string;
  content_language: ISO_639_CODE_LIST;
  locale: ISO_639_CODE_LIST;
  type: postTypes;
  attachments: Array<attachments> | [];
  attached_post_id?: string;
  shared_post_id?: string;
  embeds: Array<embeds> | [];
  poll?: pollInterface;
  giveway?: givewayInterface;
  mentions: Array<userInfo> | [];
  categories: number[] | [];
  hashtags: Array<string> | [];
  created_at: string;
  from: userInfo;
  likes: number;
  liked: boolean;
  shares: number;
  comments: number;
  views: number;
  shared_post?: {
    post_id: string,
    user_id: string,
    created_at: string,
    content: string,
    mentions: Array<userInfo> | [];
    hashtags: Array<string> | [];
    locale: ISO_639_CODE_LIST,
    paid: boolean;
    from: userInfo
  } | false;
  display_not_allowed?: true;
  paid?: boolean;
  bookmarks: number;
  bookmarked: boolean;
}

export interface fetchOnePost {
  error?: error;
  data?: postResponseSchema
}

export interface postResponse {
  error?: error;
  data?: Array<postResponseSchema>;
  pagination_key?: string
}

export interface pinedPostResponse {
  error?: error;
  data?: postResponseSchema
}

export type postInterface = postResponseSchema;

export interface searchParams {
  from?: string;
  locale?: ISO_639_CODE_LIST | string;
  query?: string;
  before?: string;
  after?: string;
  type?: string | premium_type;
  pagination_key?: string
}

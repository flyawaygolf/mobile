import { ISO_639_CODE_LIST } from "../../utils/ISO-369-1";
import type { error } from "./Global"
import { myInformationInterface } from "./Me";

export interface fetchSessionsResponseSchema {
    session_id: string,
    device_name?: string;
    from?: {
      city?: string,
      country?: string
    };
    created_at?: Date;
}

export interface sessionFetchResponse {
    error?: error,
    data?: Array<fetchSessionsResponseSchema | []>
}

export interface createSessionFetchResponse {
  error?: error,
  data?: myInformationInterface
}
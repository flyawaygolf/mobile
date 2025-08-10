import RequestEmitter, { requestParams } from '../utils/RequestEmitter';
import { EventInterface, GlobalInterface } from './Interfaces';

class EventManager extends RequestEmitter {
  constructor(params: requestParams) {
    super(params);
  }

  public async create(params: EventInterface.eventsCreatorParams) {
    const request = await this.postRequest(`/events`, params);
    const response = request as EventInterface.eventsCreatorResponse;

    return response;
  }

  public async delete(event_id: string) {
    const request = await this.deleteRequest(`/events/${event_id}`);
    const response = request as GlobalInterface.emptyResponse;

    return response;
  }

  public async update(event_id: string, params: EventInterface.eventsUpdateParams) {
    const request = await this.patchRequest(`/events/${event_id}`, params);
    const response = request as GlobalInterface.successResponse;

    return response;
  }

  public async fetch(options?: {
    pagination?: GlobalInterface.paginationParams;
    limit?: number;
  }) {
    let _url = `/events`;
    const parameters = []

    if (options?.pagination) {
      const { pagination_key, limit } = options.pagination;
      if (pagination_key) parameters.push(`pagination_key=${pagination_key}`);
      if (limit) parameters.push(`limit=${limit}`);
    }
    if (parameters.length > 0) _url = _url.concat("?");
    const request = await this.getRequest(_url.concat(parameters.join("&")));
    const response = request as EventInterface.multipleEventsResponse;

    return response;
  }

  public async calendar(golf_id: string, options?: {
    period?: "week" | "month" | "day";
    start_date?: string;
    end_date?: string;
    pagination?: GlobalInterface.paginationParams;
    limit?: number;
  }) {
    let _url = `/golfs/${golf_id}/events/calendar`;
    const parameters: string[] = [];

    if (options?.period) {
      parameters.push(`period=${options.period}`);
    }

    if (options?.start_date) {
      parameters.push(`start_date=${encodeURIComponent(options.start_date)}`);
    }

    if (options?.end_date) {
      parameters.push(`end_date=${encodeURIComponent(options.end_date)}`);
    }

    if (options?.pagination) {
      const { pagination_key, limit } = options.pagination;
      if (pagination_key) parameters.push(`pagination_key=${pagination_key}`);
      if (limit) parameters.push(`limit=${limit}`);
    }

    if (options?.limit) {
      parameters.push(`limit=${options.limit}`);
    }

    if (parameters.length > 0) _url = _url.concat("?");

    const request = await this.getRequest(_url.concat(parameters.join("&")));
    const response = request as EventInterface.multipleEventsResponse;

    return response;
  }

  public async favorites(options?: {
    pagination?: GlobalInterface.paginationParams;
    limit?: number;
  }) {
    let _url = `/events/favorites`;
    const parameters = []

    if (options?.pagination) {
      const { pagination_key, limit } = options.pagination;
      if (pagination_key) parameters.push(`pagination_key=${pagination_key}`);
      if (limit) parameters.push(`limit=${limit}`);
    }
    if (parameters.length > 0) _url = _url.concat("?");
    const request = await this.getRequest(_url.concat(parameters.join("&")));
    const response = request as EventInterface.multipleEventsResponse;

    return response;
  }

  public async fetchOne(event_id: string) {
    const request = await this.getRequest(`/events/${event_id}`);
    const response = request as EventInterface.eventResponse;

    return response;
  }

  public async joined(options?: {
    pagination?: GlobalInterface.paginationParams;
    limit?: number;
  }) {
    let _url = `/events/joined`;
    const parameters = []

    if (options?.pagination) {
      const { pagination_key, limit } = options.pagination;
      if (pagination_key) parameters.push(`pagination_key=${pagination_key}`);
      if (limit) parameters.push(`limit=${limit}`);
    }
    if (parameters.length > 0) _url = _url.concat("?");
    const request = await this.getRequest(_url.concat(parameters.join("&")));
    const response = request as EventInterface.multipleEventsResponse;

    return response;
  }

  public async join(event_id: string) {
    const request = await this.postRequest(`/events/${event_id}/join`);
    const response = request as GlobalInterface.successResponse;

    return response;
  }

  public async leave(event_id: string) {
    const request = await this.deleteRequest(`/events/${event_id}/leave`);
    const response = request as GlobalInterface.successResponse;

    return response;
  }

  public async participants(event_id: string, options?: {
    pagination?: GlobalInterface.paginationParams;
    limit?: number;
  }) {
    let _url = `/events/${event_id}/participants`;
    const parameters = []

    if (options?.pagination) {
      const { pagination_key, limit } = options.pagination;
      if (pagination_key) parameters.push(`pagination_key=${pagination_key}`);
      if (limit) parameters.push(`limit=${limit}`);
    }
    if (parameters.length > 0) _url = _url.concat("?");
    const request = await this.getRequest(_url.concat(parameters.join("&")));
    const response = request as EventInterface.participantsResponse;

    return response;
  }
}

export default EventManager;

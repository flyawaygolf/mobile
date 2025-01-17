import RequestEmitter, { requestParams } from '../utils/RequestEmitter';
import { eventsCreatorParams, eventsCreatorResponse, eventResponse, multipleEventsResponse, eventsUpdateParams } from './Interfaces/Events';
import { emptyResponse, successResponse } from './Interfaces/Global';

class EventManager extends RequestEmitter {
  constructor(params: requestParams) {
    super(params);
  }

  public async create(params: eventsCreatorParams) {
    const request = await this.postRequest(`/events`, params);
    const response = request as eventsCreatorResponse;

    return response;
  }

  public async delete(event_id: string) {
    const request = await this.deleteRequest(`/events/${event_id}`);
    const response = request as emptyResponse;

    return response;
  }

  public async update(event_id: string, params: eventsUpdateParams) {
    const request = await this.patchRequest(`/events/${event_id}`, params);
    const response = request as successResponse;

    return response;
  }

  public async fetch() {
    const request = await this.getRequest(`/events`);
    const response = request as multipleEventsResponse;

    return response;
  }

  public async fetchOne(event_id: string) {
    const request = await this.getRequest(`/events/${event_id}`);
    const response = request as eventResponse;

    return response;
  }

  public async join(event_id: string) {
    const request = await this.postRequest(`/events/${event_id}/join`);
    const response = request as successResponse;

    return response;
  }

  public async leave(event_id: string) {   
    const request = await this.deleteRequest(`/events/${event_id}/leave`);
    const response = request as successResponse;

    return response;
  }
}

export default EventManager;

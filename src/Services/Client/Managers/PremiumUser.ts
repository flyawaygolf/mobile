import RequestEmitter, { requestParams } from '../utils/RequestEmitter';
import { fetchUserResponse } from './Interfaces/User';

class PremiumUser extends RequestEmitter {

  constructor(params: requestParams) {
    super(params);
  }

  public async edit(options: {
    availability?: {
      id: number; // Identifiant unique pour le jour de la semaine
      available: boolean; // Indique si l'utilisateur est disponible ce jour-là
      start: Date; // Date et heure de début (format ISO)
      end: Date;   // Date et heure de fin (format ISO)
    }[];
    show_locked_location?: boolean; // Afficher la localisation verrouillée
    show_availability?: boolean; // Afficher les disponibilités
    locked_location?: {
      lat: number; // Latitude
      long: number; // Longitude
    };
  }) {
    const request = await this.patchRequest("/users/me/premium", options);
    const response = request as fetchUserResponse;
    return response;
  }
}

export default PremiumUser;

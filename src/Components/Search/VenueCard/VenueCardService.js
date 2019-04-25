import superAgent from "superagent";
import {endpoint} from "../../../Utilities/endpoint";


export async function requestVenueDetails(venueId) {
  return await superAgent.get(endpoint(`/venues/${venueId}`));
}

export async function getUserImage (userId) {
  return await superAgent.get(endpoint(`/users/${userId}/photo`))
}

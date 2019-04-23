import superagent from "superagent";
import {endpoint} from "../../../Utilities/endpoint";


export async function requestVenueDetails(venueId) {
  return await superagent.get(endpoint(`/venues/${venueId}`));
}

export async function getUserImage (userId) {
  return await superagent.get(endpoint(`/users/${userId}/photo`))
}

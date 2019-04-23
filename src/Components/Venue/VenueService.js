import {endpoint} from "../../Utilities/endpoint";
import superAgent from "superagent";


export async function putVenuePhoto (filecontents, filetype) {
 //TODO: Implement me with form data
}


export async function sendVenueUpdate (editedVenue, currentVenue, venueId) {
  const authToken = localStorage.getItem("authToken");

  const venueDifferences = parseVenues(editedVenue, currentVenue);

  return superAgent.patch(endpoint(`/venues/${venueId}`))
    .set("x-authorization", authToken)
    .send(venueDifferences);
}


let parseVenues = function (editedVenue, currentVenue) {

  // TODO refactor this
  let venueDifferences = {};
  if (editedVenue.venueName !== currentVenue.venueName) {
    venueDifferences.venueName = editedVenue.venueName;
  }
  if (editedVenue.categoryId !== currentVenue.category.categoryId) {
    venueDifferences.categoryId = editedVenue.categoryId;
  }
  if (editedVenue.city !== currentVenue.city) {
    venueDifferences.city = editedVenue.city;
  }
  if (editedVenue.shortDescription !== currentVenue.shortDescription) {
    venueDifferences.shortDescription = editedVenue.shortDescription;
  }
  if (editedVenue.longDescription !== currentVenue.longDescription) {
    venueDifferences.longDescription = editedVenue.longDescription;
  }
  if (editedVenue.address !== currentVenue.address) {
    venueDifferences.address = editedVenue.address;
  }
  if (editedVenue.latitude !== currentVenue.latitude) {
    venueDifferences.latitude = editedVenue.latitude;
  }
  if (editedVenue.longitude !== currentVenue.longitude) {
    venueDifferences.longitude = editedVenue.longitude;
  }
};

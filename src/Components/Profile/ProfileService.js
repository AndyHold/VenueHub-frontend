import superAgent from "superagent";
import {endpoint} from "../../Utilities/endpoint";

export async function putProfilePhoto (fileContents, fileType) {
  let authToken = localStorage.getItem("authToken");
  let userId = localStorage.getItem("userId");

  return await superAgent.put(endpoint(`/users/${userId}/photo`))
    .set("x-authorization", authToken)
    .type(fileType)
    .send(fileContents);
}

export async function getUserImage () {
  let authToken = localStorage.getItem("authToken");
  let userId = localStorage.getItem("userId");

  return await superAgent.get(endpoint(`/users/${userId}/photo`))
    .set("x-authorization", authToken);
}

export async function deleteProfilePhoto () {
  let authToken = localStorage.getItem("authToken");
  let userId = localStorage.getItem("userId");

  return await superAgent.delete(endpoint(`/users/${userId}/photo`))
    .set("X-Authorization", authToken)
}

export async function sendEditUserRequest (user) {
  let authToken = localStorage.getItem("authToken");
  let userId = localStorage.getItem("userId");

  return await superAgent.patch(endpoint(`/users/${userId}`))
    .set("x-authorization", authToken)
    .send(user);
}

export async function requestUserVenues(userId) {
  let response = await superAgent.get(endpoint(`/venues?adminId=${userId}`));
  return response.body;
}

export async function requestCategories() {
  let response = await superAgent.get(endpoint('/categories'));

  return response.body;
}

export async function getUserReviews(userId) {
  let authToken = localStorage.getItem("authToken");

  return superAgent.get(endpoint(`/users/${userId}/reviews`))
    .set("x-authorization", authToken);
}

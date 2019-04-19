import superAgent from "superagent";
import {endpoint} from "../../Utilities/endpoint";

export async function putProfilePhoto (fileContents, fileType) {
  let authToken = localStorage.getItem("authToken");
  let userId = localStorage.getItem("userId");
  console.log("here");

  return await superAgent.put(endpoint(`/users/${userId}/photo`))
    .set("x-authorization", authToken)
    .type(fileType)
    .send(fileContents);
}

export async function deleteProfilePhoto () {
  let authToken = localStorage.getItem("authToken");
  let userId = localStorage.getItem("userId");

  return await superAgent.delete(endpoint(`/users/${userId}/photo`))
    .set("X-Authorization", authToken)
    .set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
}

export async function sendEditUserRequest (user) {
  let authToken = localStorage.getItem("authToken");
  let userId = localStorage.getItem("userId");

  return await superAgent.patch(endpoint(`/users/${userId}`))
    .set("x-authorization", authToken)
    .send(user);
}

import superAgent from "superagent";
import {endpoint} from "./endpoint";


export async function sendLoginRequest(user) {
  const response = await superAgent.post(endpoint("/users/login"))
    .send(user);

  return response.body;
}


export async function sendSignUpRequest(user) {
  const response = await superAgent.post(endpoint("/users/"))
    .send(user);

  return response.body;
}


export async function sendLogoutRequest() {
  const response = await superAgent.post(endpoint("/users/logout"))
    .set("x-authorization", localStorage.getItem("authToken"));

  return response.body;
}

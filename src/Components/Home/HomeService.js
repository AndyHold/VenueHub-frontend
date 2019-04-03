import { endpoint } from "../../Utilities/endpoint"
import superAgent from "superagent";


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

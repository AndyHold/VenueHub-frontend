import superAgent from "superagent";
import { endpoint } from "../../Utilities/endpoint";


export async function getUser(userId) {
  let response = await superAgent.get(endpoint(`/users/${userId}`))
    .set("x-authorization", localStorage.getItem("authToken"));

  return response.body;
}

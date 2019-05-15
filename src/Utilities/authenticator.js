import { endpoint } from "./endpoint";
import superAgent from "superagent";

export async function isLoggedInOrOut(to, from, next) {
  const userId = localStorage.getItem("userId");
  const authToken = localStorage.getItem("authToken");

  // If the userId or authToken do not exist, continue
  if (!userId && !authToken) {
    next();
    return;
  }

  // Request the user details and update them in the UserStorage
  superAgent.get(endpoint(`/users/${userId}`))
    .set("X-Authorization", authToken)
    .then((response) => {
      if (!response.body.hasOwnProperty("email")) {
        localStorage.removeItem("userId");
        localStorage.removeItem("authToken");
      }
      next();
    })
    .catch(() => {
      localStorage.removeItem("userId");
      localStorage.removeItem("authToken");
      next();
    })
}

export async function isNotLoggedIn(to, from, next) {
  const userId = localStorage.getItem("userId");
  const authToken = localStorage.getItem("authToken");

  // If the userId and authToken exist, go to the profile screen
  if (userId && authToken) {
    next(`/profile/${userId}`);
  } else {
    next();
  }
}

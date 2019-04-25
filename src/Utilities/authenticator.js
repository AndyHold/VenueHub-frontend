import { endpoint } from "./endpoint";
import UserStorage from "../DataStorage/UserStorage";
import superAgent from "superagent";

export async function isLoggedInOrOut(to, from, next) {
  const userId = localStorage.getItem("userId");
  const authToken = localStorage.getItem("authToken");

  // If the userId or authToken do not exist, continue
  if (!userId || !authToken) {
    next();
    return;
  }

  // If the user is already logged in, continue
  if (UserStorage.methods.isLoggedIn()) {
    next();
    return;
  }

  // Request the user details and update them in the UserStorage
  superAgent.get(endpoint(`/users/${userId}`))
    .set("X-Authorization", authToken)
    .then(response => {
      UserStorage.methods.setUserData(response.body, userId);
      next();
    })
    .catch(() => {
      localStorage.removeItem("userId");
      localStorage.removeItem("authToken");
      UserStorage.methods.logout();
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

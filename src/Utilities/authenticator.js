import { endpoint } from "./endpoint";
import UserStorage from "../DataStorage/userStorage";


export async function isLoggedIn(to, from, next) {
  const userId = localStorage.getItem("userId");
  const authToken = localStorage.getItem("authToken");

  // If the userId or authToken do not exist, display the home page
  if (!userId || !authToken) {
    next('/');
    return;
  }

  // If the user is already logged in, continue
  if (UserStorage.methods.isLoggedIn()) {
    next();
    return;
  }

  // Request the user details and update them in the UserStorage, on error display the home page.
  this.$http.get(endpoint(`/users/${userId}`))
    .set("X-Authorization", authToken)
    .then(response => {
      UserStorage.methods.setUserData(response.body);
      next();
    })
    .catch(() => {
      alert("Please Login to continue");
      next('/')
    })

}

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
  this.$http.get(endpoint(`/users/${userId}`))
    .set("X-Authorization", authToken)
    .then(response => {
      UserStorage.methods.setUserData(response.body);
      next();
    })
    .catch(() => {
      next()
    })

}

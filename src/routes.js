import VueRouter from "vue-router";

// Component imports
import Home from "./Components/Home/Home.vue";
import Search from "./Components/Search/Search";
import Profile from "./Components/Profile/Profile";

import {isLoggedIn, isLoggedInOrOut} from "./Utilities/authenticator";

const routes = [
  {
    path: "/",
    component: Home,
    beforeEnter: isLoggedInOrOut
  },
  {
    path: "/search",
    component: Search,
    beforeEnter: isLoggedInOrOut
  },
  {
    path: "/profile",
    component: Profile,
    beforeEnter: isLoggedIn
  }
];

const router = new VueRouter({
  mode: "history",
  routes: routes
});

export default router;

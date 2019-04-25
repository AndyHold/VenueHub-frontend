import VueRouter from "vue-router";

// Component imports
import Home from "./Components/Home/Home.vue";
import Search from "./Components/Search/Search";
import Profile from "./Components/Profile/Profile";
import Venue from "./Components/Venue/Venue";

import {isLoggedInOrOut, isNotLoggedIn} from "./Utilities/authenticator";

const routes = [
  {
    path: "/",
    component: Home,
    beforeEnter: isNotLoggedIn
  },
  {
    path: "/search",
    component: Search,
    beforeEnter: isLoggedInOrOut
  },
  {
    path: "/profile/:userId",
    component: Profile,
    beforeEnter: isLoggedInOrOut
  },
  {
    path: "/venues/:venueId",
    component: Venue,
    beforeEnter: isLoggedInOrOut
  },
  {
    path: '*',
    redirect: '/'
  }
];

const router = new VueRouter({
  mode: "history",
  routes: routes
});

export default router;

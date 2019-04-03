import VueRouter from "vue-router";

// Component imports
import Home from "./Components/Home/Home.vue";

// import {isLoggedIn, isLoggedInOrOut} from "./Utilities/authenticator";

const routes = [
  {
    path: "/",
    component: Home,
    // beforeEnter: isLoggedInOrOut
  }
];

const router = new VueRouter({
  mode: "history",
  routes: routes
});

export default router;

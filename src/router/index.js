import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Loader from "../views/Loader.vue";
import Job from "../views/Job.vue";

Vue.use(VueRouter);

// Reference for vue router https://router.vuejs.org/guide/

const routes = [
  {
    // Shows the search, a small nav uh... "bar" at the top
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    // There's not even a link to this, I think I was just playing ages about with
    // the lazy loading pages
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    // The route to load new data up
    path: "/loader",
    name: "Loader",
    component: Loader,
  },
  {
    // a job detail/edit page
    path: "/job/:id",
    name: "Job",
    component: Job,
  },
];

const router = new VueRouter({
  routes,
});

export default router;

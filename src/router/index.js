import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/Login.vue";
import Dashboard from "../views/Dashboard.vue";
import Users from "../views/Users.vue";
import Departments from "../views/Departments.vue";
import Permissions from "../views/Permissions.vue";
import Layout from "../layout/Layout.vue";
import Attendence from "../views/Attendence.vue";
import AttendenceReport from "../views/AttendenceReport.vue";


const routes = [



  {
    path: "/",
    component: Layout,
    children: [

      { path: "/dashboard", name: 'dashboard', component: Dashboard },
      { path: "/users", name: 'users', component: Users },
      { path: "/departments", name: 'departments', component: Departments },
      { path: "/permissions", name: 'permissions', component: Permissions },
      { path: "/attendence", name: 'attendence', component: Attendence },
      { path: "/attendence-report", name: 'attendence-report', component: AttendenceReport },
    ]
  },

  { path: "/login", name: 'login', component: Login },

  {
    path: '/:pathMatch(.*)*',
    redirect: "/dashboard"
  },

]


const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("accessToken");

  // Routes that do NOT require login
  const publicPages = ['login'];
  const isPublicPage = publicPages.includes(to.name);

  if (to.path === '/') {
    next({name: "dashboard"});
  }

  if (!isPublicPage && !token) {
    next({ name: 'login' });
  } else if (to.name === 'login' && token) {
    next({ name: 'dashboard' });
  } else {
    next(); // allow route
  }
});

export default router;
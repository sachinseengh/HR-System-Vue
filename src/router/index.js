import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Dashboard from "../views/Dashboard.vue";
import Users from "../views/Users.vue";
import Departments from "../views/Departments.vue";
import Permissions from "../views/Permissions.vue";
import Layout from "../layout/Layout.vue";
import Attendence from "../views/Attendence.vue";
import AttendenceReport from "../views/AttendenceReport.vue";
import ResetPassword from "@/views/ResetPassword.vue";
import ForgetPassword from "@/views/ForgetPassword.vue";
import ResetPasswordPage from "@/views/ResetPassword.vue";
import ChangePassword from "@/components/ChangePassword.vue";
import useUserStore from "@/userStore/UserStore";
import { toast } from "vue-sonner";

const routes = [
  {
    path: "/",
    component: Layout,
    children: [
      { path: "/dashboard", name: 'dashboard', component: Dashboard, meta: { permission: "CAN_VIEW_DASHBOARD_MENU" } },
      { path: "/users", name: 'users', component: Users, meta: { permission: "CAN_VIEW_USERS_MENU" } },
      { path: "/departments", name: 'departments', component: Departments, meta: { permission: "CAN_VIEW_DEPARTMENTS_MENU" } },
      { path: "/permissions", name: 'permissions', component: Permissions, meta: { permission: "CAN_VIEW_PERMISSIONS_MENU" } },
      { path: "/attendence", name: 'attendence', component: Attendence, meta: { permission: "CAN_VIEW_ATTENDENCE" } },
      { path: "/attendence-report", name: 'attendence-report', component: AttendenceReport, meta: { permission: "CAN_VIEW_ATTENDENCE_REPORT_MENU" } },
      { path: "/change-password", name: 'change-password', component: ChangePassword },
    ]
  },
  { path: "/login", name: 'login', component: Login },
  { path: "/forget-password", name: 'forget-password', component: ForgetPassword },
  { path: "/reset-password", name: 'reset-password', component: ResetPassword },
  { path: '/:pathMatch(.*)*', redirect: "/dashboard" },
];


const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {

  const token = localStorage.getItem("accessToken");
  const store = useUserStore();

  // Routes that do NOT require login
  const publicPages = ['login', 'reset-password', 'forget-password'];
  const isPublicPage = publicPages.includes(to.name);

  if (to.path === '/') {
    next({ name: "dashboard" });
  }

  if (!isPublicPage && !token) {

    next({ name: 'login' });

  }

  if (to.name === 'login' && token) {

    next({ name: 'dashboard' });

  }

  if (to.name === 'reset-password' && token) {

    next({ name: 'dashboard' })
  }

  const requiredPermission = to.meta.permission;
  if (requiredPermission && !store.userPermission[requiredPermission]) {
    // Optionally show toast
    toast.error("You do not have permission to access this page");
    return next({ name: 'dashboard' }); // redirect to dashboard or 403 page
  }

  next(); // allow route

});

export default router;
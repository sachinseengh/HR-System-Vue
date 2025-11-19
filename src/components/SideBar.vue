<script setup>
import { toast } from 'vue-sonner';
import axiosInstance from '../api/AxiosInstance';
import useUserStore from '../userStore/UserStore';
import { computed } from 'vue';
import router from '@/router';

const userStore = useUserStore();

// Sidebar computed based on permissions, guard against undefined
const sidebar = computed(() => {
  const perm = userStore.userPermission;

  if (!perm) return []; // <- early return if permissions not loaded

  return [
    { name: "Dashboard", path: "/dashboard", icon: "fa fa-solid fa-home", showMenu: perm?.CAN_VIEW_DASHBOARD_MENU },
    { name: "Users", path: "/users", icon: "fa fa-solid fa-users", showMenu: perm?.CAN_VIEW_USERS_MENU },
    { name: "Departments", path: "/departments", icon: "fa fa-solid fa-building-user", showMenu: perm?.CAN_VIEW_DEPARTMENTS_MENU },
    { name: "Permissions", path: "/permissions", icon: "fa fa-solid fa-fingerprint", showMenu: perm?.CAN_VIEW_PERMISSIONS_MENU },
    { name: "Attendance", path: "/attendence", icon: "fa fa-solid fa-user-clock", showMenu: perm?.CAN_VIEW_ATTENDENCE },
    { name: "Attendance Report", path: "/attendence-report", icon: "fa fa-solid fa-clipboard-list", showMenu: perm?.CAN_VIEW_ATTENDENCE_REPORT_MENU },
  ];
});

async function handleLogout() {
  try {
    const response = await axiosInstance.get("/logout");

    if(response.status === 200){
        router.push("/login");
        toast.success("Logout Success")
    }
  } catch (err) {
    // ignore errors
    toast.error('Something went wrong !');
  }

  userStore.logout();
}
</script>

<template>
  <section class="sidebar">
    <div class="sidebar-items">
      <router-link
        v-for="menu in sidebar"
        :key="menu.name"
         v-show="menu.showMenu"
        :to="menu.path"
        class="dashboard items"
      >
        <div class="icon">
          <i :class="menu.icon"></i>
        </div>
        <div class="name">{{ menu.name }}</div>
      </router-link>
    </div>

    <button class="logout-btn" @click="handleLogout">
      <div class="logout items">
        <div class="icon">
          <i class="fa-solid fa-right-from-bracket"></i>
        </div>
        <div class="name"><p>Logout</p></div>
      </div>
    </button>
  </section>
</template>


<style scoped>
.sidebar {
    position: fixed;
    width: 18rem;
    min-height: 99vh;
    background-color: #79b4cf8e;
    display: flex;
    flex-direction: column;
    padding: 3rem 0;
    justify-content: space-between;
}

.sidebar-items {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.items {
    cursor: pointer;
    margin: 0 1.4rem;
    padding: 1rem;
    border-radius: 7px;
    display: flex;
    flex-direction: row;
    gap: 1rem;
    font-size: 1.1rem;
    color: black !important;
    font-weight: 600;
    user-select: none;
    transition: background-color 200ms;
}

.items:hover {
    background-color: #259bd6bb;
}

.logout {
    position: absolute;
    bottom: 11rem;
}

.items a {
    text-decoration: none;
    color: black;
}
</style>

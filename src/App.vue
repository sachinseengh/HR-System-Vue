<script setup>
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'
import useUserStore from './userStore/UserStore';
import { onMounted } from 'vue';

const userStore = useUserStore();

onMounted(() => {
  // Load user info and permissions from token
  userStore.loadUser();
  userStore.loadUserPermission();

  console.log("User Info Loaded:", userStore.userInfo);
  console.log("User Permissions Loaded:", userStore.userPermission);
});
</script>

<template>
  <Toaster position="top-right" closeButton="true" closeButtonPosition="top-right" :expand="true" :duration="1000"/>
  <router-view />
</template>

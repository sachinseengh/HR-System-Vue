<script setup>
import { computed, onMounted } from 'vue';
import BottomBar from '../components/BottomBar.vue';
import Header from '../components/Header.vue';
import SideBar from '../components/SideBar.vue';
import useUserStore from '../userStore/UserStore';


</script>

<template>

  <div class="layout">

    <Header></Header>
    <SideBar />
    <main class="content">
      <router-view />
    </main>

    <BottomBar />


  </div>



</template>


<style scoped>
.layout {
  display: flex;
  flex-direction: column;
}

.header {

  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 4rem;
  /* header height */
  z-index: 1000;

}

.sidebar {

  position: fixed;
  top: 4rem;
  /* same as header height */
  left: 0;
  width: 18rem;
  /* 250px */
  height: calc(100vh - 4rem);
  z-index: 900;
}

.content {

  margin-top: 6rem;
  /* header height */
  margin-left: 20.625rem;
  /* sidebar width */


  margin-right: 0.5rem;

  height: 100%;

  overflow-y: auto;
  background-color: #f9f9f9;
  box-sizing: border-box;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  display: none;
}


@media (max-width: 640px) {
  .sidebar {
    display: none !important;

  }

  .bottom-bar {
    display: block;
  }

  .content {
    margin-left: 0.5rem;
    width: 100vw;
  }
}
</style>
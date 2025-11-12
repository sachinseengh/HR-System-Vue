<script setup>
import { toast } from 'vue3-toastify';
import axiosInstance from '../api/AxiosInstance';
import useUserStore from '../userStore/UserStore';


const userStore = useUserStore()


async function handleLogout() {

    try {
        const response = await axiosInstance.get("/logout");

        if (response.status === 401) {
            toast.success("Logout Success!")
        }

    } catch (err) {
        toast.success("Logout Success!")
    }

}
</script>

<template>

    <section class="sidebar">

        <div class="sidebar-items">
            <div class="dashboard items">
                <div class="icon">
                    <i class="fa fa-solid fa-home"></i>
                </div>
                <div class="name">
                    <router-link to="/dashboard">Dashboard</router-link>
                </div>
            </div>
            <div class="users items">
                <div class="icon">
                    <i class="fa fa-solid fa-users"></i>
                </div>
                <div class="name">
                    <router-link to="/users">{{ userStore.isAdmin() ? 'Users' : 'Profile' }}</router-link>
                </div>
            </div>
            <div class="department items" v-if="userStore.isAdmin()">
                <div class="icon">
                    <i class="fa fa-solid fa-building-user"></i>
                </div>
                <div class="name">
                    <router-link to="/departments">Departments</router-link>
                </div>
            </div>
            <div class="permission items" v-if="userStore.isAdmin()">
                <div class="icon">
                    <i class="fa-solid fa-fingerprint"></i>
                </div>
                <div class="name">
                    <router-link to="/permissions">Permissions</router-link>
                </div>
            </div>

            <router-link to="/attendence" class="attendence items">
                <div class="icon">
                    <i class="fa-solid fa-user-clock"></i>
                </div>
                <div class="name">
                    <div>Attendence</div>
                </div>
            </router-link>

            <div class="attendence-report items" v-if="userStore.isAdmin()">
                <div class="icon">
                    <i class="fa-solid fa-clipboard-list"></i>
                </div>
                <div class="name">
                    <router-link to="/attendence-report">Attendence Report</router-link>
                </div>
            </div>

        </div>

        <button class="logout-btn" @click="handleLogout">
            <div class="logout items">


                <div class="icon">
                    <i class="fa-solid fa-right-from-bracket"></i>
                </div>
                <div class="name">
                    <p>Logout</p>
                </div>


            </div>
        </button>
    </section>


</template>

<style scoped>
.sidebar {

    position: fixed;

    max-width: 15rem;
    min-height: 99vh;
    background-color: #79b4cf8e;
    display: flex;
    flex-direction: column;
    padding: 3rem 0;
    padding-left: 4rem;

    justify-content: space-between;

}

.sidebar-items {
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
}

.items {
    text-decoration: none;
    display: flex;
    flex-direction: row;
    gap: 1rem;
    font-size: 1.1rem;
    user-select: none;
}

.logout {
    position: absolute;
    bottom: 11rem;
}

.items a {
    text-decoration: none;
    color: black;
}


.logout-btn {

    width: rem;
    cursor: pointer;
}
</style>
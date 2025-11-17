<script setup>
 
import { toast } from 'vue-sonner';
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
            <router-link to="/dashboard" class="dashboard items">
                <div class="icon">
                    <i class="fa fa-solid fa-home"></i>
                </div>
                <div class="name">
                    <div>Dashboard</div>
                </div>
            </router-link>
            <router-link to="/users" class="users items">
                <div class="icon">
                    <i class="fa fa-solid fa-users"></i>
                </div>
                <div class="name">
                    <div>{{ userStore.isAdmin() ? 'Users' : 'Profile' }}</div>
                </div>
            </router-link>
            <router-link to="/departments" class="department items" v-if="userStore.isAdmin()">
                <div class="icon">
                    <i class="fa fa-solid fa-building-user"></i>
                </div>
                <div class="name">
                    <div>Departments</div>
                </div>
            </router-link>

            <router-link to="/permissions" class="permission items" v-if="userStore.isAdmin()">
                <div class="icon">
                    <i class="fa-solid fa-fingerprint"></i>
                </div>
                <div class="name">
                    <div>Permissions</div>
                </div>
            </router-link>

            <router-link to="/attendence" class="attendence items">
                <div class="icon">
                    <i class="fa-solid fa-user-clock"></i>
                </div>
                <div class="name">
                    <div>Attendence</div>
                </div>
            </router-link>

            <router-link to="/attendence-report" class="attendence-report items" v-if="userStore.isAdmin()">
                <div class="icon">
                    <i class="fa-solid fa-clipboard-list"></i>
                </div>
                <div class="name">
                    <div to="/attendence-report">Attendence Report</div>
                </div>
            </router-link>

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
    text-decoration: none;
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
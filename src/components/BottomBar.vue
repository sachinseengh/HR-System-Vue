<script setup>
import { toast } from 'vue3-toastify';
import axiosInstance from '../api/AxiosInstance';
import router from '../router';
import useUserStore from '../userStore/UserStore';



const userStore = useUserStore();


async function handleLogout() {

    try {
        const response = await axiosInstance.get("/logout");



    } catch (err) {
        console.log(err);

        if (err.response) {

            if (err.response.status === 401) {
                toast.success("Logout Success!")
                 router.push('/login')
            }
        }

    }

}


</script>


<template>
    <section class="bottom-bar">



        <div class="bottom-bar-div">


            <div class="icons">
                <div class="users-icon icon">
                    <router-link to="/users"><i class="fa fa-solid fa-users"></i></router-link>
                </div>
                <div class="department-icon icon" v-if="userStore.isAdmin()">
                    <router-link to="/departments"><i class="fa fa-solid fa-building-user"></i></router-link>
                </div>

            

                <div class="permission-icon icon" v-if="userStore.isAdmin()">
                    <router-link to="/permissions"> <i class="fa-solid fa-fingerprint"></i></router-link>
                </div>

                    <div class="home-icon icon">
                    <router-link to="/dashboard"> <i class="fa-solid fa-home"></i></router-link>
                </div>


                <div class="attendence-icon icon">
                    <router-link to="/attendence">  <i class="fa-solid fa-user-clock"></i></router-link>
                </div>

                
                    <div class="attendence-report-icon icon" v-if="userStore.isAdmin()">
                    <router-link to="/attendence-report"> <i class="fa-solid fa-clipboard-list"></i></router-link>
                </div>
 
    

                <div class="logout-icon icon">
                    <router-link to="/logout"><i class="fa-solid fa-right-from-bracket"
                            @click="handleLogout"></i></router-link>
                </div>
            </div>



        </div>


    </section>
</template>





<style scoped>
.bottom-bar-div {
    width: 100%;
    height: 5rem;
    background-color: #CFF0FF;
    position: absolute;

    border-top-left-radius: 0.8rem;
    border-top-right-radius: 0.8rem;
    bottom: 0;
    z-index: 200;
    position: fixed;
    bottom: 0;
}


.icons {
    padding: 0.2rem 2rem;
    z-index: 1500;
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: space-between;
}

.icon {
    font-size: 1.8rem;
    
}


i{
    text-decoration: none;
    color:black
}
</style>
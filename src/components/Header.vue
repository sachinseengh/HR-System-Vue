<script setup>
import { onMounted, ref } from 'vue';
import useUserStore from '../userStore/UserStore';
import router from '@/router';



const userStore = useUserStore();

const showChangePassword = ref(false);

const handleChangePassword = () => {

    router.push("/change-password");
    showChangePassword.value = false;
}
</script>

<template>
    <section class="header">
        <div class="container">
            <div class="header-part">

                <div class="logo">
                    <div class="logo-image">
                        <router-link to="/dashboard"> <img src="../assets/com-logo.png" alt=""></img></router-link>
                    </div>
                </div>
                
               

                <div class="profile">
                    <div class="profile-image">
                         <img :src="userStore.userInfo.profileImageURL" alt="profile">
                    </div>
                    <div class="welcome-user" id="welcome-user" @click="showChangePassword =!showChangePassword">
                        <p>Welcome,</p>
                        <p>{{ userStore.userInfo.name }}  <i class="fa-solid fa-caret-down"></i></p>
                    </div>
                    <div @click="handleChangePassword" class="change-password hide" id="change-password" v-if="showChangePassword">
                        <p>Change Password</p>
                    </div>


                    
                </div>
            </div>

        </div>
    </section>

</template>


<style scoped>
.header {

    width: 100vw;
    background-color: #CFF0FF;

}

.header-part {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.6rem 3rem;
}

.logo {
    flex-basis: 30%;
}

.logo img {
    max-width: 15rem;
    height: 2rem;
    object-fit: cover;
}

.profile {
    display: flex;
    justify-content: space-between;
    align-items:center;
    gap:1rem;
}

.profile .icon i {
    font-size: 2rem;
}
a{
    text-decoration: none;
}

.change-password {

    position: absolute;
    top:4rem;
    right: -0.2rem;
    width: 12rem;
    color:black;
    padding-top: 0.4rem;
    text-align: center;
    background-color: rgba(85, 159, 186, 0.234);
    height: 2rem;
    border-radius: 0.5rem;
    cursor: pointer;
    
}

.welcome-user {
    cursor: pointer;
}

.profile-image img{

    width: 3rem;
    height: 3rem;
    object-fit: contain;
    border-radius: 50%;
    border:2px solid rgb(84, 80, 80);
}
</style>

<script setup>
import { onMounted, ref } from 'vue';
import useUserStore from '../userStore/UserStore';



const userStore = useUserStore();

 
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
                    <div class="icon">
                        <i class="fa-solid fa-user"></i>
                    </div>
                    <div class="welcome-user">
                        <p>Welcome,</p>
                        <p>{{userStore.userInfo.name}}</p>
                    </div>
                </div>
            </div>

        </div>
    </section>

</template>


<style scoped>



.header{

    width: 100vw;
    background-color: #CFF0FF;
       
}

.header-part{
     display:flex;
    justify-content: space-between;
    align-items: center;
    padding:1rem 3rem;
}

.logo{
flex-basis: 30%;
}

.logo img{
    max-width: 15rem;
    height: 2rem;
    object-fit: cover;
}

.profile{
    display:flex;
    justify-content: space-between;
    align-items: flex-end;
}

.profile .icon i{
     font-size: 2rem;
}
 
</style>
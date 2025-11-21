<script setup>
import axiosInstance from '@/api/AxiosInstance';
import ChangePassword from '@/components/ChangePassword.vue';
import router from '@/router';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
 


const route = useRoute();
 
const token = route.query.token || null;

if (token == null) {
    router.push("/login");
}
 
</script>

<template>
    <section>
        <div class="container">
           <ChangePassword :token="token"/>
        </div>
    </section>
</template>

<style scoped>

.container {
    width: 100vw;
    height: 100vh;
    background: linear-gradient(#FFFFFF, #8facd362);

    display: flex;
    align-items: center;
    justify-content: center;

}

 

</style>
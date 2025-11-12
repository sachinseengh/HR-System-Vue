<script setup>
import { onMounted, ref } from 'vue';
import useUserStore from '../userStore/UserStore';
import axiosInstance from '../api/AxiosInstance';
import { toast } from 'vue3-toastify';



const totalUser = ref(0);
const totalDepartment =ref(0);
const totalPermission = ref(0);

 async function fetchCheckinCheckout(){
 


    try{
        const response = await axiosInstance.get('/attendence/me/today');

         
 
        if(response.status === 200){
        
             if(response.data){

              
 
                if(response.data.checkin != null){
                    
                    localStorage.setItem("checkin",JSON.stringify(true))
                
                }else{
                     localStorage.setItem("checkin",JSON.stringify(false))
                }
  
                if(response.data.checkout != null){
                    localStorage.setItem("checkout",JSON.stringify(true))
                }else{
                     localStorage.setItem("checkout",JSON.stringify(false))
                }
 
             }
        }

    }catch(err){

        if(err.response){
 
            
            if(err.response.status ==500){
                toast.error("Internal Server Error!");
            }else{
                toast.error("Something Went Wrong !")
            }
        }

    }
}


 



onMounted(async()=>{

    const response = await fetch("http://localhost:7071/dashboard");
    const data = await response.json();

    totalUser.value=data.userCount;
    totalDepartment.value=data.departmentCount;
    totalPermission.value=data.permissionCount;

    fetchCheckinCheckout();
})


const userStore= useUserStore();


</script>


<template>

    <section class="dashboard">

        
 
        <div class="none-admin-section" v-if="!userStore.isAdmin()" >

           
            <p> Welcome to The MOCO HR System</p>
        </div>

        <div class="dashboard-section" v-if="userStore.isAdmin()" >
            <div class="items-grid">
                <div class="users-item card">
                    <p class="title">Users</p>
                    <p class="value">{{ totalUser }}</p>
                </div>
                <div class="departments-item card">
                    <p class="title">Departments</p>
                    <p class="value">{{ totalDepartment }}</p>
                </div>
                <div class="permissions-item card" >
                    <p class="title">Permissions</p>
                    <p class="value">{{ totalPermission }}</p>
                </div>
            </div>
        </div>
         
    </section>

</template>

<style scoped>
.dashboard{
    background-color: #ffffff;
    width: auto;
    padding:2rem 4rem;
}


.items-grid{
    display: grid;
    grid-template-columns: repeat(auto-fit ,minmax(10rem,11rem));
    gap:2rem;
    justify-content: flex-start;

    
    
}

.card{
  background-color: rgb(70, 177, 72);
    color:white;
    padding:1rem;
    text-align: center;
   
    border-radius: 1.2rem;
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    align-items: center;
    position: relative;
    box-sizing: border-box;
     
}

.title{
/* position: absolute;
top: 1rem; */
font-family: Arial, Helvetica, sans-serif;
font-weight: 700;
font-size: 1.7rem;
}
.value{
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 700;
font-size: 2.5rem;
}
</style>
<script setup>
import { onMounted, ref } from 'vue';
import AddPermission from '../components/AddPermission.vue';
import axiosInstance from '../api/AxiosInstance';
import { toast } from 'vue-sonner';
import useUserStore from '@/userStore/UserStore';
 

const showAddPermission = ref(false);
const permissionToEdit=ref(null);


const {userPermission} = useUserStore();

function editPermission(permission){

  if(!userPermission.UPDATE_PERMISSION){
    toast.error("You are not authorized !");
    return;
  }
  
  window.scrollTo({
    top:0,
    behavior:"smooth"
  })

  permissionToEdit.value = permission;

  showAddPermission.value=true;

}


async function deletePermission(permissionId){


   if(!userPermission.DELETE_PERMISSION){
    toast.error("You are not authorized !");
    return;
  }

  try{

    const response = await axiosInstance.delete(`/permission/${permissionId}`)

      toast.success("Permission Deleted Successfully !")
      loadPermission()
    

  }catch(err){

    if(err.response){
      if(err.response.status === 404){
        toast.error("Permission Not Found!")
      }else if(err.response.status === 401){
        toast.error("You are not authorized !");
      }else if(err.response.status === 400){
        toast.error("User have this permission !")
      }
    }

  }

}
 
const permissions = ref([]);

 

async  function loadPermission(){

  console.log(Object.entries(userPermission));

  try{
  const response = await  axiosInstance.get("/permission");

  const data = await response.data;
  permissions.value = data;

  showAddPermission.value=false;

  } catch(err) {
    if(err.response){
      if(err.response.status === 403){
        toast.error("You are not authorized !")
      }
    }
  }
}

onMounted( ()=>{loadPermission()})


function clearEmit(){
  permissionToEdit.value=null;
}

</script>

<template>
  <section class="permissions">

    <div class="permissionAdd" v-if="userPermission.CREATE_PERMISSION">
      <div class="permissionAddBtn">
        <button class="addpermissionBtn" @click="showAddPermission=!showAddPermission">Add permission <i class="fa-solid fa-user-plus"></i>
         </button>
      </div>
    </div>

    <div class="permission-form" v-if="showAddPermission">
      <AddPermission @permission-added="loadPermission" @clear-permission-props="clearEmit" :permission="permissionToEdit"   />
    </div>
    

    <div class="permissions-section">
      <div class="permissions-table">
        <table class="table table-striped table-hover custom-table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Section</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(permission, index) in permissions" :key="index">
              <td>{{ permission.id }}</td>
              <td>{{ permission.section }}</td>
              <td>{{ permission.name}}</td>
              <td> 
                <i class="fa-solid fa-pen-to-square" @click="editPermission(permission)"></i>
                <i class="fa-solid fa-trash" @click="deletePermission(permission.id)"></i>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<style scoped>

.permissionAddBtn{
  margin: 1.5rem 0rem;
}

.addpermissionBtn{
  padding:1rem;
  background-color: rgb(70, 177, 72);
  border: none;
  color: var(--secondary-color);
  font-size: 1rem;
  border-radius: 0.4rem;
}


.permissions-table table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  border-radius: 0.5rem;
  overflow: hidden;
}

.permissions-table th, .permissions-table td {
  padding: 1rem;
  text-align: left;
}

.permissions-table thead {
  background-color: #79b4cf8e;
  font-weight: bold;
}

.permissions-table tbody tr:nth-child(even) {
  background-color: #f1f1f1;
}

.permissions-table tbody tr:hover {
  background-color: #c1e0ff;
}

</style>

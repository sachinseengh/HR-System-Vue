<script setup>
import { onMounted, ref } from 'vue';
import AddDepartment from '../components/AddDepartment.vue';
import axiosInstance from '../api/AxiosInstance';
import { toast } from 'vue3-toastify';

 const departments = ref([]);


const showDepartment = ref(false);

 const departmentToEdit = ref(null);


  function editDepartment(department){

    departmentToEdit.value = department;
    showDepartment.value=true;
  
 }


async function deleteDepartment(departmentId){

  try{


    const response = await axiosInstance.delete(`/department/${departmentId}`)


    if(response.status === 200){

    toast.success("Department Deleted!")


    loadDepartment();

    }


  }catch(err){

    if(err.response){
      if(err.response.status===404){
        toast.error("Department Not Found !");
      }else if(err.response.status ==403){
        toast.error("User assigned to this department")
      }
    }
   

  }
 }

 function clearProps(){
  departmentToEdit.value=null
 }

 async function loadDepartment(){
  const response = await axiosInstance.get("http://localhost:7071/department");
  const data = await response.data;

  departments.value = data;

  showDepartment.value=false;
 }


onMounted( ()=>{loadDepartment()});

</script>

<template>
  <section class="departments">

    <div class="departmentAdd">
      <div class="departmentAddBtn">
        <button class="addDepartmentBtn" @click="showDepartment=!showDepartment">Add Department <i class="fa-solid fa-user-plus"></i>
         </button>
      </div>
    </div>

    <div v-if="showDepartment">
      <AddDepartment  @department-added="loadDepartment" @clear-department="clearProps" :department="departmentToEdit"/>
    </div>
    
    <div class="departments-section">
      <div class="departments-table">
        <table class="table table-striped table-hover custom-table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Actions</th>
               
            </tr>
          </thead>
          <tbody>
            <tr v-for="(department, index) in departments" :key="index">
              <td>{{ department.id }}</td>
              <td>{{ department.name }}</td>
              <td>  <i class="fa-solid fa-pen-to-square" @click="editDepartment(department)"></i>
              <i class="fa-solid fa-trash" @click="deleteDepartment(department.id)"></i></td>
            
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<style scoped>


.departmentAddBtn{
  margin: 1.5rem 0rem;
}

.addDepartmentBtn{
  padding:1rem;
  background-color: rgb(70, 177, 72);
  border: none;
  color: var(--secondary-color);
  font-size: 1rem;
  border-radius: 0.4rem;
}

.departments-table table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  border-radius: 0.5rem;
  overflow: hidden;
}

.departments-table th, .departments-table td {
  padding: 1rem;
  text-align: left;
}

.departments-table thead {
  background-color: #79b4cf8e;
  font-weight: bold;
}

.departments-table tbody tr:nth-child(even) {
  background-color: #f1f1f1;
}

.departments-table tbody tr:hover {
  background-color: #c1e0ff;
}

</style>

<script setup>
import { onMounted, ref } from 'vue';
import AddUsers from '../components/AddUsers.vue';
import axiosInstance from '../api/AxiosInstance';
import useUserStore from '../userStore/UserStore';
import router from '../router';
import { toast } from 'vue-sonner';



const userStore = useUserStore();

const userToEdit = ref(null);

// Your table data
const users = ref([{}]);

const permissions = ref([{}]);



async function getUserAndPermission() {

  const response = await axiosInstance.get("http://localhost:7071/user");

  const data = await response.data;
  users.value = data;

  const PermResponse = await axiosInstance.get("http://localhost:7071/permission");

  const PermData = await PermResponse.data;
  permissions.value = PermData;


}

onMounted(() => { getUserAndPermission() });

const showUserAddingForm = ref(false);


function handleUserAdded() {

  getUserAndPermission();
  showUserAddingForm.value = false;
}

function handleUserUpdated() {
  getUserAndPermission();
  showUserAddingForm.value = false;
}


function handleClearProps() {
  userToEdit.value = null
}


function editUser(user) {


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  })

  userToEdit.value = user;
  showUserAddingForm.value = true;

}

async function deleteUser(userId, userName) {

  try {

    toast.error(`Are you sure want to delete - ${userName}?`, {
      action: {
        label: "Yes",
        onClick: async () => {

          const response = await axiosInstance.delete(`/user/${userId}`)

          if (response.status === 200) {
            toast.success("User Deleted Successfully!");
            getUserAndPermission();
          }
        }
      },
      duration: 3000,
      position: "top-center",
       
    })



  } catch (err) {
    toast.error("Server Error")
  }
}

function viewAttendenceReport(userId) {

  router.push({
    name: 'attendence-report',
    query: { userId }
  })
}

</script>

<template>
  <section class="users">

    <div class="users-section">

      <div class="add-user" v-if="userStore.isAdmin()">
        <div class="createUser">
          <button class="createUserBtn" @click="showUserAddingForm = !showUserAddingForm">Add Employee <i
              class="fa-solid fa-user-plus"></i></button>
        </div>
      </div>

      <div class="add-user-form">
        <div class="user-form" v-if="showUserAddingForm">
          <AddUsers :user="userToEdit" @user-added="handleUserAdded" @user-updated="handleUserUpdated"
            @user-props-cleared="handleClearProps" />

        </div>
      </div>

      <div class="users-table" v-if="userStore.isAdmin()">
        <table class="table table-striped table-hover custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>email</th>
              <th>department</th>
              <th>permission</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in users" :key="index">


              <td>{{ user.id }}</td>
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.department?.name }}</td>
              <td style="display: flex;">

                <div v-for="permission in permissions" :key="permission.id"
                  style="display: flex; column-gap: 0.2rem; margin-right: 0.3rem;">


                  <input type="checkbox" :checked="user.permission?.some(p => p.id === permission.id)" disabled />
                  <p>{{ permission.name?.charAt(0) }}</p>
                </div>


              </td>
              <td class="actions">

                <i class="fa-solid fa-calendar-days" @click="viewAttendenceReport(user.id)"></i>
                <i class="fa-solid fa-pen-to-square" @click="editUser(user)"></i>


                <i class="fa-solid fa-trash-can" @click="deleteUser(user.id, user.name)"
                  v-if="user.id != userStore.userInfo.id"></i>


              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="users-table" v-if="!userStore.isAdmin()">
        <table class="table table-striped table-hover custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>email</th>
              <th>department</th>
              <th>permission</th>
              <th>Attendence</th>

            </tr>
          </thead>
          <tbody>
            <tr>


              <td>{{ userStore.userInfo.id }}</td>
              <td>{{ userStore.userInfo.name }}</td>
              <td>{{ userStore.userInfo.email }}</td>
              <td>{{ userStore.userInfo.department.name }}</td>
              <td style="display: flex;">

                <div v-for="permission in permissions" :key="permission.id"
                  style="display: flex; column-gap: 0.2rem; margin-right: 0.3rem;">


                  <input type="checkbox" :checked="userStore.userInfo.permissions?.some(p => p.id === permission.id)"
                    disabled />
                  <p>{{ permission.name?.charAt(0) }}</p>
                </div>


              </td>
              <td class="actions">

                <router-link to="/attendence"> <i class="fa-solid fa-calendar-days"></i></router-link>

              </td>




            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<style scoped>


 


.users {
  width: 100%;
}


.createUser {
  margin: 2rem 0rem;
}

.createUserBtn {
  padding: 1rem 2rem;
  border-radius: 0.6rem;
  border: none;
  background-color: rgb(70, 177, 72);
  color: white;
  font-size: 1rem;
}



.users-table table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  overflow: hidden;
}

.users-table th,
.users-table td {
  padding: 1rem;
  text-align: left;
}

.users-table thead {
  background-color: #79b4cf8e;
  font-weight: bold;
}

.users-table tbody tr:nth-child(even) {
  background-color: #f1f1f1;
}

.users-table tbody tr:hover {
  background-color: #c1e0ff;
}
</style>

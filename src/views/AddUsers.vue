<script setup>
import axios from 'axios';
import { onMounted, reactive, ref, watch } from 'vue';
import axiosInstance from '../api/AxiosInstance';
import { toast } from 'vue3-toastify';

const userEmit = defineEmits(['user-added'],['user-updated'],['user-props-cleared']);

const selectedPermissionsId = ref([]);
const name = ref('');
const password = ref('');
const email = ref('');
const department = ref(null);

const permissions = ref([]);
const departments = ref([]);


const props = defineProps({

    user: {
        type: Object,
        default: null
    }

});

watch(() => props.user, (newUserToEdit) => {

    if (newUserToEdit) {
        name.value = newUserToEdit.name;

        email.value = newUserToEdit.email;

        department.value = newUserToEdit.department?.id;

        selectedPermissionsId.value = newUserToEdit.permission?.map(p => p.id) || []
    }

}, { immediate: true });

onMounted(async () => {
    const response = await fetch("http://localhost:7071/department");
    const data = await response.json();
    departments.value = data;


    const PermResponse = await fetch("http://localhost:7071/permission");
    const PermData = await PermResponse.json();
    permissions.value = PermData;
})

async function submitForm() {

    if (department.value == null) {
        alert("select department");
        return
    }

    const payload = {
        name: name.value,
        password: password.value,
        email: email.value,
        department: department.value,
        permissions: selectedPermissionsId.value
    }

    try {

        if (props.user) {
            
            const response = await axiosInstance.put(`/user?user_id=${props.user.id}`, payload);
            toast.success("User Updated Successfully")

            userEmit('user-updated');
            cancelForm();

        } else {

            console.log("create user payload : "+ payload.permissions)
 
            const response = await axiosInstance.post("/user", payload)

            toast.success("user added successfully!");

            userEmit('user-added');
            cancelForm();
        }

    } catch (err) {

        if (err.response.status === 409) {
             toast.error("Email already exists")
        }else if(err.response.status === 500){
            toast.error("Server Error")
        }
    }
}

function cancelForm() {

    userEmit('user-props-cleared')

    name.value=''
    email.value=''
     selectedPermissionsId.value=[]
}

</script>

<template>
    <section class="add-user-form">
        <div class="user-form">
            <form  @submit.prevent="submitForm">
                <div class="form-class">
                    <div class="Name item">
                        <P>Name: </P>
                        <input type="text" placeholder="Enter your name !" v-model="name">
                    </div>

                    <div class="Password item">
                        <P>Password: </P>
                        <input type="text" placeholder="Enter password !" v-model="password" :disabled="props.user ? true:false ">
                    </div>
                    <div class="email item">
                        <P>Email: </P>
                        <input type="text" placeholder="Enter Email !" v-model="email" :disabled="props.user ? true:false ">
                    </div>

                    <div class="Department item">
                        <P>Department: </P>
                        <select v-model.number="department">
                            <option :value="null" selected disabled>Select Department</option>
                            <option v-for="dept in departments" :key="dept.id" :value="dept.id">{{ dept.name }}</option>

                        </Select>
                    </div>

                    <div class="Permission item">
                        <p>Permissions:</p>
                        <div class="permission-checkbox" v-for="permission in permissions"
                            style="display: flex; margin-right: 0.2rem; gap:0.2rem">

                            <input type="checkbox" :value="permission.id" v-model="selectedPermissionsId">
                            <p>{{ permission.name?.charAt(0) }}</p>
                        </div>
                    </div>

                </div>

                <div class="submitAndCancelBtn">

                    <div class="cancelBtn btn">
                        <button type="button"  @click="cancelForm">cancel</button>
                    </div>

                    <div class="submitBtn btn">
                        <button type="submit">{{ props.user ? 'Update' : 'Add' }}</button>
                    </div>


                </div>
            </form>
        </div>
    </section>

</template>


<style scoped>
.add-user-form {
    width: 94%;
    padding: 1.2rem 2rem;
    padding-bottom: 0rem;
    border: 1px solid black;
    border-radius: 1rem;
    margin-bottom: 1.4rem;

}

.form-class {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
    gap: 2rem;
}

.item {
    display: flex;
    align-items: center;
    gap: 0.3rem;
}

.item input {
    border: none;
    border-radius: 1rem;
    padding: 0.7rem 1rem;
    outline: none;
}

.item input:focus {
    border-left: 2px solid rgb(73, 166, 197);
    border-right: 2px solid rgb(73, 166, 197);

}

.item select {
    border: none;
    outline: none;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
}

.item select:hover {
    border-left: 2px solid rgb(73, 166, 197);
    border-right: 2px solid rgb(73, 166, 197);
}



.item p {
    flex-basis: 10%;
}

.submitAndCancelBtn {

    margin: 1.5rem 0rem;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    gap: 1rem;
}

.btn button {
    padding: 1rem 2rem;

    border-radius: 1rem;
    background-color: rgb(70, 177, 72);
    outline: none;
    border: none;
    color: white;
}

.cancelBtn button {
    background-color: rgba(255, 0, 0, 0.809);

}
</style>
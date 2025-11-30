<script setup>
import axios from 'axios';
import { onMounted, reactive, ref, watch } from 'vue';
import axiosInstance from '../api/AxiosInstance';
import { toast } from 'vue-sonner';


const userEmit = defineEmits(['user-added'], ['user-updated'], ['user-props-cleared']);

const selectedPermissionsId = ref([]);
const name = ref('');
const password = ref('');
const email = ref('');
const department = ref(null);

const permissions = ref([]);
const departments = ref([]);

const permissionSection = ref([]);

const uploadedImage = ref(null);
const previewImage = ref(null);


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

    try {

        const response = await axiosInstance.get("/department");
        if (response.status === 200) {

            const data = await response.data;
            departments.value = data;

        }

    } catch (err) {

        if (err.response) {
            if (err.response.status === 403) {
                toast.error("Not Authorized!");
            } else if (err.response.status === 401) {
                toast.error("No Token")
            }
        }
    }

    try {

        const PermResponse = await axiosInstance.get("/permission");

        if (PermResponse.status === 200) {

            const PermData = await PermResponse.data;
            permissions.value = PermData;

            permissionSection.value = [...new Set(permissions.value.map(p => p.section))]
        }

    } catch (err) {
        if (err.response) {

            if (err.response.status === 403) {
                toast.error("Not Authorized!");
            } else if (err.response.status === 401) {
                toast.error("No Token")
            }
        }
    }
})

async function submitForm() {


    if (department.value == null) {
        toast.error("select department");
        return
    }


    const payload = new FormData();

    payload.append("name", name.value);
    payload.append("password", password.value);
    payload.append("email", email.value);
    payload.append("department", department.value);
 
selectedPermissionsId.value.forEach(p => payload.append("permissions", p));


    if (uploadedImage.value) {
        payload.append("image", uploadedImage.value);
    }

    // const payload = {
    //     name: name.value,
    //     password: password.value,
    //     email: email.value,
    //     department: department.value,
    //     permissions: selectedPermissionsId.value
    // }


    try {
        if (props.user) {
            try {
                const response = await axiosInstance.put(`/user?user_id=${props.user.id}`, payload);

                if (response.status === 200) {
                    toast.success("User Updated Successfully")
                    userEmit('user-updated');
                    cancelForm();
                }
            } catch (err) {
                if (err.response.status === 403) {
                    toast.error("Not Authroized");
                }
            }
        } else {
            try {

                const response = await axiosInstance.post("/user", payload,{

                    headers:{
                        "Content-Type":"multipart/form-data"
                    }
                })

                if (response.status === 201) {
                    toast.success("user added successfully!");

                    userEmit('user-added');
                    cancelForm();
                }

            } catch (err) {
                if (err.response.status === 403) {
                    toast.error("Not Authroized");
                }
            }
        }

    } catch (err) {
        if (err.response) {

            if (err.response.status === 409) {
                toast.error("Email already exists")
            } else if (err.response.status === 500) {
                toast.error("Server Error")
            }
        }
    }
}

function cancelForm() {

    userEmit('user-props-cleared')

    name.value = ''
    email.value = ''
    selectedPermissionsId.value = []
}

const handleFileChange = (e) => {

    
    
    const file = e.target.files[0];
  

    if(!file) return;
        
    const allowedTypes =["image/jpeg","image/jpg","image/png"];
    const maxSize = 10*1024*1024;

    if(!allowedTypes.includes(file.type)) {

        toast.error("File type not allowed");
     e.target.value="";
        return;
    }

    if(uploadedImage.size > maxSize){
        toast.error("Maximum file size is 10MB");
        file.value = null;
        e.target.value ="";
        return;
    }

    uploadedImage.value = file;
    previewImage.value = URL.createObjectURL(file);

    }
 

</script>

<template>
    <section class="add-user-form">
        <div class="user-form">
            <form @submit.prevent="submitForm">
                <div class="form-class">
                    <div class="Name item">
                        <P>Name: </P>
                        <input type="text" placeholder="Enter your name !" v-model="name">
                    </div>

                    <div class="Password item">
                        <P>Password: </P>
                        <input type="text" placeholder="Enter password !" v-model="password"
                            :disabled="props.user ? true : false">
                    </div>
                    <div class="email item">
                        <P>Email: </P>
                        <input type="text" placeholder="Enter Email !" v-model="email"
                            :disabled="props.user ? true : false">
                    </div>

                    <div class="Department item">
                        <P>Department: </P>
                        <select v-model.number="department">
                            <option :value="null" selected disabled>Select Department</option>
                            <option v-for="dept in departments" :key="dept.id" :value="dept.id">{{ dept.name }}</option>

                        </Select>
                    </div>
                    
                        <div class="image-upload" >
                            <p>Profile image :</p>
                            <input type="file" accept="image/**" @change="handleFileChange" style="width: 50rem;"
                                >
                        </div>
                        <div v-if="previewImage" class="image-preview">
                            <img :src="previewImage" :alt="previewImage.value">
                        </div>
                </div>
                <div class="permission">
                    <p class="permission-title">Permission:</p>
                    <div class="permission-section" v-for="section in permissionSection" :key="section">
                        <p class="section-title">{{ section }}</p>
                        <div class="section-permissions">
                            <label v-for="permission in permissions" v-show="permission.section === section"
                                :key="permission.id" class="permission-checkbox">
                                <input type="checkbox" :value="permission.id" v-model="selectedPermissionsId"
                                    :checked="selectedPermissionsId.some(p => p === permission.id)"  />
                                {{ String(permission.name).toLowerCase() }}
                            </label>
                        </div>
                    </div>
                </div>

                <div class="submitAndCancelBtn">

                    <div class="cancelBtn btn">
                        <button type="button" @click="cancelForm">cancel</button>
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

.permissions-checkbox {
    display: flex;
    flex-direction: row;

}

.permission {
    margin-top: 2rem;
}

.permission-title {
    font-size: 1.5rem;
    margin-bottom: 2rem;
}

.permission-section {
    margin-bottom: 1rem;
}

.section-title {
    font-weight: bold;
    margin-bottom: 0.5rem;
}

.section-permissions {
    display: flex;
    /* make checkboxes horizontal */
    gap: 1rem;
    /* spacing between checkboxes */
    flex-wrap: wrap;
    /* wrap if too many checkboxes */
}

.permission-checkbox {
    display: flex;
    /* checkbox and label inline */
    align-items: center;
    /* vertically center checkbox and text */
    gap: 0.3rem;
}


.image-preview img {
    width: 10rem;
    height: 10rem;
    object-fit:contain;
     border-radius: 50%;
    border: 2px solid #ccc;
    margin-top: 0.5rem;
}
</style>
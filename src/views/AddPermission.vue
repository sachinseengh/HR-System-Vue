<script setup>
import { ref, watch } from 'vue';
import axiosInstance from '../api/AxiosInstance';
import { toast } from 'vue3-toastify';


const emit = defineEmits(['permission-added'],['clear-permission-props'])
const name = ref('')



const editProps = defineProps({
    permission: {
        type: Object,
        default: null
    }
});

watch(() => editProps.permission, (newPermission) => {

    if (newPermission) {

        name.value = newPermission.name
        console.log("new permission");
    }
}, { immediate: true })

async function handleForm() {

    const payload = {
        name: name.value
    }

    try {

        if (editProps.permission) {

            const response = await axiosInstance.put(`/permission?permission_id=${editProps.permission.id}`,payload)
         
            if (response.status === 200) {
                toast.success("Permission Updated!")
                emit('permission-added')
            }

        } else {

            const response = await axiosInstance.post("/permission", payload);

            if (response.status === 200) {
                toast.success("Permission Added!")
                emit('permission-added')
            }
        }


    }
    catch (err) {

        if(err.response){

            if(err.response.status === 404){
                toast.error("Permission not found");
            }

            if(err.response.status===200){
                toast.error("Internal Server Error")
            }
        }
      
    }
}


function cancelForm(){
    name.value=''
    emit("clear-permission-props")

}
</script>

<template>
    <section class="add-department-form">
        <div class="department-form">
            <form action="" @submit.prevent="handleForm">
                <div class="form-class">
                    <div class="Name item">
                        <P>Name: </P>
                        <input type="text" placeholder="Enter new permission name !" v-model="name">
                    </div>



                </div>

                <div class="submitAndCancelBtn">

                    <div class="cancelBtn btn">
                        <button type="button" @click="cancelForm">cancel</button>
                    </div>

                    <div class="submitBtn btn">
                        <button type="submit">{{ editProps.permission?'Update':'Add' }}</button>
                    </div>


                </div>
            </form>
        </div>
    </section>

</template>


<style scoped>
.add-department-form {
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
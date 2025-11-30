<script setup>
import axiosInstance from '@/api/AxiosInstance';
import router from '@/router';
import useUserStore from '@/userStore/UserStore';
import { ref } from 'vue';
import { toast } from 'vue-sonner';


const status = ref('Submit');
const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

const showCurrent = ref(false);
const showNew = ref(false);
const showConfirm = ref(false);

const userStore = useUserStore();


const props = defineProps(
    {
        token: {
            type: String,
            default: null
        },

    }
)

const token = props.token || null;

const handleForm = async () => {

    if (newPassword.value === confirmPassword.value) {

        if (token != null) {

            const payload = {
                emailSignedToken: token,
                password: newPassword.value
            }

            try {
                status.value = "Verifying......"
                const response = await axiosInstance.post("/reset-password", payload);

                if (response.status === 200) {
                    toast.success("Password reset successful!");

                    setTimeout(() => {
                        router.push("/login");
                    }, 1000);
                }

            } catch (err) {
                if (err.response) {
                    if (err.response.status === 404) {
                        toast.error("User not found!")
                    } else {
                        toast.error("Something went Wrong!");
                    }
                }
            } finally {
                status.value = "Submit"
            }
        } else {

            const payload = {
                email: userStore.userInfo.email,
                currentPassword: currentPassword.value,
                newPassword: newPassword.value
            }

            try {
                status.value = "Verifying......"
                const response = await axiosInstance.post("/user/changePassword", payload);

                if (response.status === 200) {
                    toast.success("Password Changed successful!");

                    setTimeout(() => {
                        router.push("/login");
                    }, 1000);
                }

            } catch (err) {

                if (err.response) {
                    if (err.response.status === 404) {
                        toast.error("User not found!")
                    } else if (err.response.status === 400) {
                        toast.error("Incorrect current password");

                    } else {
                        toast.error("Something went Wrong!");
                    }
                }
            } finally {
                status.value = "Submit"
            }

        }
    } else {
        toast.error("New and Confirm Password didn't matched !");

    }

}

 
</script>

<template>
    <section>
        <div class="form-container">
            <div class="form-title">
                Reset Password
            </div>

            <form class="form" @submit.prevent="handleForm">
                <div class="form-fields">

                    <div class="input-wrapper" v-if="!token">
                        <input  :type= "showCurrent?'text':'password'" placeholder="Current Password" v-model="currentPassword"
                            required></input>

                        <i class="fa-solid" :class="showCurrent ? 'fa-eye-slash' : 'fa-eye'"
                            @click="showCurrent = !showCurrent"></i>

                    </div>

                     <div class="input-wrapper">
                        <input  :type= "showNew?'text':'password'" placeholder="New Password" v-model="newPassword"
                            required></input>


                        <i class="fa-solid" :class="showNew ? 'fa-eye-slash' : 'fa-eye'"
                            @click="showNew = !showNew"></i>
                    </div>

                    <div class="input-wrapper">
                        <input  :type= "showConfirm?'text':'password'" placeholder="Confirm Password" v-model="confirmPassword"
                            required></input>

                        <i class="fa-solid" :class="showCurrent ? 'fa-eye-slash' : 'fa-eye'"
                            @click="showConfirm = !showConfirm"></i>
                    </div>
         
                </div>
                <button class="submit-button" type="submit">{{ status }}</button>
            </form>
        </div>
    </section>
</template>

<style scoped>
.form-container {
    margin: auto;
    margin-top: 5rem;
    margin-bottom: 2rem;
    padding: 5rem 3rem !important;
    width: 30rem;
    height: 30rem;
    box-sizing: border-box;
    background: linear-gradient(#FFFFFF, #F4F7FB);
    box-shadow: 5px 5px 15px rgba(33, 158, 211, 0.1);
    border: 5px solid white;
    border-radius: 3rem;
}

.form-title {
    font-size: 2rem;
    text-align: center;
    font-weight: 500;
    color: rgb(15, 98, 137);
}

.form-container {
    padding: 0rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 3rem;
}

.form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.form-fields {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
}

.form-fields input {
    border: none;
    padding: 0 1.5rem;
    height: 3.5rem;
    box-shadow: 5px 5px 15px #CFF0FF;
    border-radius: 0.8rem;
    font-size: 1rem;
}

.form-fields input:focus {
    border: none;
    outline: none;
    border-left: 2px solid rgb(17, 73, 124);
    border-right: 2px solid rgb(17, 73, 124);

}

.submit-button {
    border: none;
    outline: none;
    padding: 0.8rem 1rem;
    border-radius: 0.4rem;
    color: white;
    background-color: rgba(26, 70, 111, 0.781);
    cursor: pointer;
}


.input-wrapper {
  position: relative;
  width: 100%;
}

.input-wrapper input {
  width: 80%;
  padding-right: 40px; /* space for the icon */
}

.input-wrapper i {
  position: absolute;
  top:50%;
  right: 12px;
  transform: translateY(-50%);
  cursor: pointer;
  color: #666;
}

</style>
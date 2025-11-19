<script setup>
import { ref } from 'vue';
import axiosInstance from '../api/AxiosInstance';
import router from '../router';
import { toast } from 'vue3-toastify';
import useUserStore from '../userStore/UserStore';
import Departments from '../views/Departments.vue';
import { jwtDecode } from 'jwt-decode';
import permissionConstant from '../permissionConstant/PermissionConstant'



const userStore = useUserStore();

const email = ref('');
const password = ref('');

const status = ref('Login')


const error = ref(null)


function clearError() {
    error.value = null;
}

async function handleLogin() {

    const payload = {

        email: email.value,
        password: password.value
    }

    if (payload.email === '' || payload.password === '') {
        toast.error("Email and Password Required")
        return;

    } else {

        try {

            status.value = "Verifying...."

            const response = await axiosInstance.post("/login", payload);

            if(response.status === 200) {
            toast.success("Login Success")

            localStorage.setItem("accessToken", response.data.accessToken);
            localStorage.setItem("refreshToken", response.data.refreshToken);


            const decodedToken = jwtDecode(response.data.accessToken);

            console.log("Decoded Token"+decodedToken.permissions);

            userStore.setUser({

                id: decodedToken.id,
                name: decodedToken.name,
                email: decodedToken.email,
                department: decodedToken.department,
                permissions: decodedToken.permissions
            })

            userStore.setUserPermission({
                READ_DASHBOARD: decodedToken.permissions.includes(permissionConstant.READ_DASHBOARD),

                CREATE_USER: decodedToken.permissions.includes(permissionConstant.CREATE_USER),
                READ_USER: decodedToken.permissions.includes(permissionConstant.READ_USER),
                UPDATE_USER: decodedToken.permissions.includes(permissionConstant.UPDATE_USER),
                DELETE_USER: decodedToken.permissions.includes(permissionConstant.DELETE_USER),

                CREATE_DEPARTMENT: decodedToken.permissions.includes(permissionConstant.CREATE_DEPARTMENT),
                READ_DEPARTMENT: decodedToken.permissions.includes(permissionConstant.READ_DEPARTMENT),
                UPDATE_DEPARTMENT: decodedToken.permissions.includes(permissionConstant.UPDATE_DEPARTMENT),
                DELETE_DEPARTMENT: decodedToken.permissions.includes(permissionConstant.DELETE_DEPARTMENT),

                CREATE_PERMISSION: decodedToken.permissions.includes(permissionConstant.CREATE_PERMISSION),
                READ_PERMISSION: decodedToken.permissions.includes(permissionConstant.READ_PERMISSION),
                UPDATE_PERMISSION: decodedToken.permissions.includes(permissionConstant.UPDATE_PERMISSION),
                DELETE_PERMISSION: decodedToken.permissions.includes(permissionConstant.DELETE_PERMISSION),

                READ_ATTENDENCE: decodedToken.permissions.includes(permissionConstant.READ_ATTENDENCE),
                CHECKIN: decodedToken.permissions.includes(permissionConstant.CHECKIN),
                CHECKOUT: decodedToken.permissions.includes(permissionConstant.CHECKOUT),

                READ_ATTENDENCE_REPORT: decodedToken.permissions.includes(permissionConstant.READ_ATTENDENCE_REPORT),

                CAN_VIEW_DASHBOARD_MENU: decodedToken.permissions.some(p => String(p).startsWith("1")),
                CAN_VIEW_USERS_MENU: decodedToken.permissions.some(p => String(p).startsWith("2")),
                CAN_VIEW_DEPARTMENTS_MENU: decodedToken.permissions.some(p => String(p).startsWith("3")),
                CAN_VIEW_PERMISSIONS_MENU: decodedToken.permissions.some(p => String(p).startsWith("4")),
                CAN_VIEW_ATTENDENCE: decodedToken.permissions.some(p => String(p).startsWith("5")),
                CAN_VIEW_ATTENDENCE_REPORT_MENU: decodedToken.permissions.some(p => String(p).startsWith("6")),
            })

            router.push("/dashboard");
            return;

        }

        } catch (err) {

            console.log(err)

            status.value = "failed!"

            if (err.response) {

                if (err.response.status === 401) {
                    toast.error("Invalid credentials");

                } else if (err.response.status === 404) {

                    toast.error("User not found");

                } else {

                    toast.error("Something not found");
                }
            } else {
                toast.error("Server not reached")
            }
        }
    }
}

const showPassword = ref(false);


</script>

<template>

    <div class="container">
        <div class="form-container">
            <div class="form-title">
                <div class="error-class">
                    <p class="error-text">{{ error }}</p>
                </div>
                <p class="title-text">Sign In</p>
            </div>
            <form action="" @submit.prevent="handleLogin">
                <div class="form-content">
                    <div class="email-field">
                        <input type="text" placeholder="Email" v-model="email" @click="clearError">
                    </div>

                    <div class="input-wrapper">
                        <input :type="showPassword ? 'text' : 'password'" placeholder="Password" v-model="password"
                            @click="clearError">

                        <i class="fa-solid" :class="showPassword ? 'fa-eye-slash' : 'fa-eye'"
                            @click="showPassword = !showPassword"></i>
                    </div>

                    <div class="forget-password">
                        <router-link to="/forget-password"> Forget password?</router-link>
                    </div>
                </div>

                <div class="signinBtn">
                    <button class="signIn-btn" type="submit">{{ status }}</button>
                </div>
            </form>

        </div>

    </div>

</template>


<style scoped>
.container {

    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(#FFFFFF, #8facd362);
}

.form-container {

    padding-top: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3rem;
    width: 25rem;
    max-width: 25rem;
    border-radius: 3rem;
    border: 3px solid white;
    height: 30rem;
    box-sizing: border-box;
    background: linear-gradient(#FFFFFF, #F4F7FB);
    box-shadow: 5px 5px 15px rgba(33, 158, 211, 0.1);
}


.form-title {

    width: 100%;
    text-align: center;
}

.title-text {
    color: #1089D3;
    font-size: 2rem;
    font-weight: 700;
}

form input {
    border: none;
    /* color: white; */
    width: 16.2rem;
    height: 3.5rem;
    font-size: var(--font-size);
    box-shadow: 5px 5px 15px #CFF0FF;
    border-radius: 1.5rem;
    margin-bottom: 1.3rem;
    padding-left: 2rem;
}


form input:focus {
    border: none;
    outline: none;
    border-left: 0.1rem solid #0099FF;
    border-right: 0.1rem solid #0099FF;

}

.forget-password a {
    color: #0099FF;
}

.signinBtn {

    margin-top: 1.5rem;
    width: 100%;

    text-align: center;
}

.signIn-btn {

    cursor: pointer;
    width: 100%;
    border-radius: 1.5rem;
    border: none;
    padding: 1rem 2rem;
    color: var(--secondary-color);
    background: linear-gradient(to top right, #1089D3, #12B1D1);
}


.error-class {
    margin: 0.5rem 0.2rem;
}

.error-text {
    color: red;
    text-align: center;
}


.input-wrapper {
    position: relative;
}

.input-wrapper i {
    position: absolute;
    top: 30%;
    opacity: 0.7;
    right: 1rem;
    cursor: pointer;
}
</style>
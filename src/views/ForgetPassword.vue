<script setup>
import axiosInstance from '@/api/AxiosInstance';
import router from '@/router';
import { ref } from 'vue';
import { toast } from 'vue3-toastify';

const email = ref('');
const status= ref("Submit");

const submitMail = async () => {

    const payload = {
        email: email.value.toLowerCase()
    }

    try {

        status.value = "Sending Mail..";
        const response = await axiosInstance.post("/forget-password", payload);

        if (response.status === 200) {
            toast.success("Check you email!");

            setTimeout(()=> {
            router.push("/login");
            },1500);

        }

    } catch (err) {
        
        if (err.response) {
            if(err.response.status === 404) {
                toast.error("User not found!");
            } else {
                toast.error("Something went wrong!");
            }
        }
    } finally {
        status.value = "Submit";
    }
}
 
</script>

<template>

    <section class="forget-password">
        <div class="container">

            <div class="form-container">

                 <div class="form-title">
                        <p>Forget Password</p>
                    </div>
                     

                <form @submit.prevent="submitMail">

                    <div class="info">
                         <p>Enter your valid email to get reset link</p>
                    </div>
                  
                    <div class="form-content">
                        <div class="email-field">
                            <input type="email" placeholder="Enter your email" v-model="email" required>
                        </div>
                    </div>
                    <div class="submit-btn">
                        <button>{{ status }}</button>
                    </div>
                </form>

            </div>
        </div>
    </section>


</template>



<style scoped>
.forget-password{

    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    
    background: linear-gradient(#FFFFFF, #8facd362);
}

.form-container{
    padding:2rem 1rem;
    width:25rem;
    height: 20rem;
    max-width: 25rem;
    background: linear-gradient(#FFFFFF, #F4F7FB);
    box-sizing: border-box;
    border: 3px solid white;
    border-radius: 3rem;
    box-shadow: 5px 5px 15px rgba(33, 158, 211, 0.1);

    display: flex;
    flex-direction: column;
    gap:2rem;
    align-items: center;
}

.form-title p{

    font-size: 1.5rem;
    color: rgba(25, 132, 161, 0.995);
    font-weight: 550;

    text-align: center;
}

form{
    display: flex;
    flex-direction: column;
    gap:1.2rem;
}



form input{
    border: none;
    height: 3.5rem;
    width: 16.2rem;
    background-color: rgb(24, 68, 92,0.2);
    /* color:white; */
    box-shadow: 5px 5px 15px 2px #CFF0FF;
    border-radius: 0.5rem;
    padding-left: 2rem ;
    font-size: var(--font-size); 
}

input:focus {
    outline: none;
    border: none;
    border-left:2px solid rgba(30, 78, 119, 0.67);
    border-right:2px solid rgb(30, 78, 119,0.67);
}

.submit-btn{
    width: 100%;
}

.submit-btn button{
    width: 100%;
    border:none;
    outline:none;
    background-color: rgb(24, 68, 92);
    padding:0.7rem 0.5rem;
    border-radius: 0.5rem;
    color:white;
}

.info p{
    font-size: var(--font-size);
    text-align: center;
}
 


 




</style>




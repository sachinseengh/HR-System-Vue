<script setup>
import { onMounted, onUnmounted, onUpdated, ref, watch } from 'vue';
import AttendenceReport from './AttendenceReport.vue';
import { toast } from 'vue3-toastify';
import axiosInstance from '../api/AxiosInstance';
import useUserStore from '../userStore/UserStore';


const date = ref('');
let interval = null;

const user = useUserStore();

const reload = ref(0);

const alreadyCheckedin = ref(false);
const alreadyCheckedout = ref(false);


onMounted(() => {

    if (JSON.parse(localStorage.getItem("checkin")) === true) alreadyCheckedin.value = true;
    if (JSON.parse(localStorage.getItem("checkout")) === true) alreadyCheckedout.value = true;

    const updateTime = () => {


        const todaysDate = new Date();

        const dateIso = new Date(todaysDate.getTime() - todaysDate.getTimezoneOffset() * 60000).toISOString().slice(0, -1);


        date.value = dateIso.replace("T", " ").slice(0, 19);


    }

    updateTime();
    interval = setInterval(updateTime, 1000)


})

onUnmounted(() => {
    if (interval) clearInterval(interval);
});


async function checkin() {


    console.log("chekingclicked")
    try {

        const response = await axiosInstance.post("/attendence/checkin");

        if (response.status == 200) {
            toast.success("Checkin Successful");
            localStorage.setItem("checkin", JSON.stringify(true));
            alreadyCheckedin.value = true;
            reload.value++;
        }


    } catch (err) {

        if (err.response) {
            if (err.response.status == 500) toast.error("Internal Server Error");
            if (err.response.status == 409) toast.error("Already Checked in");
        }
    }

}

async function checkout() {


    try {

        const response = await axiosInstance.post("/attendence/checkout");

        if (response.status == 200) {

            toast.success("Checkout Successful !")
            localStorage.setItem("checkout", JSON.stringify(true));
            alreadyCheckedout.value = true;
            reload.value++;

        };

    } catch (err) {
        if (err.response) {

            if (err.response.status == 500) toast.error("Internal Server Error !");
            if (err.response.status == 409) toast.error("Already Checked out !")
        }
    }

}


</script>

<template>

    <section class="attendence">
        <div class="attendence-class">
            <div class="attendence">
                <div class="date">
                    <p>Current Date & Time : {{ date }}</p>
                </div>

                <div class="attendence-parts">
                    <div class="checkin-checkout">
                        <div class="checkin">
                            <button type="button" @click="checkin" v-if="!alreadyCheckedin">Checkin</button>
                        </div>
                        <div v-if="alreadyCheckedin && alreadyCheckedout">
                            <p>Checkin and Checkout done for today !
                            </p>
                        </div>
                        <div class="checkout">
                            <button type="button" @click="checkout" v-if="!alreadyCheckedout">Checkout</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="user-attendence-table">

            <AttendenceReport v-if="user.userInfo.id" :userId="user.userInfo.id" :key="reload" />

        </div>

    </section>

</template>


<style scoped>
.date p {
    font-size: 1rem;
    font-weight: lighter;
    text-align: right;

    padding-right: 1rem;
}

.attendence-parts {

    margin-top: 5rem;
}

.checkin-checkout {

    display: flex;
    align-items: center;
    justify-content: space-evenly;
}

.checkin button {

    color: white;
    font-size: 2rem;
    border: none;
    padding: 1rem 5rem;
    background-color: #47A93E;

    border-radius: 0.7rem;
}

.checkout button {

    color: white;
    font-size: 2rem;
    border: none;
    padding: 1rem 5rem;
    background-color: #EF3535;

    border-radius: 0.7rem;
}

.checkin button:disabled {
    opacity: 0.4;
    cursor: not-allowed;

}

.checkout button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.user-attendence-table {
    margin-top: 3.5rem;
}

@media(max-width:640px) {
    .checkin-checkout {
        justify-content: space-between;

    }

    .attendence {
        margin: 0 2rem;
    }

    .user-attendence-table {
        margin-top: 5rem;
    }
}
</style>
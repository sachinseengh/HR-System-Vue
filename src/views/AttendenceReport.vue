<script setup>
import { computed, onMounted, reactive, ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import axiosInstance from '../api/AxiosInstance';
import { toast } from 'vue3-toastify';
import { VueDatePicker } from '@vuepic/vue-datepicker';


const route = useRoute();


const userProps = defineProps({
    userId: {
        type: [Number, String],
        default: null
    }
})

const tableTitle = ref("Attendence Report");

const tableData = ref([])


const currentUserId = ref(userProps.userId || route.query.userId || null);


const todaysDate = ref(null);
const date = new Date();
todaysDate.value = date.toISOString().slice(0, 10);


async function fetchCurrentTableData() {

    if (currentUserId.value) {
        try {
            const response = await axiosInstance.get(`/attendence/user?userId=${currentUserId.value}`);

            if (response.status === 200) {
                tableData.value = response.data;
            }

        } catch (err) {
            if (err.response) {
                if (err.response.status == 500) {
                    toast.error("Internal Server Error !");
                } else {
                    toast.error("Something went wrong!")
                }
            }
        }

    } else {

        try {
            const response = await axiosInstance.get(`/attendence?date=${todaysDate.value}`);

            if (response.status === 200) {
                tableData.value = response.data;
            }

        } catch (err) {
            if (err.response) {
                if (err.response.status == 500) {
                    toast.error("Internal Server Error !");
                } else {
                    toast.error("Something went wrong!")
                }
            }
        }
    }

}

onMounted(() => fetchCurrentTableData())

const showDatePicker = ref(false)
const selectedDate = ref(new Date())

function makeCurrentUserNull() {

    currentUserId.value = null;
    fetchCurrentTableData();
    
    showDatePicker.value = !showDatePicker;

}

function fetchDataByDate() {
   todaysDate.value =  new Date(selectedDate.value).toISOString().slice(0,10);
   fetchCurrentTableData();
 
}

</script>

<template>

    <section class="attendence-report">

        <div class="attendence-report-table">
            <div class="table-info">
                <div class="attendence-report-title">
                    <p style="text-align: left;">{{ tableTitle }}</p>
                    <p style="text-align: left;">{{ currentUserId ? 'UserId : ' : 'Date : ' }}{{
                        currentUserId ? currentUserId : todaysDate }}</p>
                </div>

                <div class="cancelUserPropsBtn">

                    <div class="cancelBtn" v-if="currentUserId && !userProps.userId">
                        <button type="button" @click="makeCurrentUserNull">Switch to Date</button>

                    </div>

                    <div class="datePicker" v-if="!currentUserId && !userProps.userId">

                        <VueDatePicker v-model="selectedDate" :enable-time-picker="false" :time-picker="false"
                            :is24="false" :show-time="false" format="yyyy-MM-dd"
                            @update:model-value="fetchDataByDate" />



                    </div>
                </div>
            </div>

            <div class="attendence ">

                <table class="table table-striped table-hover custom-table">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>UserId</th>
                            <th>Name</th>
                            <th>Checkin</th>
                            <th>Checkout</th>
                            <th>Working Hour</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="attendence in tableData">

                            <td>{{ attendence.id }}</td>
                            <td>{{ attendence.user.id }}</td>
                            <td>{{ attendence.user.name }}</td>
                            <td>{{ attendence.checkin }}</td>
                            <td>{{ attendence.checkout }}</td>
                            <td>{{ attendence.workingHour }} hr</td>
                        </tr>

                    </tbody>
                </table>
            </div>
        </div>
    </section>
</template>


<style scoped>
.attendence-report {
    margin-right: 1rem;
    min-height: 50rem;
}

.attendence {
    margin-top: 2rem;


}

.attendence table {
    width: 100%;
    border-collapse: collapse;
    background-color: #fff;

    border-radius: 0.5rem;
    overflow: hidden;

}

.attendence th,
.attendence td {
    padding: 1rem;
    text-align: left;
}

.attendence thead {
    background-color: #79b4cf8e;
}

.attendence tr:nth-child(even) {
    background-color: #f1f1f1;
}


.attendence tbody tr:hover {
    background-color: #c1e0ff;
}

.table-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.cancelUserPropsBtn .cancelBtn button {
    background-color: red;
    border: none;
    color: white;
    padding: 0.5rem 1rem;

    border-radius: 0.5rem;
}
</style>
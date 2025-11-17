import axios from "axios";
import router from "../router";
import { toast } from "vue3-toastify";


const axiosInstance = axios.create({

    baseURL:"http://localhost:7071",
    headers:{
        "Content-Type":"application/json",

    },
    timeout:10000
})


axiosInstance.interceptors.request.use(

    (config)=>{

    const publicEndpoints = ['/login','forget-password','reset-password'];

    const isPublic = publicEndpoints.some((endpoints)=>
    config.url.includes(endpoints));

    if(isPublic){
        return config;
    }
        const token = localStorage.getItem("accessToken");

        if(!token){
            router.push('/login')
            return Promise.reject(new Error("No Token"));
        }

        if(token){
            config.headers.Authorization=`Bearer ${token}`;
        }
        return config;
    },

    (error)=> Promise.reject(error)

)

axiosInstance.interceptors.response.use(

    (response) => response,

    (error) => {

        if(error.response && error.response.status === 401){


            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            router.push("/login");
        }
        return Promise.reject(error)
    }
)

export default axiosInstance;
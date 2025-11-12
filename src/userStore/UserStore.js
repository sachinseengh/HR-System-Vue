import { defineStore } from "pinia";
import { ref } from "vue";



const useUserStore = defineStore('user', () => {

    const userInfo = ref({
        id: "",
        name: "",
        email: "",
        department: {},
        permissions: [{}]

    })

    const checkin=ref(false);
    const checkout=ref(false);


    //not strictly but useful for realtime update

    function setUser(userData) {
        userInfo.value = userData
    }

    function isAdmin() {

        const permission = userInfo.value.permissions || [{}];
        
        return permission.some(p => p.name === "READ") &&
            permission.some(p => p.name === "CREATE") &&
             permission.some(p => p.name === "EDIT") &&
              permission.some(p => p.name === "DELETE");
    }


function loadUser() {
        const savedUser = localStorage.getItem("user")
        if (savedUser) {
            userInfo.value= JSON.parse(savedUser);
 
        }
    }


function logout() {
        userInfo.value = { id: "", name: "", email: "", department: null, Permissions: [] }
    }


return { userInfo, setUser, loadUser, logout, isAdmin,checkin,checkout }
})

export default useUserStore;
import permissionConstant from "@/permissionConstant/PermissionConstant";
import { jwtDecode } from "jwt-decode";
import { defineStore } from "pinia";
import { ref } from "vue";

const useUserStore = defineStore('user', () => {
  // -----------------------
  // Reactive state
  // -----------------------
  const userInfo = ref({
    id: "",
    name: "",
    email: "",
    department: {},
    permissions: [],
    profileImageURL:""
  });

  const userPermission = ref({
    READ_DASHBOARD: false,
    CREATE_USER: false,
    READ_USER: false,
    UPDATE_USER: false,
    DELETE_USER: false,
    CREATE_DEPARTMENT: false,
    READ_DEPARTMENT: false,
    UPDATE_DEPARTMENT: false,
    DELETE_DEPARTMENT: false,
    CREATE_PERMISSION: false,
    READ_PERMISSION: false,
    UPDATE_PERMISSION: false,
    DELETE_PERMISSION: false,
    READ_ATTENDENCE: false,
    CHECKIN: false,
    CHECKOUT: false,
    READ_ATTENDENCE_REPORT: false,

    CAN_VIEW_DASHBOARD_MENU: false,
    CAN_VIEW_USERS_MENU: false,
    CAN_VIEW_DEPARTMENTS_MENU: false,
    CAN_VIEW_PERMISSIONS_MENU: false,
    CAN_VIEW_ATTENDENCE: false,
    CAN_VIEW_ATTENDENCE_REPORT_MENU: false,
  });

  const checkin = ref(false);
  const checkout = ref(false);

  // -----------------------
  // Methods
  // -----------------------

  // Set user info manually
  function setUser(userData) {
    userInfo.value = userData;
  }

  // Load user info from JWT token
  function loadUser() {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      userInfo.value = {
        id: decoded.id || "",
        name: decoded.name || "",
        email: decoded.email || "",
        department: decoded.department || {},
        permissions: decoded.permissions || [],
        profileImageURL:decoded.profileImageURL
      };
    } catch (err) {
      console.error("Error decoding token in loadUser:", err);
    }
  }

  // Set permissions manually
  function setUserPermission(updatedPermission) {
    userPermission.value = updatedPermission;
  }

  // Load permissions from JWT token
  function loadUserPermission() {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const permissions = decoded.permissions || [];

      userPermission.value = {
        READ_DASHBOARD: permissions.includes(permissionConstant.READ_DASHBOARD),
        CREATE_USER: permissions.includes(permissionConstant.CREATE_USER),
        READ_USER: permissions.includes(permissionConstant.READ_USER),
        UPDATE_USER: permissions.includes(permissionConstant.UPDATE_USER),
        DELETE_USER: permissions.includes(permissionConstant.DELETE_USER),

        CREATE_DEPARTMENT: permissions.includes(permissionConstant.CREATE_DEPARTMENT),
        READ_DEPARTMENT: permissions.includes(permissionConstant.READ_DEPARTMENT),
        UPDATE_DEPARTMENT: permissions.includes(permissionConstant.UPDATE_DEPARTMENT),
        DELETE_DEPARTMENT: permissions.includes(permissionConstant.DELETE_DEPARTMENT),

        CREATE_PERMISSION: permissions.includes(permissionConstant.CREATE_PERMISSION),
        READ_PERMISSION: permissions.includes(permissionConstant.READ_PERMISSION),
        UPDATE_PERMISSION: permissions.includes(permissionConstant.UPDATE_PERMISSION),
        DELETE_PERMISSION: permissions.includes(permissionConstant.DELETE_PERMISSION),

        READ_ATTENDENCE: permissions.includes(permissionConstant.READ_ATTENDENCE),
        CHECKIN: permissions.includes(permissionConstant.CHECKIN),
        CHECKOUT: permissions.includes(permissionConstant.CHECKOUT),

        READ_ATTENDENCE_REPORT: permissions.includes(permissionConstant.READ_ATTENDENCE_REPORT),

        CAN_VIEW_DASHBOARD_MENU: permissions.some(p => String(p).startsWith("1")),
        CAN_VIEW_USERS_MENU: permissions.some(p => String(p).startsWith("2")),
        CAN_VIEW_DEPARTMENTS_MENU: permissions.some(p => String(p).startsWith("3")),
        CAN_VIEW_PERMISSIONS_MENU: permissions.some(p => String(p).startsWith("4")),
        CAN_VIEW_ATTENDENCE: permissions.some(p => String(p).startsWith("5")),
        CAN_VIEW_ATTENDENCE_REPORT_MENU: permissions.some(p => String(p).startsWith("6")),
      };
    } catch (err) {
      console.error("Error decoding token in loadUserPermission:", err);
    }
  }

  // Logout
  function logout() {
    localStorage.removeItem("accessToken");
    userInfo.value = { id: "", name: "", email: "", department: {}, permissions: [] };
    // Reset permissions
    Object.keys(userPermission.value).forEach(key => userPermission.value[key] = false);
  }

  // -----------------------
  // Return state and methods
  // -----------------------
  return { 
    userInfo, 
    userPermission, 
    setUser, 
    loadUser, 
    setUserPermission, 
    loadUserPermission, 
    logout, 
    checkin, 
    checkout 
  };
});

export default useUserStore;

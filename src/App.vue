<script setup>

import { Toaster, toast } from 'vue-sonner'
import 'vue-sonner/style.css'

 
 
</script>

<template>
     
<Toaster position="top-right" closeButton="true" closeButtonPosition="top-right" :expand="true" :duration="1000"/>
<router-view></router-view>
 
</template>


<style scoped>

 

</style>
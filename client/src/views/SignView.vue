<script setup lang="ts">
  import SignUp from '@/components/SignUp.vue';
  import LogIn from '@/components/LogIn.vue';
  import { ref } from 'vue';
  import buttonComponent from '@/components/UI/buttonComponent.vue';

const isRegister = ref(false)

</script>


<template>
 <div class="auth">
  <div class="auth-buttons">
    <buttonComponent class="signin" @click="isRegister=true" :class="isRegister ? 'active' : ''">Sign Up</buttonComponent>
    <buttonComponent class="login" @click="isRegister=false" :class="!isRegister ? 'active' : ''">Log In</buttonComponent>
  </div>
  <div class="auth-window">
    <SignUp v-if="isRegister"/>
    <LogIn v-else />
  </div>
    
 </div>
</template>

<style scoped>
.auth{
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items:center;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}

.auth-buttons{
  display: flex;
  gap: 20px;

}



</style>

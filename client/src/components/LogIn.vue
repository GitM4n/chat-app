<script setup lang="ts">
import {ref} from 'vue'
import type {LoginPayload} from '@/interfaces'
import {useUser} from '@/composables/useUser.global'
import inputComponent from '@/components/UI/inputComponent.vue';
import buttonComponent from '@/components/UI/buttonComponent.vue';

const user = useUser()


const errors = ref({
  email: '',
  password: ''
})
const logindata = ref<LoginPayload>({
  email: '',
  password: ''
})


const validateEmail = (email:string): boolean => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email.trim());
}

const validatePass = (str: string): boolean => {
  return !!(str.length > 5)
}


const validate = () => {
  return  validateEmail(logindata.value.email) && validatePass(logindata.value.password)
}


const login = async () =>{
 try {
  errors.value.email = ''
  errors.value.password = ''

  if(!validate()){
      if(!validateEmail(logindata.value.email)) errors.value.email = 'Недопустимый формат почты'
      if(!validatePass(logindata.value.password)) errors.value.password = 'Пароль должен быть больше 5 знаков'
      return
    }
    
    
  const error = await user.login(logindata.value)
  if(error) errors.value.email = error
  
 } catch (error) {
    throw error
 }
}







</script>


<template>
  <div class="form">
    <form action="#" @submit.prevent class="form__inner" :class="errors.email || errors.password ? 'error' : ''">
       <h1 class="login__text">Войти в чат</h1>
       <div class="username">
              <inputComponent 
                v-model="logindata.email"
                :error-message="errors.email"
                :placeholder="'Ваша почта'"
                /> 
              <inputComponent 
                v-model="logindata.password"
                :error-message="errors.password"
                :placeholder="'Ваш пароль от 5 знаков'"
                />   
       </div>
       <buttonComponent type="submit" @click="login" class="joinBtn">Отправить</buttonComponent>
    </form>
</div>
</template>


<style scoped>

.form{
  display: flex;
  place-items: center;

  
}




.form__inner{
  border: 2px solid var(--light);
  border-radius: 6px;
  padding: 30px 20px;
  transition: border-color 0.3s ease;
}


.form__inner.error{
  border-color: var(--red);
}


.login__text{
  text-align: center;
  color: var(--light);
}

.form__inner,
.username{
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>

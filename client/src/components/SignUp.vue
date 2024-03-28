<script setup lang="ts">
import {ref} from 'vue'
import type {RegisterPayload} from '@/interfaces'
import {useUser} from '@/composables/useUser.global'
import inputComponent from '@/components/UI/inputComponent.vue';
import buttonComponent from '@/components/UI/buttonComponent.vue';

const user = useUser()


const errors = ref({
  name: '',
  email: '',
  password: ''
})
const registerData = ref<RegisterPayload>({
  name: '',
  email: '',
  password: ''
})

const validateUsername = (str: string): boolean => {
  const regexp = /^[.{3,}a-zA-Z\s]+$/;
  return regexp.test(str.trim());
  
}

const validateEmail = (email:string): boolean => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email.trim());
}

const validatePass = (str: string): boolean => {
  return !!(str.length > 5)
}


const validate = () => {
  return validateUsername(registerData.value.name) && validateEmail(registerData.value.email) && validatePass(registerData.value.password)
}


const register = async () =>{
 try {
  errors.value.email = ''
  errors.value.name = ''
  errors.value.password = ''

  if(!validate()){
      if(!validateUsername(registerData.value.name)) errors.value.name = 'Только буквы и пробелы от 3 знаков'
      if(!validateEmail(registerData.value.email)) errors.value.email = 'Недопустимый формат почты'
      if(!validatePass(registerData.value.password)) errors.value.password = 'Пароль должен быть больше 5 знаков'
      return
    }
    
    
   const error = await user.register(registerData.value)
   if(error) errors.value.email = error
  
 } catch (error) {
    throw error
 }
}







</script>


<template>
  <div class="form">
    <form action="#" @submit.prevent class="form__inner" :class="errors.email || errors.password ? 'error' : ''">
      <h1 class="register__text">Регистрация</h1>
      <div class="username">
            <inputComponent 
                v-model="registerData.name"
                :error-message="errors.name"
                :placeholder="'Ваше имя от 3 знаков'"
                />
              <inputComponent 
                v-model="registerData.email"
                :error-message="errors.email"
                :placeholder="'Ваша почта'"
                /> 
              <inputComponent 
                v-model="registerData.password"
                :error-message="errors.password"
                :placeholder="'Ваш пароль от 5 знаков'"
                />   
       </div>
       <buttonComponent type="submit" @click="register" class="joinBtn">Отправить</buttonComponent>
    </form>
</div>
</template>

<style scoped>
.form{
  display: flex;
  justify-content: center;
  
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


.register__text{
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
<script setup lang="ts">
import { useUser } from '@/composables/useUser.global';
import type { IUser } from '@/interfaces';
import {ref} from 'vue'
import { supabase } from '@/supabaseClient';
import inputComponent from '@/components/UI/inputComponent.vue';
import buttonComponent from '@/components/UI/buttonComponent.vue';

const userService = useUser()
const user = userService.userData
const userAvatar = ref<string | undefined>(user.value?.avatar)
const file = ref<File | null>(null)


const userData = ref({
    name: user.value?.name,
    avatar: user.value?.avatar,
    birthdate: user.value?.birthdate,
    age: user.value?.age,
    

} as IUser)


const errors = ref({
    name: '',
    birthdate: '',
})



const clickInput = () => {
    const avatar = document.getElementById('avatar') as HTMLInputElement
    avatar.click()

}

const changeAvatar = async (input:HTMLInputElement) => {
    if(!input.files) return

    file.value = input.files[0]
    const reader = new FileReader()

    reader.onload = () => {
        userAvatar.value = reader.result as string
    }
    reader.readAsDataURL(file.value)

}


const updateData = async () => {
    userAvatar.value = user.value?.avatar

    if(file.value){
        const {data, error} = await supabase.storage.from('user-avatars').upload(file.value.name, file.value, {
            upsert:true,
        })
        if(error) throw(error)
        userAvatar.value = 'https://gajgokwxsvxagcsbeguz.supabase.co/storage/v1/object/public/user-avatars/' + data.path
        
      
    
    }

    if(!validateDate()) {
        errors.value.birthdate = 'Недопустимый формат даты'
        return
    }
  
    await userService.updateUser({avatar: userAvatar.value})

}



const validateDate = () => {

    if(!userData.value.birthdate) return false

    const parts = userData.value.birthdate.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; 
    const year = parseInt(parts[2], 10);

    const date = new Date(year, month, day);
    return date.getDate() === day && date.getMonth() === month && date.getFullYear() === year;


    
}




</script>

<template>
    <div class="settings">
        <div class="settings__inner">
           <form action="#" class="user-form">
            <legend class="form__title">Данные пользователя</legend>
                <div class="user-form__inner">
                    <div class="user-form__avatar" @click="clickInput()">
                        <img :src="userAvatar" alt="user-avatar" />
                        <input type="file" name="avatar" id="avatar" accept=".jpg, .jpeg, .png" @change="changeAvatar($event.target as HTMLInputElement)">
                        <span class="change">Изменить</span>
                    </div>
                    <div class="user-form__data-inputs">
                        <div class="user-form__name">
                            <p>Ваше имя</p>
                            <inputComponent :id="'name'" 
                            v-model="userData.name" 
                            :placeholder="'Ваше имя'" />
                        </div>
                        <div class="user-form__date">
                            <p>День рождения</p>
                            <inputComponent :id="'date'" 
                            :maxLength="'8'" 
                            v-model="userData.birthdate" 
                            :placeholder="'Ваша дата рождения'" 
                            :dataType="'date'" 
                            :errorMessage="errors.birthdate"/>
                           
                        </div>
                    </div>
                    <div class="user-form__age">
                        <p>Ваш возраст: {{userData.age ? userData.age : 'Не указан'}}</p>
                    </div>
                </div>
                <buttonComponent type="submit" @click="validateDate" class="update">Сохранить</buttonComponent>
           </form>
             
        </div>
    </div>
</template>

<style scoped>
input[type="file"]{
    all: unset;
    width: 0.1px;
    height: 0.1px;
}



.settings__inner{
    height: 100%;
    display: flex;
    justify-content: center;
}

.user-form{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 20px 30px;
    border: 2px solid var(--green);
    border-radius: 5px;
    min-width: 250px;
    flex: 0 1 30%;
}

.form__title{
    color: var(--green);
    font-size: 24px;
}

.user-form__inner{
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
}

.user-form__avatar{
    overflow: hidden;
    position: relative;
    width: 80px;
    height: 80px;
    cursor: pointer;
    border-radius: 50%;
    border: 3px solid var(--green);
}

.user-form__avatar img{
    width: 100%;
    height: 100%;
}


.change{
    opacity: 0;
    position: absolute;
    padding-bottom: 5px;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    background-color: var(--gray);
    font-size: 12px;
    transition: opacity 0.3s ease;
}

.user-form__avatar:hover .change{
    opacity: 1;
}

.user-form__data-inputs{
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.user-form__data-inputs p {
    font-style: italic;
}

</style>
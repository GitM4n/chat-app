<script setup lang="ts">
import type {IUser, IChat} from '@/interfaces'
import {computed} from 'vue'
import { useGetAllUsers } from '@/composables/useGetAllUsers';


const props = defineProps<{
    user?:IUser,
    chat?:IChat
}>()


const receiver = computed(()=>{
    return useGetAllUsers().allUsers.value?.find(user => user.id === props.user?.id)
})




</script>

<template>
    <div class="chat-card" :class="props.user ? props.user.name : ''" >
        <div class="chat-card__inner">
            <div class="chat-card__avatar" :class="receiver?.online_status ? 'online' : 'offline'">
                <img :src="props.user?.avatar" alt="avatar">
            </div>
            <div class="chat-card__name">
                {{props.user?.name}}
            </div>
        </div>
    </div>
</template>

<style scoped>

.chat-card{
    border-radius: 5px;
    border: 1px solid var(--gray);
    /* From https://css.glass */
    background: rgba(var(--gray-rgb), 0.3);
    box-shadow: 0 4px 30px rgba(var(--dark-rgb), 0.1);
    backdrop-filter: blur(5.6px);
    -webkit-backdrop-filter: blur(5.6px);
  
             
}

.chat-card.active{
    border-color: var(--green);
}

.chat-card__inner{
    display: flex;
    gap: 10px;
    padding: 5px 20px;
   

}

.chat-card__avatar{
    position: relative;
    width: 40px;
    height: 40px;
}

.chat-card__avatar.online::before{
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background-color: var(--green);
}

.chat-card__avatar img{
    width: 100%;
    height: 100%;
    border-radius: 50%;
}
</style>
<script setup lang="ts">
import { onMounted, onBeforeUnmount,shallowRef } from 'vue';
import {socket} from '../socket'
import {useUser} from '../composables/useUser.global'
import { useGetAllUsers } from '@/composables/useGetAllUsers';

const user = useUser().userData

const isLoad = shallowRef<Boolean>(false)


socket.on('user-status-online', async()=>{
    await useUser().updateUser({online_status:true})
    await useGetAllUsers().getAllUsers()
    setTimeout(async()=>{
        await useUser().updateUser({online_status:false})
    }, 800)
})

socket.on('user-status-offline', async()=>{
    await useGetAllUsers().getAllUsers()
   
})



onMounted(async() => { 
    await useGetAllUsers().getAllUsers()
    await useGetAllUsers().getFriends()
    socket.connect()
    socket.auth = {  
    username:user.value?.name,
    user_id:user.value?.id
    };

    await useGetAllUsers().acceptedFriends()

    isLoad.value = true
})

onBeforeUnmount(async ()=>{
    socket.disconnect()
})
</script>

<template>
    <div class="chat-root" style="height: 100%;" v-if="isLoad">
        <router-view></router-view>
    </div>
    <transition name="fade" v-else>
        <div class="load-spinner">
            <span class="loader"></span>
        </div>
    </transition>
   
</template>

<style scoped>

.chat-root > * {
    height: 100%;
}


.load-spinner{
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--green);
}

.loader {
    width: 48px;
    height: 48px;
    border: 5px solid var(--light);
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    position: relative;
    animation: pulse 1s linear infinite;
  }
  .loader:after {
    content: '';
    position: absolute;
    width: 48px;
    height: 48px;
    border: 5px solid var(--light);
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    animation: scaleUp 1s linear infinite;
  }
  
  @keyframes scaleUp {
    0% { transform: translate(-50%, -50%) scale(0) }
    60% , 100% { transform: translate(-50%, -50%)  scale(1)}
  }
  @keyframes pulse {
    0% , 60% , 100%{ transform:  scale(1) }
    80% { transform:  scale(1.2)}
  }

</style>
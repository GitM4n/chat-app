<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
import {socket} from '../socket'
import {useUser} from '../composables/useUser.global'
import { useGetAllUsers } from '@/composables/useGetAllUsers';

const user = useUser().userData




socket.on('user-status-online', async()=>{
    await useUser().updateUser({online_status:true})
   
    setTimeout(async()=>{
        await useGetAllUsers().getAllUsers()
        await useGetAllUsers().getFriends()

        await useUser().updateUser({online_status:false})
    }, 500)
   
})

socket.on('user-status-offline', async()=>{
    await useGetAllUsers().getAllUsers()
    await useGetAllUsers().getFriends()
})







onMounted(async() => {
    await useGetAllUsers().getAllUsers()
    await useGetAllUsers().getFriends()
    socket.connect()
    socket.auth = {  
    username:user.value?.name,
    user_id:user.value?.id
    };

})

onBeforeUnmount(async ()=>{
    socket.disconnect()
})
</script>

<template>
    <div class="chat-root" style="height: 100%;">
        <router-view></router-view>
    </div>
</template>

<style scoped>

.chat-root > * {
    height: 100%;
}

</style>
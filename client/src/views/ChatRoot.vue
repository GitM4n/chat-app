<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
import {socket} from '../socket'
import {useUser} from '../composables/useUser.global'

const user = useUser().userData

onMounted(() => {
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
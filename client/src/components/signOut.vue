<script setup lang="ts">
import {useUser} from '@/composables/useUser.global'
import buttonComponent from './UI/buttonComponent.vue';

const signOut = () => {
    useUser().signOut()
}
</script>



<template>
    <div class="signOut">
        <buttonComponent class="red" @click="signOut()">Выйти из аккаунта</buttonComponent>
    </div>
</template>

<style scoped>

.singOut{
    display: flex;
    justify-content: center;
    align-items: center;  
}



</style>
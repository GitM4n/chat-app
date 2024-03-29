<script setup lang="ts">
import  {computed } from 'vue';
import ChatRoot from './views/ChatRoot.vue';
import SignView from './views/SignView.vue';
import {useUser} from '@/composables/useUser.global'


const {userData} = useUser()

const user = computed(() => {
  return userData.value
})





</script>

<template>
   <div class="wrapper">
    <main class="main">
     <ChatRoot v-if="user?.name"/>
     <SignView v-else/>
   
    </main>
   </div>
</template>


<style>
ul{
  list-style: none;
}

:root{
  --dark:#232931;
  --gray:#393E46;
  --green:#4ecca3;
  --light:#EEEEEE;
  --red:#fc2b28;
  --green-rgb:78,204,163;
  --gray-rgb:57,62,70;
  --dark-rgb:35,41,49;
  --light-rgb:238,238,238;
  --light-red:252,43,40;
}


*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app{
  height: 100%;
  display: flex;
  flex-direction: column

}


.wrapper{
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding:10px 30px;
  position: relative;
  background-color: var(--dark);
  color: var(--light);
}

.main{
  min-height: 100%;
}
</style>
./views/ChatWindow.vue
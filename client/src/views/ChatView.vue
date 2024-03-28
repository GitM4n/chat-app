<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted, ref} from 'vue'
import {socket} from '@/socket'
import {type IUser} from '@/interfaces'
import signOut from '@/components/signOut.vue';


import MessageInput from '@/components/UI/MessageInput.vue';




const props = defineProps<{
  user:IUser | null,
 }>()




 

const message = ref<string>('')
interface IMessages{
  message: string
  user_id: string,
  username: string,

}




socket.onAny((event, ...args) => {
  console.log(event, args);
});



const messages = ref<IMessages[]>([])
socket.on('message', (data) => {
  messages.value.push(data)
})






const sendMessage = () => {

  if(!message.value.replace(/\s/g, '').length) return
  
  socket.emit('message', {
    message: message.value.trim(),
    user_id: props.user?.id,
    username: props.user?.name
  });

  message.value = '';
 
}



onMounted(async() => {

  socket.connect()
  socket.auth = { 
    username:props.user?.name,
    user_id:props.user?.id
  };

 
})

onBeforeUnmount(async ()=>{

  socket.disconnect()
})



</script>

<template>

    <div class="chat-window">
      <div class="chat-window__inner">
        <div class="chat-window__messages">
          <div class="chat-window__message" :class="data.user_id === props.user?.id ? 'thisUser' : 'otherUsers'" v-for="data in messages">
            <p>
              <small class="users__nickname">{{data.username === props.user?.name ? '' : data.username + ':'}}</small>
                <span class="message__text">{{data.message}}</span> 
              <small class="your__nickname">{{data.username === props.user?.name ? ':You' : ''}}</small>
            </p>
          </div>
        </div>
      </div>
      <div class="chat-window__users">
        <ul class="users">
           
        </ul>
    </div>
      <div class="chat-window-input">
        <MessageInput v-model="message" @send-message="sendMessage"/>
      </div>
   </div>
   
    <signOut/>
    
 
</template>


<style scoped>



.chat-window{
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.chat-window__inner{
  max-width: 900px;
  border: 2px solid var(--green);
  background-color: var(--dark);
  height: 500px;
  overflow-y: auto;
  padding: 10px;
}


.chat-window__messages{
  display: flex;
  flex-direction: column;
  gap: 10px;
}


.chat-window__message{
  display: flex;
  
}

.thisUser{
  justify-content: end;
}


.thisUser p{
  color: var(--light);
  text-align: end;
  background: var(--green);
  right: 0;
}

.otherUsers p{
  color: var(--light);
  background: var(--gray);
}

.thisUser p, .otherUsers p{
  border-radius: 4px;
  padding: 3px;
}



.users{
  display: flex;
  flex-direction: column;
  gap: 10px;
  
}

.user{
  list-style: none;
  padding: 10px;
  border-radius: 5px;
  background-color: var(--green);
  color: var(--light);
  text-align: center;
  max-width: 100px;
}


.chat-window-input{
  position: relative;
  display: flex;
  gap: 5px;
  align-items: end;
}




</style>

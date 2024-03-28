<!-- В разработке...-->
<template>

</template>






<!-- <script setup lang="ts">
import {computed, ref} from 'vue';
import MessageInput from '@/components/UI/MessageInput.vue';
import { socket } from '@/socket';
import type {IChat, IMessage, IUser} from '@/interfaces'


const props = defineProps<{
  user?:IUser | null,
  allUsers?:IUser[] | null,
  room?:IChat,

}>()





const message = ref<string>('')
const messages = ref<IMessage[]>([])

socket.on('message', (data) => {
  messages.value.push(data)
})
const sendMessage = () => {

if(!message.value.replace(/\s/g, '').length) return

socket.emit('message', {
  message: message.value.trim(),
  sender_name:props.user?.name,
  sender_id:props.user?.id
});

message.value = '';

}



const getRoomData = () => {

}


</script>

<template>
    <div class="messages-window">
        <p>{{room?.name}}</p>
        <div class="messages-window__inner">
        
            <div class="message-input">
                <MessageInput v-model="message" @send-message="sendMessage"/>
            </div>
        </div>
    </div>




      <li class="message" :class="data.sender_id === user?.id ? 'thisUser' : 'otherUsers'" v-for="data in messages">
                        <p>
                            <small class="users__nickname">{{data.sender_id  === user?.id ? '' : data.sender_id  + ':'}}</small>
                              <span class="message__text">{{data.message}}</span> 
                            <div class="receiver">
                                <small class="your__nickname">{{data.sender_id  === user?.id ? ':You' : ''}}</small>

                            </div>
                        </p>
                    </li>
</template>

<style scoped>


.messages-window{
    height: 400px;
}

.messages-window__inner{
    height: 100%;
    display: flex;
    flex-direction: column;
}

.messages-content{
    flex-grow: 1;
}

.messages{
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  
.message{
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

  .message-input{
    position: relative;
    display: flex;
    gap: 5px;
    align-items: end;
  }
  

</style> -->


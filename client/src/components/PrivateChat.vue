<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';
import MessageInput from '@/components/UI/MessageInput.vue';
import { socket } from '@/socket';
import type {IMessage, IUser} from '@/interfaces'
import { useGetAllUsers } from '@/composables/useGetAllUsers';
const allUsers =  useGetAllUsers().allUsers




const props = defineProps<{
  user?:IUser | null,
  allUsers?:IUser[],
  room?:IUser,

}>()



const receiver = computed(()=>{
    return allUsers.value?.find(user => user.id === props.room?.id)
})

console.log(receiver.value)

const message = ref<string>('')
const messages = ref<IMessage[]>([])

socket.on('private-message', (data) => {
  messages.value.push(data)
  lastMessageScroll()
})
const sendMessage = () => {

if(!message.value.replace(/\s/g, '').length) return

socket.emit('private-message', {
  message: message.value.trim(),
  sender_name:props.user?.name,
  sender_id:props.user?.id,
  chat_id:props.room?.id
});

lastMessageScroll()
message.value = '';

}


function lastMessageScroll() {
    const e = document.querySelector('.wrapper_Scrollbottom');
    if (!e) return ; 
    
    e.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
    });
}



socket.emit('private-room', {
  sender_id:props.user?.id,
  chat_id:props.room?.id
})





</script>

<template>
    <div class="messages-window">
        <div class="messages-window__inner">
        <div class='room-data'>
          <div class="room-avatar">
              <img class="avatar-img" :src="receiver?.avatar" alt="avatar">
          </div>
          <div class="room-text">
              <div class="room-text__name">
                  <p >{{receiver?.name}}</p>
              </div>
              <div class="room-text__status">
                  <p :style="{color:receiver?.online_status ? 'green' : 'red'}">
                    {{receiver?.online_status ? 'Online' : 'Offline'}}
                  </p>
              </div>
          </div>
        </div>
            <div class="messages-content">
                  <ul class="messages">
                    <li class="message" :class="data.sender_id === user?.id ? 'thisUser' : 'otherUsers'" v-for="data in messages">
                        <div class="message__avatar" v-if="data.sender_id !== user?.id">
                            <img class="avatar-img" :src="receiver?.avatar" alt="receiverAvatar">
                        </div>
                        <p class="message__inner">
                            
                              <span class="message__text">{{data.message}}</span> 
    
                        </p>
                        <div class="message__avatar" v-if="data.sender_id === user?.id">
                          <img class="avatar-img" :src="user.avatar" alt="yourAvatar">
                      </div>
                    </li>
                    <div class="wrapper_Scrollbottom"></div>
                </ul>
              
                 
            </div>
            <div class="message-input">
                <MessageInput style="opacity: 0.2;" v-model="message" @send-message="sendMessage"/>
            </div>
            
        </div>
    </div>
  
</template>

<style scoped>

.room-data{
  display: flex;
  gap: 10px;
  height: 70px;
  padding: 10px 15px;
  border: 2px solid var(--green);
}

.room-avatar{
  width: 50px;
  height: 50px;
}

.room-avatar img{
  width: 100%;
  height: 100%;
  border-radius: 50%;
}


.messages-window{
  height: 100%;
}

.messages-window__inner{
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: space-between;
    height: 100%;

  
  
}

.messages-content{
  position: relative;
  max-height: 95%;
  flex-grow: 1;
  overflow-y: auto;
}


.messages{
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  
.message{
    display: flex;
    gap: 5px;
    
  }
  .message__inner{
    display: flex;
    flex-direction: column-reverse;
    padding: 2px 4px;
    border-radius: 4px;
  }

  .message__avatar{
    width: 30px;
    height: 30px;
  }
  
  .message__avatar img{
    width: 100%;
    height: 100%;
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

  .wrapper_Scrollbottom{
    position: absolute;
    height: 50px;
    top: 100%;
    width: 1px;
  }
  

</style>
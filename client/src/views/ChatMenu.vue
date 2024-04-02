<script setup lang="ts">
import {onMounted, onBeforeUnmount, ref} from 'vue'
import {useUser} from '@/composables/useUser.global'
import {socket} from '@/socket'
import signOut from '@/components/signOut.vue';
import chatCard from '@/components/UI/chatCard.vue';
import { useGetAllUsers } from '@/composables/useGetAllUsers';
import type {IChat,IUser} from '@/interfaces'
import PublicChat from '@/components/PublicChat.vue';
import PrivateChat from '@/components/PrivateChat.vue';
import searchComponent from '../components/UI/searchComponent.vue';


const user = useUser().userData
const usersList = ref<IUser[] | null>()


const room = ref<IChat>()
const userRoom = ref<IUser>() 


const findFriend = (value:string) => {
    usersList.value = useGetAllUsers().friends.value?.filter((user)=>{
        return user.name.toLowerCase().includes(value.toLowerCase())
    })
}



socket.on('user-status-online', async()=>{
    await useUser().updateUser({online_status:true})
    await useGetAllUsers().getAllUsers()
    setTimeout(async()=>{
    await useUser().updateUser({online_status:false})
    }, 500)
})

socket.on('user-status-offline', async()=>{
    await useGetAllUsers().getAllUsers()
})




const setRoom = (data:IChat | IUser) => {

    if('receiver_id' in data){
        room.value = data as IChat
    }else{
        userRoom.value = data as IUser
    }
}






onMounted(async() => {
    await useGetAllUsers().getAllUsers()
    await useGetAllUsers().getFriends()
    usersList.value = useGetAllUsers().friends.value

    
})



</script>

<template>
    <div class="chat-wrapper">
        <div class="chat__inner">
            <div class="chat-users">
                <div class="current-user">
                    <router-link to="/settings">
                    <div class="current-user__avatar">
                        <img :src="user?.avatar" alt="your-avatar">
                    </div>
                    </router-link>
                    <div class="current-user__name">
                        {{ user?.name }}
                    </div>
                </div>
                <h2>Friends</h2>
                <searchComponent @find-friend="findFriend"/>
                <ul class="users">
                    <chatCard v-for="user in usersList" 
                            :key="user.id" 
                            :user="user"
                            :class="userRoom?.id === user.id ? 'active' : ''"
                            @click="setRoom(user)"></chatCard>
                </ul>
                
                <ul class="friends users">
                  
                    <!-- <li class="friend user" v-for="friend in user?.friends" :key="friend">
                        {{friend}}
                    </li> -->
                </ul>
            </div>
            <div class="chat-rooms">
                <PrivateChat :user="user" :room="userRoom" v-if="userRoom"/>
                <PublicChat :room="room" v-else-if="room"/>
                <p v-else>Выберите чат</p>
            </div>
         
        </div>
        <signOut class="signOut"/>
    </div>

</template>



<style scoped>

.user.active{
    background: var(--red);
}


h2{
    color: var(--green);
    font-size: 20px;
}
.chat-wrapper{
    position: relative;
    height: 100%; 
    padding: 20px 0;
}


.chat__inner{
    display: flex;
    height: 90%;
    justify-content: space-between;
    border-radius: 5px;
    border: 2px solid var(--green);
   
}
.chat-users{
    overflow-y: auto;
    flex: 0 1 20%;
     padding: 0 20px;
     margin:10px 0;
    border-right:2px solid var(--green);
    
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

.chat-rooms{
    padding: 10px 20px;
    flex-grow: 1;
}

.signOut{
    margin-top: 20px;
}

.current-user{
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 10px;
    padding: 10px 0;
    border-bottom: 2px solid var(--green);
}

.current-user__name{
    font-weight: 600;
    font-size: 24px;
    text-transform: capitalize;
}

.current-user__avatar{
    width: 50px;
    height: 50px;
    cursor: pointer;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid var(--green);
}
.current-user__avatar:hover{
    border: 3px solid var(--green);
}

.current-user__avatar img{
    width: 100%;
    height: 100%;
}
</style>
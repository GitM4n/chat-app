<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {useUser} from '@/composables/useUser.global'
import signOut from '@/components/signOut.vue';
import chatCard from '@/components/UI/chatCard.vue';
import { useGetAllUsers } from '@/composables/useGetAllUsers';
import { socket } from '@/socket';
import type {IChat,IUser} from '@/interfaces'
import PrivateChat from '@/components/PrivateChat.vue';
import searchComponent from '../components/UI/searchComponent.vue';
import addFriendIcon from '@/components/icons/addFriendIcon.vue';
import addFriendModal from '@/components/UI/addFriendModal.vue';
import notificationIcon from '@/components/icons/notificationIcon.vue';
import notificationModal from '@/components/UI/notificationModal.vue';

const user = useUser().userData
const usersList = ref<IUser[] | null>()
const loading = ref(true)
const showAddModal = ref(false)
const showNotfModal = ref(false)

const room = ref<IChat>()
const userRoom = ref<IUser>() 


const findFriend = (value:string) => {
    console.log(value)
    usersList.value = useGetAllUsers().friends.value?.filter((user)=>{
        return user.name.toLowerCase().includes(value.toLowerCase())
    })
}








const setRoom = (data:IChat | IUser) => {

    if('receiver_id' in data){
        room.value = data as IChat
    }else{
        userRoom.value = data as IUser
    }
}

const notfCount = ref(0)

const openNotf = () => {
    notfCount.value = 0
    showNotfModal.value = true

}







onMounted(async() => {
    await useGetAllUsers().getFriends()

    setTimeout(() => {
        usersList.value = useGetAllUsers().friends.value
        loading.value = false
    }, 400)
    
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
                    <div class="notifications" @click="openNotf">
                        <notificationIcon class="notification-icon" />
                        <div class="notifications__count" v-show="notfCount > 0">
                            <p>{{notfCount}}</p>
                        </div>
                    </div>
                </div>

                <h2>Friends</h2>

                <searchComponent 
                    @search="findFriend" 
                    :placeholder="'Поиск по друзьям'"/>

                <div class="loading" v-if="loading">Загрузка...</div>
                <div class="users-block" v-else>
                    <ul class="users" v-if="usersList">
                        <chatCard v-for="user in usersList" 
                                :key="user.id" 
                                :user="user"
                                :class="userRoom?.id === user.id ? 'active' : ''"
                                @click="setRoom(user)"></chatCard>
                    </ul>
                    <div class="not_friends" v-else>
                        <p>У вас нет друзей</p>
                    </div>
                </div>
                <div class="adv-features">
                    <div class="add-friend" @click="showAddModal = true">
                        <addFriendIcon class="add-friend-icon"/>
                    </div>
                </div>
            </div>
            <div class="chat-rooms">
                <div class="single-chats" v-if="userRoom">
                    <template v-for="friend in usersList" :key="friend.id">
                        <PrivateChat :user="user" :room="friend" v-if="friend === userRoom"/>
                    </template>
                </div>
                <div class="let-start" v-else>
                    <p>Здравствуйте, <b>{{user?.name}}</b></p>
                    <small>Для начала общения выберите чат</small>
                </div>
            </div>
         
        </div>
        <signOut class="signOut"/>
        <addFriendModal class="addFriendModal" 
            :show="showAddModal" 
            @close="showAddModal = false"/>
        <notificationModal class="notification-modal"
             @notf-counts="notfCount++" 
             :show="showNotfModal" 
             @close="showNotfModal = false"/>
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
    display: flex;
    flex-direction: column;
    flex: 0 1 20%;
    padding: 0 20px;
    margin:10px 0;
    min-width: 320px;
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
    flex-grow: 1;
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

.single-chats{
    height: 100%;
}

.users-block{
    flex-grow: 1;
}


.let-start{
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.let-start p{
    font-size: 24px;
}

.adv-features{
    display: flex;
    justify-content: end;
}

.add-friend-icon{
    width: 50px;
    height: 50px;
}

.notifications{
    position: relative;
}

.notification-icon{
    width: 30px;
    height: 30px;
}

.notifications__count{
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40%;
    height: 40%;
    top: 0;
    right: -2px;
    border-radius: 50%;
    background-color: var(--red);
   
}

.notifications__count p{
    color: var(--light);
    font-size: 12px;

}


</style>
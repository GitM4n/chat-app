<script setup lang="ts">
import searchComponent from '../UI/searchComponent.vue';
import { ref } from 'vue';
import { useGetAllUsers } from '@/composables/useGetAllUsers';
import type { IUser } from '@/interfaces';
import { useUser } from '@/composables/useUser.global';
import addFriendIcon from '../icons/addFriendIcon.vue';
import isFriend from '../icons/isFriend.vue'
import { socket } from '@/socket';


const currentUser = useUser().userData
const usersService = useGetAllUsers()

const users = useGetAllUsers().allUsers
const filteredUsers = ref<IUser[]>()


const usersFilter = (val:string) => {  
    console.log(val.length)
    if(val.length === 0){
        filteredUsers.value = []
        return
    }

    filteredUsers.value = users.value?.filter((user) => {
        return user.name.toLowerCase().includes(val)
    })
}


const props = defineProps<{
    show?:boolean
}>()

const emit = defineEmits<{
    (e:'close'):void
}>()



const requsetAddFriend = async (id:string) => {

    const data = await usersService.sendRequest(id, 'addFriend')
    if(!data){
        alert('Ошибка в запросе requsetAddFriend')
        return
    }



    socket.emit('add-friend', {
        sender_id:currentUser.value?.id,
        sender_name:currentUser.value?.name,
        receiver_id:id
    })

    console.log('emitted')

    

}




</script>



<template>
    <div class="addFriendModal" v-show="props.show" @click="emit('close')">
        <div class="addFriendModal__inner" @click.stop>
            <div class="search">
                <searchComponent placeholder="Найти друга" @search="usersFilter"/>
            </div>
            <div class="users-block">
                <ul class="users-list">
                    <li v-for="user in filteredUsers" :key="user.id" class="user">
                        {{ user.name }}
                        <div class="friend-icon">
                            <addFriendIcon v-if="!currentUser?.friends?.includes(user.id)" @click="requsetAddFriend(user.id)"/>
                            <isFriend v-else/>
                        </div>
                    </li>
                 
                </ul>
           
            </div>
    
        </div>
       
    </div>
</template>

<style scoped>

.addFriendModal{
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.addFriendModal__inner{
    padding: 10px 15px;
    width: 500px;
    height: 500px;
    background-color: var(--dark);
    border-radius: 10px;
}

.user{
    display: flex;
    justify-content: space-between;
}



.isFriend{
    width: 40px;
    height: 40px;
}
.addFriendIcon{
    width: 40px;
    height: 40px;
}

</style>
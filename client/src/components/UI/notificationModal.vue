<script setup lang="ts"> 
import { onMounted, ref } from 'vue';
import { socket } from '@/socket';
import doneIcon from '../icons/doneIcon.vue';
import undoneIcon from '../icons/undoneIcon.vue'
import {useGetAllUsers} from '@/composables/useGetAllUsers'
import { useUser } from '@/composables/useUser.global';

const currentUser = useUser().userData

const userService = useGetAllUsers()

const props = defineProps<{
    show?:boolean
}>()




const notificationsList = ref<{
    sender_id:string,
    sender_name:string,
    message?:string,
    style?:'done' | 'undone',
    controls?:boolean
}[]>([])


const emit = defineEmits<{
    (e:'close'):void,
    (e:'notfCounts'):void
}>()






const addNotification = (id:string, message:string, controls?:boolean, style?:'done' | 'undone', ) =>{

    const senderName = userService.allUsers.value?.find((user) => user.id == id)?.name

    const notification = {
        sender_id:id,
        sender_name:senderName!,
        message,
        style, 
        controls
    }

   
   
    


    if(notificationsList.value.includes(
        {
            sender_id:id,
            sender_name:senderName!,
            message
        }
    )) {
        return
    }

    

    emit('notfCounts')
    notificationsList.value.push(notification)
    console.log(notificationsList.value)
    
}




const setStyle = (Nodeidx:number, style:'done' | 'undone', msg?:string) => {
    let notificationsNodes = document.querySelectorAll('.notification-item')
    const controls = notificationsNodes[Nodeidx].querySelector('.controls')
    notificationsNodes[Nodeidx].classList.add(style)
 
    if(controls) controls.classList.add('hidden')

    const notificationNodeChild = notificationsNodes[Nodeidx].firstChild?.firstChild
   
    if (notificationNodeChild 
        && notificationNodeChild !== null
        && notificationNodeChild.textContent !== null 
        && msg) {
             notificationNodeChild.textContent = msg; 
         }

}







const accept = async(Nodeidx:number, user_id:string, user_name:string) => {
    

    await userService.acceptRequest(user_id, 'addFriend')

    const message = `${user_name} теперь в вашем списке друзей`
    setStyle(Nodeidx, 'done', message )

    socket.emit('accept-friend',{ 
        sender_id:currentUser.value?.id, 
        receiver_id:user_id,
        message: `${currentUser.value?.name} принял ваш запрос в друзья`
    })
}

const reject = async(Nodeidx:number, user_id:string, user_name:string) => {

    await userService.rejectRequest(user_id, 'addFriend')

    const message = `Запрос в друзья от ${user_name} отклонен`
    setStyle(Nodeidx, 'undone', message)

    socket.emit('reject-friend',{ 
        sender_id:currentUser.value?.id, 
        receiver_id:user_id,
        message: `${currentUser.value?.name} отклонил ваш запрос в друзья`
    })

}



socket.on('request-friend', (id, message) => {
    console.log(id, message)
    addNotification(id, message, true)
})


socket.on('accept-friend', async(id, message) => {

    await userService.acceptedFriends()
    addNotification(id, message, false, 'done')
    
})

socket.on('reject-friend', (id, message) => {
    addNotification(id, message, false, 'undone')
})





onMounted(async()=>{
   const data = (await userService.notifications())

   data.map((notf) => {
        const sender = userService.allUsers.value?.find((user) => notf.sender_id == user.id);
        const msg = notf.request_name === 'addFriend' ? `${sender?.name} хочет добавить вас в друзья` : '';
        const controls =  notf.request_name === 'addFriend' ;  

        addNotification(sender?.id as string, msg, controls)
      
   })

 

   
})



</script>

<template>
    <div class="notification-modal" v-show="props.show" @click="emit('close')">
        <div class="notification-modal__inner" @click.stop>
            <p v-if="notificationsList.length === 0">Нет уведомлений</p>
            <ul class="notification-items" v-else>
                <li class="notification-item" v-for="notification, idx in notificationsList" :key="idx" :class="notification.style ? notification.style : ''" >
                    <div class="notification__desc">
                        <span class="notification__text">
                            {{ notification.message }}
                        </span> 
                    </div>
                    <div class="controls" v-if="notification.controls">
                        <doneIcon class="doneIcon" @click="accept(idx, notification.sender_id, notification.sender_name)"/>
                        <undoneIcon class="undoneIcon" @click="reject(idx, notification.sender_id, notification.sender_name)" />
                    </div>
                </li>
            </ul>
        </div>
       
    </div>
</template>


<style scoped>
.notification-modal{
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

.notification-modal__inner{
    padding: 10px 15px;
    width: 500px;
    height: 500px;
    background-color: var(--dark);
    border-radius: 10px;
}

.notification-item{
    display: flex;
    gap: 5px;
    border: 2px solid var(--gray);
    border-radius: 10px;
    padding: 8px 12px;
}

.notification-item.done{
    border: 2px solid var(--green);
}

.notification-item.undone{
    border: 2px solid var(--red);
}

.notification__desc{
    flex-grow: 1;
}

.doneIcon,
.undoneIcon{
    width: 30px;
    height: 30px;
}

.controls.hidden{
    display: none;
}

</style>
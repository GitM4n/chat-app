<script setup lang="ts"> 
import { onMounted, ref } from 'vue';
import { socket } from '@/socket';
import doneIcon from '../icons/doneIcon.vue';
import undoneIcon from '../icons/undoneIcon.vue'
import {useGetAllUsers} from '@/composables/useGetAllUsers'

const userService = useGetAllUsers()

const props = defineProps<{
    show?:boolean
}>()




const notificationsList = ref<{
    sender_id:string,
    sender_name:string
}[]>([])
const notfCount = ref(0)

const emit = defineEmits<{
    (e:'close'):void,
    (e:'notfCounts', value:number):void
}>()


const accept = async(Nodeidx:number, sender_id:string) => {

    await userService.acceptRequest(sender_id, 'addFriend')





    let notificationsNodes = document.querySelectorAll('.notification-item')
    notificationsNodes[Nodeidx].classList.add('done')
    if(notificationsNodes[Nodeidx].firstChild?.firstChild){
        notificationsNodes[Nodeidx].firstChild.firstChild.textContent = 'Вы добавили в друзья '
    }
}



socket.on('request-friend', (name) => {
    emit('notfCounts', notfCount.value++)
    if(notificationsList.value.includes(name)) return
    notificationsList.value.push(name)
})

onMounted(async()=>{
   const data = (await userService.notifications())
   
   data.map((notf) => {
        const sender = userService.allUsers.value?.find((user) => notf.sender_id == user.id)
        if(sender) notificationsList.value.push({
            sender_id:sender.id,
            sender_name:sender.name
        })
        
   })

   
})



</script>

<template>
    <div class="notification-modal" v-show="props.show" @click="emit('close')">
        <div class="notification-modal__inner" @click.stop>
            <p v-if="notificationsList.length === 0">Нет уведомлений</p>
            <ul class="notification-items" v-else>
                <li class="notification-item" v-for="notification, idx in notificationsList" :key="idx" >
                    <div class="notification__desc">
                        <span class="notification__text">
                            У вас запрос в друзья от
                        </span> 
                        <span class="notification__object">{{ notification.sender_name }}</span>
                    </div>
                    <doneIcon class="doneIcon" @click="accept(idx, notification.sender_id)"/>
                    <undoneIcon class="undoneIcon" />
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

</style>
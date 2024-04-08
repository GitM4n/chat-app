<script setup lang="ts"> 
import { ref } from 'vue';
import { socket } from '@/socket';
const props = defineProps<{
    show?:boolean
}>()


const receiver_name = ref('')

const emit = defineEmits<{
    (e:'close'):void,
    (e:'notfCounts', value:number):void
}>()




socket.on('request-friend', (name) => {
    emit('notfCounts', 1)
    receiver_name.value = name
})





</script>

<template>
    <div class="notification-modal" v-show="props.show" @click="emit('close')">
        <div class="notification-modal__inner" @click.stop>
            <p>Нет уведомлений</p>
            <ul class="notification-items">
                <li class="notification-item">
                   У вас запрос в друзья от {{ receiver_name }}
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
</style>
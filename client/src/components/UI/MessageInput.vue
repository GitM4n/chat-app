<script setup lang="ts">
import { ref} from 'vue'
import SendButton from '@/components/UI/SendButton.vue';
import { useResizeHook } from '@/composables/useResizeHook';
const props = defineProps<{
    modelValue?: string,
    placeholder?: string
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: string | number): void,
    (e: 'sendMessage'): void
}>()

const isEmpty = ref<boolean>(true)


const inputElement = ref<HTMLParagraphElement | null>(null)


const editable = (eventTarget:EventTarget) =>{
    isEmpty.value = false
    setTimeout(() => {
        inputElement.value?.focus()
    }, 100)

    

}

const nonEditable = () =>{
    setTimeout(() => {
        isEmpty.value = true
    }, 100)
   
}

const sendMessage = () => {
    inputElement.value!.innerText = ''
    emit('sendMessage')
}




</script>

<template>
<div class="input-wrapper" 
     @click="editable($event.target as HTMLDivElement)"> 
        <p class="input-text"
            contenteditable="true"
        
            @blur="nonEditable"
            @input="emit('update:modelValue', ($event.target as HTMLInputElement).innerText)"
            ref="inputElement" 
            ></p>
        <span  v-show="isEmpty">Сообщение...</span>
</div>
<SendButton  @click="sendMessage()">Отправить</SendButton>

    
</template>

<style scoped>

.input-wrapper{
    position: relative;
    overflow-y: auto;
    display: inline-block;
    flex-grow: 1;
}


.input-text{
   overflow-y: auto;
    position: relative;
    max-height: 200px;
    padding: 8px 12px;
    z-index: 2;
    background-color: transparent;
    white-space: nowrap;
    transition: all .4s ease;
    outline: none;
    border: 2px solid var(--gray);
    border-radius: 6px;

}



.input-text:focus{
    border-color: var(--green);
}
.input-text:focus::after{
    opacity: 0.5;
}
span{
    margin-left: 12px;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
}


@media(max-width: 900px){
    .input-text{
        padding: 6px 8px;
    }

    span{
        margin-left: 8px;
    }
}

</style>
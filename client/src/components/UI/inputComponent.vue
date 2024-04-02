<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
    modelValue?: string | number,
    id?: string,
    type?: string,
    dataType?:string,
    name?: string,
    placeholder?: string,
    pattern?:string,
    errorMessage?:string,
    maxLength?:string,
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: string | number): void
}>()

const inputWrapper = ref<null | HTMLDivElement>(null)

const isEmpty = computed(() => {
    return props.modelValue?.toString().length === 0 || props.modelValue === undefined
})

const isFocus = () => {
    if(inputWrapper.value){
        inputWrapper.value.classList.add('active')
    }
}

const isBlur = () => {
    if(inputWrapper.value){
        inputWrapper.value.classList.remove('active')
    }
}

const emitStandard = (val:string) => {
    emit('update:modelValue', val)
}

const emitDateFormat = (val:string) => {

    let input = val.replace(/\D/g, '');
    input = input.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
    val = input

    emit('update:modelValue', val)
}






</script>

<template>
    <div class="input-text-wrapper" ref="inputWrapper">
        <div class="input-text">
            <input class="text" 
                    :value="props.modelValue"
                    :type="props.type ? props.type : 'text'"
                    :name="props.name"
                    :placeholder="props.placeholder"
                    :id="props.id"
                    :maxlength="props.maxLength" 
                    @focus="isFocus()"
                    @blur="isBlur()"
                    @input="props.dataType === 'date' ? emitDateFormat(($event.target as HTMLInputElement).value) : emitStandard(($event.target as HTMLInputElement).value)"> 
            <div class="focus-bg"></div>
           
        </div>
    </div>
    <small class="input-error" v-show="errorMessage">{{props.errorMessage}}</small>
</template>

<style scoped>

.input-text-wrapper{
    padding: 8px 12px;
    border-bottom: 2px solid var(--gray);
    position: relative;
    overflow-y: auto;
    flex-grow:1;
}

.input-text-wrapper.active{
    border-color:var(--green);
}


input{
    all: unset;
}





.text{
    box-sizing: border-box;
    width:100%;
    position: relative;
    z-index: 2;
    background-color: transparent;
    outline: none;
   
}

.focus-bg{
    z-index: 1;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--green);
    opacity: 0;
    transition: all 0.6s ease;
}

.text:focus{
    border-color: var(--green);
    
}
.text:focus ~ .focus-bg{
    opacity: 0.5;
}

.placeholder{
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
}

.input-error{
    color:var(--red);
}







</style>
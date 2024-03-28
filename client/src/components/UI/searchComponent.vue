<script setup lang="ts">
import inputComponent from './inputComponent.vue';
import {ref} from 'vue'

const emit = defineEmits<{
    (e:'findFriend', value:string):void
}>()
const searchText = ref<string>('')

const findFriend = () =>{
    emit('findFriend', searchText.value)
}

</script>
<template>
    <div class="input-search"> 
        <inputComponent v-model="searchText" class="search-box" :placeholder="'Поиск собеседника...'" @input="findFriend()" />
    </div>
</template>

<style scoped>
.input-search{
    position: relative;
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
}


.search-box{
    flex: 1 1 80%;
}

.search-btn{
    width: 30px;
    height: 30px;
  
}

.search-icon{
    display: inline-block;
    height: 100%;
    width: 100%;

    border-radius: 50%;
    background: radial-gradient(circle at center, transparent 70%, green 71%);
}

</style>
<script setup lang="ts">
import inputComponent from './inputComponent.vue';
import {ref, watch} from 'vue'



const props = defineProps<{
    placeholder?:string
}>()

const emit = defineEmits<{
    (e:'search', value:string):void
}>()
const searchText = ref<string>('')

watch(searchText, () => {
    findFriend()
})

const findFriend = () =>{
    emit('search', searchText.value)
}

</script>
<template>
    <div class="input-search"> 
        <inputComponent v-model="searchText" class="search-box" :placeholder="props.placeholder"  />
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
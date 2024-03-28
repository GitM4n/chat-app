
<script setup lang="ts">

</script>

<template>
    <button>
        <slot></slot>
    </button>
</template>


<style scoped>

button{
    all: unset;
    background: var(--green);
    border: 1px solid var(--green);
    border-radius: 6px;
    box-shadow: rgba(0, 0, 0, 0.1) 1px 2px 4px;
    box-sizing: border-box;
    color: var(--light);
    cursor: pointer;
    display: inline-block;
    font-size: 16px;
    font-weight: 800;
    line-height: 16px;
    min-height: 40px;
    outline: none;
    padding: 12px 14px;
    text-align: center;
    text-rendering: geometricprecision;
    text-transform: none;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    vertical-align: middle;
    transition: all .3s ease;
}

button:hover,
button:active,
button.active{
    background-color: initial;
    background-position: 0 0;
    color: var(--green);
}

.red{
    background-color: initial;
    background-position: 0 0;
    color: var(--red);
    border: 1px solid var(--red);
   
}

.red:hover,
.red:active {
    background-color: var(--red);
    color: var(--light);
}


</style>
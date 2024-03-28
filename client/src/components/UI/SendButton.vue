<script setup lang="ts">

</script>

<template>
  <button class="sendButton" >
          <slot></slot>
  </button>
</template>

<style scoped>

.sendButton[disabled] {
  opacity: 0.5;
  background: var(--gray);
  border: 1px solid var(--gray);
  cursor: not-allowed;
  
}





.sendButton {
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
  transition: all 0.3s ease; 
}

.sendButton:hover:not([disabled]),
.sendButton:active:not([disabled]) {
  background-color: initial;
  background-position: 0 0;
  color: var(--green);
}


@media (max-width: 900px) {
    .sendButton{
        padding: 6px 8px;
    }
}
</style>

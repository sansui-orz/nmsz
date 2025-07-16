<template>
  <div class="setting-item">
    <div class="label">{{ label }}</div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
})
</script>

<style scoped>
.setting-item {
  padding: 0.5em;
  margin-bottom: 0.5em;
  background: #e5e5e4;
  display: flex;
  align-items: flex-start;
  border-radius: 4px;
  box-shadow: 0 0 0 1px rgb(220, 223, 230) inset;
}
.setting-item .label {
  width: 80px;
  text-align: right;
  padding-right: 0.5rem;
  flex-shrink: 0;
}
.setting-item .content {
  flex-grow: 1;
}
</style>
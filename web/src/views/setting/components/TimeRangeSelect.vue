<template>
  <div class="time-range-container">
    <input
      type="time"
      :value="start"
      :min="minTime"
      :max="maxTime"
      :step="step"
      @change="handleStartChange"
    >
    <span class="separator">-</span>
    <input
      type="time"
      :value="end"
      :min="minTime"
      :max="maxTime"
      :step="step"
      @change="handleEndChange"
    >
  </div>
</template>

<script setup>
import { computed, watchEffect } from 'vue';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [null, null]
  },
  minTime: {
    type: String,
    default: '00:00'
  },
  maxTime: {
    type: String,
    default: '24:00'
  },
  step: {
    type: Number,
    default: 3600
  }
});

const emit = defineEmits(['update:modelValue']);

// 拆分开始和结束时间
const start = computed(() => props.modelValue[0]);
const end = computed(() => props.modelValue[1]);

// 验证时间范围
watchEffect(() => {
  if (start.value && end.value) {
    if (start.value >= end.value) {
      alert('结束时间必须晚于开始时间');
      emit('update:modelValue', [start.value, null]);
    }
    
    // 处理24:00特殊情况
    if (end.value === '23:59') {
      emit('update:modelValue', [start.value, '24:00']);
    }
  }
});

const handleStartChange = (e) => {
  emit('update:modelValue', [e.target.value, end.value]);
};

const handleEndChange = (e) => {
  emit('update:modelValue', [start.value, e.target.value]);
};
</script>

<style>
.time-range-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

input[type="time"] {
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 90px;
}

.separator {
  color: #666;
}
</style>

<script setup lang="ts">
import { onMounted } from 'vue'

const props = defineProps<{
  workDates: string[];
  restDates: string[];
}>()
const emit = defineEmits<{
  (e: 'update', date: string, isWork: boolean): void;
}>();
const clickHandle = (day: string) => {
  if (props.workDates.includes(day)) {
    emit('update', day, false)
  } else {
    emit('update', day, theDayNeedWork(day) ? false : true)
  }
}

const theDayNeedWork = (day: string) => {
  if (props.workDates.includes(day)) {
    return true
  } else if (props.restDates.includes(day)) {
    return false
  } else {
    // 默认则周一到周五上班
    const date = new Date(day)
    const week = date.getDay()
    return week !== 0 && week !== 6
  }
}

</script>

<template>
  <div class="work-date-select" style="width:485px;">
    <el-calendar>
      <template #date-cell="{ data }">
        <p class="custom-day" :class="theDayNeedWork(data.day) ? 'is-selected' : ''" @click="clickHandle(data.day)">
          {{ data.day.split('-').slice(1).join('-') }}
        </p>
      </template>
    </el-calendar>
  </div>
</template>

<style lang="less">
.work-date-select {
  .el-calendar {
    --el-border-color-lighter: var(--color-border);
    --el-border-color: var(--color-border);
    --el-fill-color-blank: var(--color-background);
    --el-text-color-regular: var(--color-text);
    --el-calendar-selected-bg-color: var(--color-background-mute);
    --el-calendar-cell-width: 40px;
    .el-button {
      --el-button-hover-bg-color: var(--color-background-mute);
      --el-button-hover-border-color: var(--color-border-hover);
    }
    .el-calendar-day {
      padding: 0;
      p {
        padding: 8px;
      }
    }
  }
}
.custom-day {
  line-height: 24px;
  &.is-selected {
    background-color: var(--color-background-primary);
    color: var(--color-white);
  }
}
</style>

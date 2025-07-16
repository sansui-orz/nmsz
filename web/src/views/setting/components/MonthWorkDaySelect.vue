<template>
  <div class="calendar-container">
    <div class="calendar-header">
      <!-- <button @click="changeMonth(-1)">←</button> -->
      <span class="month-title">{{ currentMonth }}</span>
      <!-- <button @click="changeMonth(1)">→</button> -->
    </div>
    
    <table class="calendar-grid">
      <thead>
        <tr>
          <th v-for="day in weekDays" :key="day">{{ day }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(week, index) in calendarWeeks" :key="index">
          <td 
            v-for="(date, i) in week" 
            :key="i"
            :class="{ 
              'selected': modelValue.includes(format(date, 'yyyy-MM-dd')),
              'current-month': format(date, 'yyyy-MM') === format(currentDate, 'yyyy-MM')
            }"
            @click="toggleDate(date)"
          >
            {{ date ? format(date, 'dd') : '' }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, 
  addMonths, isSameMonth, startOfWeek, endOfWeek } from 'date-fns';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:modelValue']);

const currentDate = ref(new Date());
const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

// 生成日历矩阵
const calendarWeeks = computed(() => {
  const monthStart = startOfMonth(currentDate.value);
  const monthEnd = endOfMonth(currentDate.value);
  const start = startOfWeek(monthStart, { weekStartsOn: 0 });
  const end = endOfWeek(monthEnd, { weekStartsOn: 0 });
  
  const days = eachDayOfInterval({ start, end });
  return Array.from({ length: days.length / 7 }, (_, i) => 
    days.slice(i * 7, (i + 1) * 7)
  );
});

// 当前月份显示文本
const currentMonth = computed(() => 
  format(currentDate.value, 'yyyy年MM月')
);

// 切换月份
const changeMonth = (offset) => {
  currentDate.value = addMonths(currentDate.value, offset);
};

// 日期选择切换
const toggleDate = (date) => {
  if (!isSameMonth(date, currentDate.value)) return;
  
  const dateStr = format(date, 'yyyy-MM-dd');
  const newSelection = props.modelValue.includes(dateStr)
    ? props.modelValue.filter(d => d !== dateStr)
    : [...props.modelValue, dateStr];
  
  emit('update:modelValue', newSelection);
};
</script>

<style scoped>
.calendar-container {
  max-width: 600px;
  margin: 0 auto;
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 15px;
}

.month-title {
  font-size: 1.2em;
  font-weight: bold;
}

.calendar-grid {
  width: 100%;
  border-collapse: collapse;
}

td {
  padding: 0 2px;
  text-align: center;
  border: 1px solid #eee;
  cursor: pointer;
  transition: all 0.2s;
}

td.selected {
  background-color: rgba(58, 127, 247, 0.05) !important;
  color: #3A7FF7;
}

td.current-month {
  background-color: #f8f8f8;
}

td:not(.current-month) {
  color: #ccc;
  cursor: not-allowed;
}

button {
  padding: 5px 12px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
}
</style>
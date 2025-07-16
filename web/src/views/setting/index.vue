<template>
  <div class="p-4 page-bg" :class="{'dart': dartMode}">
    <div class="flex justify-end mb-2">
      <!-- <button class="save-btn mx-2" @click="exitApp">退出APP</button> -->
      <button class="save-btn mx-2" @click="reset">重置</button>
      <button class="save-btn" @click="saveConfig">保存</button>
    </div>
    <SettingItem label="月薪">
      <input v-model="config.salary" type="number" />
    </SettingItem>
    <SettingItem label="工作时间">
      <div class="flex items-start">
        <div>
          <div class="flex mb-2" v-for="(item, index) in config.times" :key="index">
            <TimeRangeSelect v-model="config.times[index]" />
            <button class="del-btn mx-2" @click="delTime(index)">-</button>
          </div>
        </div>
        <button class="add-btn mt-2" @click="addTime">+</button>
      </div>
    </SettingItem>
    <SettingItem label="工作日期">
      <MonthWorkDaySelect v-model="config.days[dayKey[0]][dayKey[1]]" />
    </SettingItem>
    <SettingItem label="开机自启">
      <div class="flex items-center">
        <label class="switch">
          <input type="checkbox" v-model="config.autoLaunch" />
          <span class="slider round"></span>
        </label>
      </div>
    </SettingItem>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onBeforeMount, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import SettingItem from './components/SettingItem.vue'
import TimeRangeSelect from './components/TimeRangeSelect.vue'
import MonthWorkDaySelect from './components/MonthWorkDaySelect.vue'

const route = useRoute()

const initDays = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  return [year, `${year}-${('' + month).padStart(2, '0')}`]
}

const dayKey = initDays()
const dartMode = ref(route.query.dark === 'true')

const config = ref({
  autoLaunch: true,
  salary: 10000,
  times: [
    ['09:00', '18:00']
  ],
  days: {
    [dayKey[0]]: {
      [dayKey[1]]: []
    }
  }
})

const delTime = (index: number) => {
  config.value.times.splice(index, 1)
  if (config.value.times.length === 0) {
    config.value.times.push(['00:00', '01:00'])
  }
}

const addTime = () => {
  config.value.times.push(['00:00', '01:00'])
}

const saveConfig = () => {
  let beforeEnd = 0;
  for (let i = 0; i < config.value.times.length; i++) {
    const start = new Date(`2024-01-01 ${config.value.times[i][0]}`).getTime()
    const end = new Date(`2024-01-01 ${config.value.times[i][1]}`).getTime()
    if (start >= end || start < beforeEnd) {
      alert('时间区间错误，请检查')
      return
    }
    beforeEnd = end
  }
  if (window.webExposeHandle) {
    window.webExposeHandle.setConfig(JSON.stringify({
      ...config.value,
      times: config.value.times.map((item) => {
        return {
          start: item[0],
          end: item[1]
        }
      })
    }))
  }
}

const reset = () => {
  init();
}

// const exitApp = () => {
//   if (window.webExposeHandle) {
//     window.webExposeHandle.exitApp()
//   }
// }

const init = () => {
  if (window.webExposeHandle) {
    window.webExposeHandle.getConfig().then((res: any) => {
      const [year, month] = dayKey
      if (!res.days[year]) {
        res.days[year] = {}
      }
      if (!res.days[year][month]) {
        res.days[year][month] = []
      }
      res.times = res.times.map((item) => {
        return [item.start, item.end]
      })
      config.value = res
    })
  }
}
const dartModeChange = (event: any, arg: any) => {
  dartMode.value = arg
}
onBeforeMount(() => {
  // dartMode.value = route.query.dark === 'true'
})
onMounted(() => {
  init();
  window.webExposeHandle && window.webExposeHandle.ipcRenderer.on('dark-mode-changed', dartModeChange)
})
onBeforeUnmount(() => {
  window.webExposeHandle && window.webExposeHandle.ipcRenderer.off('dark-mode-changed', dartModeChange)
})
</script>
<style scoped>
.p-4 {
  padding: 1rem;
}
.page-bg {
  background-color: #edeceb;
  min-height: 100vh;
}
.dart {
  background-color: #282724;
}
.flex {
  display: flex;
  align-items: center;
}
.items-start {
  align-items: flex-start;
}
.items-center {
  align-items: center;
}
.justify-end {
  justify-content: flex-end;
}
.mx-2 {
  margin-left: 0.5em;
  margin-right: 0.5em;
}
.mb-2 {
  margin-bottom: 0.5em;
}
.mt-2 {
  margin-top: 0.5em;
}
/* 开关样式 */
.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

/* 隐藏默认的复选框 */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* 滑块样式 */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(20px);
  -ms-transform: translateX(20px);
  transform: translateX(20px);
}

/* 圆角滑块 */
.slider.round {
  border-radius: 12px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
<style>
.dart .setting-item {
  background-color: #2f2e2b;
  box-shadow: 0 0 0 1px rgb(66, 68, 68) inset;
}
.dart td.current-month {
  background-color: #5d5c5c;
}
</style>
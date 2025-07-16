<script setup lang="ts">
import { ref } from 'vue'
const point1 = ref<number | undefined>()
const point2 = ref<number | undefined>()
const ranges = ref<Array<Array<number>>>([])
const options = [] as Array<{
  label: string
  value: number
}>;
const padStart = (s: number) => `${s}`.length == 1 ? `0${s}` : s
for (let i = 0; i < 24; i++) {
  options.push({
    label: `${padStart(i % 24)}:00`,
    value: i
  }, {
    label: `${padStart(i % 24)}:30`,
    value: i + 0.5
  })
}
options.push({
    label: `24:00`,
    value: 24
  })


const clickHandle = (index: number) => {
  if (typeof point1.value != 'number') {
    const rangeIndex = inRange(index)
    if (typeof rangeIndex === 'number') {
      const range = ranges.value[rangeIndex]
      ranges.value.splice(rangeIndex, 1)
      point1.value = range[0]
      point2.value = range[1]
    } else {
      point1.value = index
      point2.value = undefined
    }
    return
  } else if (point1.value === index) {
    point1.value = undefined
    point2.value = undefined
  } else {
    const rangeIndex = inRange(index)
    if (typeof rangeIndex !== 'number') {
      // 删除被包含的
      const min = Math.min(point1.value, index)
      const max = Math.max(point1.value, index)
      for (let i = 0; i < ranges.value.length; i++) {
        const range = ranges.value[i]
        if (range[0] >= min && range[1] <= max) {
          ranges.value.splice(i, 1)
          i--
        }
      }
      ranges.value.push([min, max])
      point1.value = undefined
      point2.value = undefined
    } else {
      const range = ranges.value[rangeIndex]
      ranges.value.splice(rangeIndex, 1)
      ranges.value.push([Math.min(point1.value, index, ...range), Math.max(point1.value, index, ...range)])
      point1.value = undefined
      point2.value = undefined
    }
  }
}

const clickRangeHandle = (index: number) => {
  const range = ranges.value[index]
  ranges.value.splice(index, 1)
  if (typeof point1.value == 'number') {
    ranges.value.push([Math.min(point1.value, ...range), Math.max(point1.value, ...range)])
    point1.value = undefined
    point2.value = undefined
  } else {
    point1.value = range[0]
    point2.value = range[1]
  }
}

const findOption = (v: number) => {
  for (let i = 0; i < options.length; i++) {
    if (options[i].value == v) {
      return options[i]
    }
  }
  return undefined
}

const inRange = (v: number, skip?: boolean) => {
  if (!skip && point1.value !== undefined &&
    point2.value !== undefined &&
    v >= Math.min(point1.value!, point2.value!) &&
    v <= Math.max(point1.value!, point2.value!)) {
    return true
  }
  for (let i = 0; i < ranges.value.length; i++) {
    const [min, max] = ranges.value[i]
    if (v >= min && v <= max) {
      return i
    }
  }
  return false
}

const mouseMoveHandle = (e: MouseEvent) => {
  if (typeof point1.value == 'number') {
    const base = e.target as HTMLElement
    const baseRect = base.parentElement!.getBoundingClientRect()
    const x = e.clientX - baseRect.left
    const index = Math.round(x / 10)
    const value = index / 2
    const rangeIndex = inRange(value, true)
    if (typeof rangeIndex !== 'number') {
      point2.value = value >= 24 ? 24 : value
    } else {
      point2.value = point1.value > value ? ranges.value[rangeIndex][0] : ranges.value[rangeIndex][1]
    }
  }
}

const deleteHandle = (index: number) => {
  point1.value = undefined
  point2.value = undefined
}

const getRangeLabel = (index: number) => {
  const range = ranges.value[index]
  if (typeof point1.value == 'number') {
    const min = Math.min(point1.value, range[0])
    const max = Math.max(point1.value, range[1])
    return `${findOption(min)!.label}~${findOption(max)!.label}`
  } else {
    return `${findOption(range[0])!.label}~${findOption(range[1])!.label}`
  }
}

defineExpose({
  init(_ranges: Array<{
    start: string;
    end: string;
  }>) {
    let lastIndex = 0
    point1.value = undefined
    point2.value = undefined
    ranges.value = _ranges.map((item) => {
      return [item.start, item.end].map((v) => {
        for (let i = lastIndex; i < options.length; i++) {
          if (options[i].label == v) {
            lastIndex = i
            return options[i].value
          }
        }
        return 0
      })
    })
  },
  getRange() {
    return ranges.value.sort((a, b) => a[0] > b[0] ? 1 : -1).map((item) => {
      return {
        start: findOption(item[0])!.label,
        end: findOption(item[1])!.label
      }
    })
  }
})
</script>

<template>
  <div style="">
    <div class="work-time-select" @mousemove="mouseMoveHandle">
      <div class="base"></div>
      <el-tooltip
        v-for="(item, index) in options"
        :key="item.value"
        effect="dark"
        :content="item.label"
        placement="top"
      >
        <div
          class="point"
          :class="{
            'in-range': inRange(item.value) !== false
          }"
          :style="{ left: index * 10 + 'px' }"
          @click="clickHandle(item.value)"
        ></div>
      </el-tooltip>
      <div
        v-if="point1 != point2 && point1 !== undefined && point2 !== undefined" 
        class="select-range"
        :style="{
          left: `${Math.min(point1, point2) * 20}px`,
          width: `${Math.abs(point1 - point2)  * 20}px`
        }"
      ></div>
      <el-tooltip
        v-for="(item, index) in ranges"
        :key="index"
        effect="dark"
        :content="`${getRangeLabel(index)}`"
        placement="top"
      >
        <div
          class="range select-range"
          :style="{
            left: `${item[0] * 20}px`,
            width: `${(item[1] - item[0])  * 20 + 5}px`
          }"
          @click="clickRangeHandle(index)"
        ></div>
      </el-tooltip>
      <el-tooltip
        v-if="point1 !== undefined"
        effect="dark"
        :visible="true"
        :content="findOption(point1)!.label"
        placement="top"
      >
        <div
          v-if="point1 !== undefined"
          :style="{ left: `${point1 * 20}px`}"
          class="point-1"
          @click="deleteHandle(point1)"
        ></div>
      </el-tooltip>
      <el-tooltip
        v-if="point2 !== undefined && point2 != point1"
        effect="dark"
        :content="findOption(point2)!.label"
        placement="top"
      >
        <div
          class="point-2"
          :style="{ left: `${point2 * 20}px`}"
          @click="clickHandle(point2)"
        ></div>
      </el-tooltip>
    </div>
  </div>
</template>

<style scoped lang="less">
.work-time-select {
  position: relative;
  cursor: pointer;
  width: 485px;
  .base {
    background: var(--vt-c-text-dark-2);
    position: relative;
    display: flex;
    align-items: center;
    height: 5px;
    overflow: visible;
    border-radius: 5px;
  }
  .point {
    // position: absolute;
    width: 5px;
    height: 5px;
    background: var(--vt-c-white-mute);
    margin-right: 5px;
    border-radius: 2.5px;
    flex-shrink: 0;
    cursor: pointer;
    position: absolute;
    top: 0;
    z-index: 2;
    &.in-range {
      opacity: 0;
    }
    &:hover {
      transform: scale(1.5);
      opacity: 1;
    }
  }
  .point-1, .point-2 {
    position: absolute;
    width: 8px;
    height: 8px;
    background: var(--vt-c-white-mute);
    margin-right: 1.5px;
    margin-left: -1.5px;
    border-radius: 4px;
    flex-shrink: 0;
    z-index: 4;
    top: -1.5px;
  }
  .point-1 {
    &::after, &::before {
      content: ' ';
      position: absolute;
      width: 1px;
      height: 6px;
      top: 1px;
      left: 3.5px;
      transform-origin: center;
      background: red;
    }
    &::after {
      // left: 2px;
      transform: rotate(45deg);
    }
    &::before {
      // right: 2px;
      transform: rotate(-45deg);
    }
  }
  .select-range {
    position: absolute;
    height: 5px;
    background: rgba(64, 158, 255, 0.8);
    top: 0px;
    border-radius: 2.5px;
    &.range {
      background: rgba(64, 158, 255, 1);
      z-index: 3;
    }
  }
}
</style>

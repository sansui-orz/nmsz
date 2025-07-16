import Big from 'big.js'
import eventBus from "./utils/eventBus.js"

let intervalKey = null
let lastUpdateTime = null
let lastSalary = 0
let showGrowUpTimes = 999
let lastText = ''

function getDailyWorkTime(setting) {
  let allTime = 0
  let passTime = 0
  let isWorking = false
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const day = now.getDate()
  setting.times.forEach(item => {
    const start = new Date(`${year}-${month}-${day} ${item.start}`)
    const end = new Date(`${year}-${month}-${day} ${item.end}`)
    if (now.getTime() > start.getTime()) {
      if (now.getTime() < end.getTime()) {
        passTime += now.getTime() - start.getTime()
        isWorking = true
      } else {
        passTime += end.getTime() - start.getTime()
      }
    }
    allTime += end.getTime() - start.getTime()
  })
  return {
    allTime,
    passTime,
    isWorking
  }
}

const padStart = (s) => `${s}`.length == 1 ? `0${s}` : s

function getWorkDaysInMonth(setting) {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const lastDay = new Date(year, month + 1, 0)
  const workingDays = []
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const day = new Date(year, month, i)
    const dayStr = `${year}-${padStart(month + 1)}-${padStart(i)}`
    if (setting.days[year] && setting.days[year][`${year}-${padStart(month + 1)}`] && setting.days[year][`${year}-${padStart(month + 1)}`].includes(dayStr)) {
      workingDays.push(day)
    }
  }
  return workingDays
}

function getTodayIsWorkingDay(setting) {
  const workingDays = getWorkDaysInMonth(setting)
  return workingDays.map(item => item.toDateString()).includes(new Date().toDateString())
}

function getDailySalary(setting) {
  const salary = new Big(setting.salary).div(getWorkDaysInMonth(setting).length)
  return salary
}

function getProgress(passTime, allTime, interval) {
  switch(interval)
  {
    case 'second':
      return new Big(Math.floor(passTime / 1000)).div(Math.floor(allTime / 1000))
    case 'min':
      return new Big(Math.floor(passTime / 60000)).div(Math.floor(allTime / 60000))
    case 'hour':
      return new Big(Math.floor(passTime / 3600000)).div(Math.floor(allTime / 3600000))
    default:
      return new Big(Math.floor(passTime / 1000)).div(Math.floor(allTime / 1000))
  }
}

function getNowSalary(progress, setting) {
  const dailySalary = getDailySalary(setting)
  const salary = new Big(dailySalary).times(progress)
  return salary.toFixed(1)
}

function getLastTime(interval) {
  const now = new Date().getTime()
  switch(interval)
  {
    case 'second':
      return Math.floor(now / 1000)
    case 'min':
      return Math.floor(now / 60000)
    case 'hour':
      return Math.floor(now / 3600000)
    default:
      return Math.floor(now / 1000)
  }
}

function run(setting) {
  const newLastTime = getLastTime(setting.interval)
  const todayIsWorkingDay = getTodayIsWorkingDay(setting)
  if (!todayIsWorkingDay) {
    eventBus.$emit('tray-control-lyrics', {
      text: '休息日',
      progress: 0,
      color: isWorking ? undefined : '#aaa',
      time: 2000,
    })
  } else if ((newLastTime !== lastUpdateTime || showGrowUpTimes <= 3)) {
    const { allTime, passTime, isWorking } = getDailyWorkTime(setting)
    const progress = getProgress(passTime, allTime, setting.interval)
    const salary = getNowSalary(progress, setting)
    let text = `¥${salary}`
    if (lastSalary != 0 && setting.interval !== 'second') {
      if (salary != lastSalary) {
        showGrowUpTimes = 0
        const salaryDiff = new Big(salary).minus(lastSalary)
        text = `+¥${salaryDiff.toFixed(1)}`
      } else if (showGrowUpTimes < 3) {
        showGrowUpTimes += 1
        return
      }
    }
    lastSalary = salary
    lastUpdateTime = newLastTime
    if (lastText !== text || showGrowUpTimes === 3) {
      lastText = text
      eventBus.$emit('tray-control-lyrics', {
        text: text,
        progress: Math.floor(progress * 10000) / 10000,
        color: isWorking ? undefined : '#aaa',
        time: 2000,
      })
    }
  }
  showGrowUpTimes += 1
}

export function startLoop(setting) {
  intervalKey = setInterval(() => {
    run(setting)
  }, 1000)
}

export function stopLoop() {
  clearInterval(intervalKey)
}

export function restartLoop(setting) {
  stopLoop()
  intervalKey = null
  lastUpdateTime = null
  lastSalary = 0
  showGrowUpTimes = 999
  lastText = ''
  startLoop(setting)
}

export default {
  startLoop,
  stopLoop,
  restartLoop
}
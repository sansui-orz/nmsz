import Store from 'electron-store';
import dataDays from './days.js'

const defaultData = {
  interval: 'min', // second, min, hour, 暂时写死1分钟更新一次
  autoLaunch: true,
  times: [
    {
      start: '09:00',
      end: '12:00'
    },
    {
      start: '14:00',
      end: '18:00'
    }
  ],
  salary: 10000,
  days: dataDays,
}

const store = new Store();

const settingKey = 'setting-v9'

export default {
  init() {
    if (!store.has(settingKey)) {
      store.set(settingKey, defaultData)
    }
  },
  getAll() {
    const data = store.get(settingKey)
    return data
  },
  getSetting() {
    if (!store.has(settingKey)) {
      store.set(settingKey, defaultData)
      return defaultData
    }
    const data = store.get(settingKey)
    return data
  },
  setSetting(data) {
    store.set(settingKey, data)
  },
  set(key, value) {
    store.set(key, value)
  }
}



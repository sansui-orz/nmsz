const eventPools = new Map()

export default {
  $on: (key, callback) => {
    if (eventPools.has(key)) {
      eventPools.get(key).push(callback)
    } else {
      eventPools.set(key, [callback])
    }
  },
  $emit: (key, ...args) => {
    if (eventPools.has(key)) {
      eventPools.get(key).forEach((callback) => callback(...args))
    }
  }
}
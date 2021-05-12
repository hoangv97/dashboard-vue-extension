export default {
    getLocalStorage(key, defaultVal = null) {
        let result = JSON.parse(window.localStorage.getItem(key))
        // console.log(result, key, defaultVal)
        if (!result) return defaultVal
        let {value, timeout, time} = result
        if (timeout === null) {
            return value
        }
        let diff = Math.abs(new Date() - new Date(time))
        // console.log(value, timeout, time, diff)
        if (diff < timeout) {
            return value
        } else {
            window.localStorage.removeItem(key)
            return defaultVal
        }
    },
    setLocalStorage(key, val, timeout = null) {
        let cacheValue = {
            value: val,
            timeout,
            time: new Date(),
        }
        window.localStorage.setItem(key, JSON.stringify(cacheValue))
    }
}
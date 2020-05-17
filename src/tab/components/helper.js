export default {
    getLocalStorage(key, defaultVal) {
        let val = JSON.parse(window.localStorage.getItem(key))
        // console.log(val, key, defaultVal)
        if (!val) return defaultVal
        return val
    },
    setLocalStorage(key, val) {
        window.localStorage.setItem(key, JSON.stringify(val))
    }
}
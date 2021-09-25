export default {
    getLocalStorage(key, defaultVal = null) {
        let result = JSON.parse(window.localStorage.getItem(key))
            // console.log(result, key, defaultVal)
        if (!result) return defaultVal
        let { value, timeout, time } = result
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
    },
    executeCode(code, lang) {
        chrome.tabs.getSelected(null, tab => {
            if (lang === 'css') {
                chrome.tabs.insertCSS(tab.id, { code });
            } else {
                chrome.tabs.executeScript(tab.id, { code });
            }
        });
    },
    copyCode(code, lang) {
        return new Promise((resolve) => {
            let text = code;
            if (lang === 'css') {
                text = `let style = document.createElement('style');
style.innerHTML = "${code}";
document.head.appendChild(style);`;
            }
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(function() {
                    /* clipboard successfully set */
                    resolve(true);
                }, function() {
                    /* clipboard write failed */
                });
            }
        })
    },
    getSyncStorage(key, defaultVal = null) {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get(key, function(result) {
                result = result[key] ? JSON.parse(result[key]) : null
                console.log(result, key, defaultVal)

                if (!result) {
                    return resolve(defaultVal);
                }
                const { value, timeout, time } = result;
                if (timeout === null) {
                    resolve(value);
                }
                const diff = Math.abs(new Date()) - new Date(time);
                // console.log(value, timeout, time, diff)
                if (diff < timeout) {
                    resolve(value);
                } else {
                    window.localStorage.removeItem(key);
                    resolve(defaultVal);
                }
            });
        });
    },
    setSyncStorage(key, val, timeout = null) {
        const items = {};
        items[key] = JSON.stringify({
            value: val,
            timeout, // in milliseconds
            time: new Date(),
        });
        console.log(items)
        chrome.storage.sync.set(items);
    },
}
import axios from 'axios';

export default {
  getLocalStorage(key, defaultVal = null) {
    let result = JSON.parse(window.localStorage.getItem(key));
    // console.log(result, key, defaultVal)
    if (!result) return defaultVal;
    let { value, timeout, time } = result;
    if (timeout === null) {
      return value;
    }
    let diff = Math.abs(new Date() - new Date(time));
    // console.log(value, timeout, time, diff)
    if (diff < timeout) {
      return value;
    } else {
      window.localStorage.removeItem(key);
      return defaultVal;
    }
  },
  setLocalStorage(key, val, timeout = null) {
    let cacheValue = {
      value: val,
      timeout,
      time: new Date(),
    };
    window.localStorage.setItem(key, JSON.stringify(cacheValue));
  },
  objectToHashKey(object) {
    const keys = Object.keys(object || {});
    keys.sort();
    const key = keys.map((key) => `${key}=${object[key]}`).join('&');

    let hash = 0;
    let chr;
    for (let i = 0; i < key.length; i++) {
      chr = key.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash + '';
  },
  async getApi(url, headers = {}, params = {}, cacheTimeout = null) {
    const cacheKey = this.objectToHashKey({ url, ...params });
    if (cacheTimeout) {
      const cacheResult = this.getLocalStorage(cacheKey);
      if (cacheResult) {
        console.log('get cached api', url, cacheTimeout);
        return cacheResult;
      }
    }
    try {
      console.log(url, headers, params, cacheTimeout);
      const response = await axios.get(url, { headers, params });
      if (response.status > 290) {
        return null;
      }
      const result = response.data;
      if (cacheTimeout) {
        this.setLocalStorage(cacheKey, result, cacheTimeout);
      }
      return result;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
  executeCode(code, lang) {
    chrome.tabs.getSelected(null, (tab) => {
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
        navigator.clipboard.writeText(text).then(
          function() {
            /* clipboard successfully set */
            resolve(true);
          },
          function() {
            /* clipboard write failed */
          }
        );
      }
    });
  },
  getSyncStorage(key, defaultVal = null) {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get(key, function(result) {
        result = result[key] ? JSON.parse(result[key]) : null;
        console.log(result, key, defaultVal);

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
    console.log(items);
    chrome.storage.sync.set(items);
  },
};

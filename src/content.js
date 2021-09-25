const key = 'ScriptExecutor_TableData';

function executeCode(code, lang) {
    console.log('exec code', lang, code);
    if (lang === 'css') {
        let style = document.createElement('style');
        style.innerHTML = code;
        document.head.appendChild(style);
    } else {
        eval(code);
    }
}

chrome.storage.sync.get(key, function(result) {
    result = result[key] ? JSON.parse(result[key]).value : [];

    const url = window.location.href;

    // console.log('content scripts', url, result);

    for (const script of result) {
        if (script.enabled) {
            const regex = new RegExp(script.url);
            if (regex.test(url)) {
                executeCode(script.code, script.lang);
            }
        }
    }
});
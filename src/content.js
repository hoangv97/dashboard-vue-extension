const POPUP_KEY = 'Popup_Config_Key';
const POPUP_CONTAINER_CLASS = 'my_startup_popup_dialog';

// PEN: https://codepen.io/viethoang012/pen/gOzervL

const POPUP_SCRIPT = `
<dialog class="my_startup_popup_dialog">
  <div class="close">✖</div>
  <div class="container">
    <textarea></textarea>
  </div>
</dialog>
`;

const POPUP_STYLE = `
.my_startup_popup_dialog {
  position: relative;
  padding: 15px;
  border: none;
  border-radius: 8px;
  box-shadow: 0px 2px 7px #afa8a8;
  width: 75%;
  min-height: 75%;
  box-sizing: border-box;
  font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol";
}
.my_startup_popup_dialog::backdrop {
  background-color: rgba(0, 0, 0, 0.1);
}
.my_startup_popup_dialog .close {
  cursor: pointer;
  position: absolute;
  top: 6px;
  right: 8px;
}
.my_startup_popup_dialog .container {
  width: 100%;
  margin: 10px 0 0 0;
}
.my_startup_popup_dialog .container textarea {
  display: block;
  width: 100%;
  resize: none;
  font: inherit;
  padding: 5px;
  box-sizing: border-box;
  border: 0px solid #ccc;
  background: transparent;
}
.my_startup_popup_dialog .container textarea:focus-visible {
  outline: none;
}
.my_startup_popup_dialog .container button {
  cursor: pointer;
  display: inline-block;
  position: relative;
  box-shadow: inset 2px 2px 2px 0px rgba(255, 255, 255, 0.5), 7px 7px 20px 0px rgba(0, 0, 0, 0.1), 4px 4px 5px 0px rgba(0, 0, 0, 0.1);
  outline: none;
  padding: 6px 14px;
  background-color: #89d8d3;
  background-image: linear-gradient(315deg, #89d8d3 0%, #03c8a8 74%);
  border: none;
  z-index: 1;
  color: #fff;
}
.my_startup_popup_dialog .container button:after {
  position: absolute;
  content: "";
  width: 100%;
  height: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
  border-radius: 5px;
  background-color: #4dccc6;
  background-image: linear-gradient(315deg, #4dccc6 0%, #96e4df 74%);
  box-shadow: -7px -7px 20px 0px #fff9, -4px -4px 5px 0px #fff9, 7px 7px 20px 0px #0002, 4px 4px 5px 0px #0001;
  transition: all 0.3s ease;
}
.my_startup_popup_dialog .container button:hover {
  background-color: #f00;
}
.my_startup_popup_dialog .container button:hover:after {
  top: 0;
  height: 100%;
}
.my_startup_popup_dialog .container button:active {
  top: 2px;
}
`;

function createPopup() {
  console.log('created popup');

  document.body.innerHTML += POPUP_SCRIPT;

  let style = document.createElement('style');
  style.innerHTML = POPUP_STYLE;
  document.head.appendChild(style);

  const dialog = document.querySelector(`.${POPUP_CONTAINER_CLASS}`);
  dialog
    .querySelector(`.${POPUP_CONTAINER_CLASS} .close`)
    .addEventListener('click', function() {
      dialog.close();
      document.body.style.overflow = 'auto';
    });
  dialog.showModal();
  document.body.style.overflow = 'hidden';

  const textarea = document.querySelector(`.${POPUP_CONTAINER_CLASS} textarea`);
  textarea.setAttribute(
    'style',
    'height:' + textarea.scrollHeight + 'px;overflow-y:hidden;'
  );
  textarea.addEventListener('input', onInput, false);

  function onInput() {
    this.style.height = 0;
    this.style.height = this.scrollHeight + 'px';
    console.log(this.value);
  }
}

// chrome.storage.sync.get(POPUP_KEY, function(result) {
//   result = result[POPUP_KEY]
//     ? JSON.parse(result[POPUP_KEY])
//         .value.split('\n')
//         .filter((v) => v)
//     : [];
//   const url = window.location.href;
//   console.log('content scripts', url, result);
//   for (const website of result) {
//     const regex = new RegExp(website);
//     if (regex.test(url)) {
//       createPopup();
//     }
//   }
// });

/**
 * Script Execution
 */

const SCRIPT_EXECUTOR_KEY = 'ScriptExecutor_TableData';

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

chrome.storage.sync.get(SCRIPT_EXECUTOR_KEY, function(result) {
  result = result[SCRIPT_EXECUTOR_KEY]
    ? JSON.parse(result[SCRIPT_EXECUTOR_KEY]).value
    : [];
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

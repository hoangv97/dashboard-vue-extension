
const API_URL_PREFIX = 'https://vh-tracker.herokuapp.com/api/'

const currentUrl = window.location.href;

const BLOCK_KEYWORDS = [
    
];

(async () => {
    for (const blockKeyword of BLOCK_KEYWORDS) {
        if(currentUrl.includes(blockKeyword)) {
            let response = await fetch(`${API_URL_PREFIX}flashcard/settings`);
            response = await response.json();
            let focusMode = false;
            const focusModeItem = (response || []).find(item => item.Key === 'focusMode');
            if (focusModeItem) {
                focusMode = focusModeItem.Value == 1;
            }
            if (focusMode) {
                window.location.href = 'http://localhost:8080';
            }
            break;
        }
    }
})();
  

const NOTION_BASE_URL = 'https://notion.so/'

const API_URL_PREFIX = 'https://vh-django.herokuapp.com/api/v1/'
const API_ACCESS_TOKEN = 'e28c7c23nsdhx87d32xd92x239dh23d87238x72'


// https://developer.chrome.com/docs/extensions/reference/contextMenus/

chrome.contextMenus.create({
    title: "Search in UrbanDictionary",
    contexts:["selection"],
    onclick: function(word) {
        const query = word.selectionText
        chrome.tabs.create({url: "http://www.urbandictionary.com/define.php?term=" + query});
    }
});

chrome.contextMenus.create({
    title: "Incognito this Tab",
    contexts:["page"],
    onclick: function(page) {
        chrome.windows.create({url: page.pageUrl, incognito: true});
    }
});

chrome.contextMenus.create({
    title: "Save to Dashboard",
    contexts:["page", "image"],
    onclick: async (info, tab) => {
        let data = {
            name: tab['title'],
            source: info['pageUrl'],
        };
        if (info['mediaType'] === 'image') {
            data['image'] = info['srcUrl'];
        }
        let response = await fetch(`${API_URL_PREFIX}dashboard/cards/`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': API_ACCESS_TOKEN,
            }
        });
        response = await response.json();
        const databaseId = response.databaseId.replaceAll('-', '');
        const pageId = response.id.replaceAll('-', '');
        const url = `${NOTION_BASE_URL}${databaseId}?p=${pageId}`;
        chrome.tabs.create({url});
    }
});

chrome.contextMenus.create({
    type: 'separator',
    contexts: ['all'],
});

chrome.contextMenus.create({
    title: "Inspect",
    contexts:["all"],
    onclick: function(info, tab) {
        alert(JSON.stringify(info) + '\n\n', JSON.stringify(tab));
    }
});

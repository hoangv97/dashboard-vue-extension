// https://developer.chrome.com/docs/extensions/reference/contextMenus/

chrome.contextMenus.create({
  title: 'Search in UrbanDictionary',
  contexts: ['selection'],
  onclick: function(word) {
    const query = word.selectionText;
    chrome.tabs.create({
      url: 'http://www.urbandictionary.com/define.php?term=' + query,
    });
  },
});

chrome.contextMenus.create({
  title: 'Incognito this Tab',
  contexts: ['page'],
  onclick: function(page) {
    chrome.windows.create({ url: page.pageUrl, incognito: true });
  },
});

chrome.contextMenus.create({
  title: 'Open in VSCode',
  contexts: ['page'],
  onclick: function(page) {
    const url = new URL(page.pageUrl);
    if (url.hostname.includes('github.com')) {
      chrome.tabs.create({
        url: `https://vscode.dev/github${url.pathname}`,
      });
    }
  },
});

chrome.contextMenus.create({
  type: 'separator',
  contexts: ['all'],
});

chrome.contextMenus.create({
  title: 'Inspect',
  contexts: ['all'],
  onclick: function(info, tab) {
    alert(JSON.stringify(info) + '\n\n', JSON.stringify(tab));
  },
});

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
  title: 'Save to Notion Reading',
  contexts: ['page'],
  onclick: function(page) {
    const url = new URL(page.pageUrl);
    fetch(
      `https://mysrs.netlify.app/.netlify/functions/cors?url=https://api.notion.com/v1/blocks/${process.env.NOTION_READING_ID}/children`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Notion-Version': '2022-06-28',
          Authorization: `Bearer ${process.env.NOTION_DASHBOARD_TOKEN}`,
        },
        body: JSON.stringify({
          children: [
            {
              object: 'block',
              type: 'bookmark',
              bookmark: { url },
            },
          ],
        }),
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        alert('Success');
      })
      .catch((error) => {
        alert(error);
      });
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

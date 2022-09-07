// helpers
function notionCall(path, method, body) {
  fetch(
    `https://mysrs.netlify.app/.netlify/functions/cors?url=https://api.notion.com/v1/${path}`,
    {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
        Authorization: `Bearer ${process.env.NOTION_DASHBOARD_TOKEN}`,
      },
      body: JSON.stringify(body),
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
}

function notionAppendBlockChildren(blockId, children) {
  notionCall(`blocks/${blockId}/children`, 'PATCH', { children });
}

function notionCreatePage(parent, properties, children) {
  notionCall(`pages`, 'POST', {
    parent,
    properties,
    children,
  });
}

const truncate = (input, length) =>
  input.length > length ? `${input.substring(0, length)}...` : input;

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
    notionAppendBlockChildren(process.env.NOTION_READING_ID, [
      {
        object: 'block',
        type: 'bookmark',
        bookmark: { url },
      },
    ]);
  },
});

chrome.contextMenus.create({
  title: 'Save to Notion Reading - Page',
  contexts: ['selection'],
  onclick: function(info, tab) {
    const text = info.selectionText;
    alert(text.split('\n'));
    notionCreatePage(
      {
        type: 'page_id',
        page_id: process.env.NOTION_READING_ID,
      },
      {
        title: [
          {
            text: {
              content: truncate(text, 50),
            },
          },
        ],
      },
      [
        {
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: text,
                },
              },
            ],
          },
        },
      ]
    );
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

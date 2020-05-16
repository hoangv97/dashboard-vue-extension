searchUrbanDict = function(word) {
    let query = word.selectionText;
    chrome.tabs.create({url: "http://www.urbandictionary.com/define.php?term=" + query});
}

goToIncognito = function(page) {
    chrome.windows.create({url: page.pageUrl, incognito: true})
}
  
chrome.contextMenus.create({
    title: "Search in UrbanDictionary",
    contexts:["selection"],
    onclick: searchUrbanDict
})

chrome.contextMenus.create({
    title: "Incognito this Tab",
    contexts:["page"],
    onclick: goToIncognito
});

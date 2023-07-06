chrome.tabs.onUpdated.addListener((tabId, tab) => {
  if (tab.url?.includes("https://excalidraw.com/")) {
    chrome.tabs.sendMessage(tabId, {
      type: "NEW",
      message: "Excalidraw tab opened",
    });
  }
});

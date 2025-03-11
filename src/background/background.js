browser.contextMenus.create(
  {
    id: "huenique",
    title: "Grab a color from the page",
    contexts: ["all"],
  },
  () => {
    console.log("Error:", browser.runtime.lastError);
  },
);

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== "huenique") return;

  try {
    await browser.scripting.executeScript({
      target: {
        tabId: tab.id,
      },
      func: () => {
        huenique();
      },
    });
  } catch (error) {
    console.error("failed to execute script:", error);
  }
});

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(request);

  return browser.tabs.captureVisibleTab().then(
    (imageUri) => {
      return imageUri;
    },
    (error) => {
      console.error("Error while trying to capture visible tab:", error);
    },
  );
});

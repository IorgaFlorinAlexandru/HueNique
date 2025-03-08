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
        colorPicker();
      },
    });
  } catch (error) {
    console.error("failed to execute script:", error);
  }
});

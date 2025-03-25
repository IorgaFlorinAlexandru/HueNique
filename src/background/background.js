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

  await executeScript(tab);
});

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  return browser.tabs.captureVisibleTab({ format: "jpeg", quality: 100, scale: 1 }).then(
    (imageUri) => {
      return imageUri;
    },
    (error) => {
      console.error("Error while trying to capture visible tab:", error);
    },
  );
});

browser.commands.onCommand.addListener(async (command, tab) => {
  if (command !== "huenique-command") return;

  await executeScript(tab);
});

async function executeScript(tab) {
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
}

"use strict";

async function refreshButtonState() {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });

  let icon = "icon.svg";
  let badgeText = "";

  if (tab && tab.url) {
    try {
      const url = new URL(tab.url);
      if (url.hostname.endsWith(".lan")) {
        icon = "icon-active.svg";
        badgeText = "LAN";
      }
    } catch (e) {
      // Ignore non-URL tabs.
    }
  }

  browser.browserAction.setIcon({ path: icon });
  browser.browserAction.setBadgeText({ text: badgeText });
  browser.browserAction.setBadgeBackgroundColor({ color: "#1e8e5a" });
}

async function switchCurrentTab(tab) {
  if (!tab || tab.id == null || !tab.url) {
    return;
  }

  let url;
  try {
    url = new URL(tab.url);
  } catch (e) {
    return; // about:blank, view-source: и т.п.
  }

  if ((url.protocol !== "http:" && url.protocol !== "https:") || !url.hostname) {
    return; // работаем только с http/https
  }

  if (url.hostname.endsWith(".lan")) {
    // Локальный домен → прод: убираем суффикс .lan и переводим на https
    url.protocol = "https:";
    url.hostname = url.hostname.slice(0, -".lan".length);
  } else {
    // Прод-домен → локальный: добавляем .lan и переводим на http
    url.protocol = "http:";
    url.hostname = url.hostname + ".lan";
  }

  await browser.tabs.update(tab.id, { url: url.href });
  await refreshButtonState();
}

browser.browserAction.onClicked.addListener(async (tab) => {
  await switchCurrentTab(tab);
});

browser.commands.onCommand.addListener(async (command) => {
  if (command !== "toggle-lan-switch") {
    return;
  }

  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  await switchCurrentTab(tab);
});

browser.tabs.onActivated.addListener(async () => {
  await refreshButtonState();
});

browser.tabs.onUpdated.addListener(async () => {
  await refreshButtonState();
});

refreshButtonState();

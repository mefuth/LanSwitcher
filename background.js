"use strict";

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

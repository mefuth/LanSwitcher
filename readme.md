# LanSwitcher

Расширение для Firefox. Переключает текущую вкладку между прод-доменом и локальным:

- `https://example.com/...` ⇄ `http://example.com.lan/...`
- Путь, query-параметры и hash сохраняются.
- Если хост уже заканчивается на `.lan` — суффикс убирается, схема меняется на `https://`.
- Иначе добавляется `.lan`, схема меняется на `http://`.

Пример:
`https://example.com/index.html?var1&var2=2` → `http://example.com.lan/index.html?var1&var2=2`

## Файлы

- `manifest.json` — описание расширения (Manifest V2)
- `background.js` — обработчик клика по кнопке на панели инструментов
- `icon.svg` — иконка

## Установка (временная, для разработки)

1. Открой Firefox.
2. В адресной строке введи `about:debugging#/runtime/this-firefox`.
3. Нажми **Load Temporary Add-on…** (Загрузить временное дополнение).
4. Выбери файл `manifest.json` из этой папки.
5. На панели инструментов появится кнопка LanSwitcher. Нажми её — текущая вкладка переключится между `https://домен` и `http://домен.lan`.

> Временное дополнение удаляется после перезапуска Firefox. Для постоянной установки нужно подписать расширение на [addons.mozilla.org](https://addons.mozilla.org), либо использовать Firefox Developer Edition / Nightly с `xpinstall.signatures.required = false`.

## Упаковка в .xpi

```bash
cd LanSwitcher
zip -r lanswitcher.xpi manifest.json background.js icon.svg
```
(для установки в обычный Firefox всё равно нужна подпись)

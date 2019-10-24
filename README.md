# skigo

## 開發環境
* Node `12.13.0`
* NPM  `6.12.0`

## 目錄結構說名
- src `Server部分的 source code`
- bin `執行檔、`
- public `靜態資源 （圖片, 頁面用的 js/css）`

## 專案初始化步驟
1. 開發環境 - 先確認 node/npm 安裝好了，並且版本一致（確認方式：在終端機執行 `npm -v` / `node -v` 可以看到當前版本）
2. 下載專案 - 終端機執行 `git clone <repository>`
3. 安裝專案所需套件 - 終端機執行 `cd <path/to/project>` 進入專案目錄，再執行 `npm install` 開始安裝
4. 啟動 Server - 終端機執行 `npm start`，看到 `Server started, listening on port xxxx` 代表啟動成功 :tada::tada::tada:

## 開發方式
- `npm start` 會使用 `nodemon` 啟動 Server，任何副檔名為 `js / mjs / json` 檔案發生變更，Server會自動重啟，不用手動重啟

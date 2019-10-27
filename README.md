# skigo

## 開發環境

- Node `10.16.x`
- NPM `6.9.0`

## 目錄結構說明

- src `Server部分的 source code`
- public `靜態資源（HTML, 圖片, 頁面用的 js/css）`
- views `.ejs file`

## 專案初始化步驟

1. 開發環境 - 先確認 node/npm 安裝好了，並且版本一致（確認方式：在終端機執行 `npm -v` / `node -v` 可以看到當前版本）
2. 下載專案 - 終端機執行 `git clone <repository>`
3. 安裝專案所需套件 - 終端機執行 `cd <path/to/project>` 進入專案目錄，再執行 `npm install` 開始安裝
4. 啟動 Server - 終端機執行 `npm start`，看到 `Server started, listening on port xxxx` 代表啟動成功 :tada::tada::tada:

## 開發方式

- `npm start` 會使用 [nodemon](https://andy6804tw.github.io/2017/12/24/nodemon-tutorial/) 啟動 Server，任何副檔名為 `js / mjs / json` 檔案發生變更，Server 會自動重啟，不用手動重啟

## VS Code 插件

### ESLint

程式碼格式檢查，目前使用 [airbnb 規範](https://github.com/airbnb/javascript); 如果不符合，vs code 會提示錯誤，請依照提示修改

```安裝方式：
1. 打開 vs code
2. 按下 Ctrl + Shift + X (Windows) / Command + Shift + X (Mac)
3. 搜尋框輸入 ESLint
4. install
5. 設定檔請看 .eslintrc.json
```

### Prettier - Code formatter

自動格式化工具

```安裝方式：
1. 打開 vs code
2. 鍵盤按 Ctrl-Shift-X (Windows) / Command-Shift-X (Mac)
3. 搜尋框輸入 Prettier - Code formatter
4. install
5. 設定檔請看 .prettierrc
預設快捷鍵： Ctrl-Shift-S (Windows) / Command-Shift-S (Mac)
```

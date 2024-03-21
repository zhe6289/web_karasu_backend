# 更新說明
1. 開發環境
```
npm i
npm run start:dev
```
2. 測試環境
```
npm i
//用 pm2 delete {id} 先刪除原本運行中的 Nest Server
pm2 start ecosystem.config.js --env test
pm2 save
```
3. 正式環境
```
npm i
//用 pm2 delete {id} 先刪除原本運行中的 Nest Server
pm2 start ecosystem.config.js --env production
pm2 save
```
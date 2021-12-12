// 由於 Mongoose 連線是屬於專案的環境設定 (configuration)，所以我們習慣將其歸入一個叫 config 的資料夾。
// 本來Mongoose的連線設定是寫在app.js以及seeder.js中，一樣的東西寫了二次，且後續要修改時要修改二個地方，容易遺漏，因此獨立一支檔案出來寫，再於需要用到Mongoose連線的地方引用。

// 載入Mongoose
const mongoose = require('mongoose')
// 定義資料庫連線狀態
const dataBase = mongoose.connection
mongoose.connect('mongodb://localhost/restaurant_list', { useNewUrlParser: true, useUnifiedTopology: true })

dataBase.on('error', () => {
  console.log('MongoDB error')
})

dataBase.once('open', () => {
  console.log('MongoDB connected')
})

// 匯出變數dataBase，在seeder.js中會用到。
module.exports = dataBase
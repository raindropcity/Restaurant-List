// 從node module中載入Express與Express-Handlebars
const express = require('express')
const exphbs = require('express-handlebars')
// 引用method-override套件，它是Express的中介軟體，中介軟體是在request傳進來時進行處理流程，再接續到response的套件(例如body-parser也是中介軟體)。
// 由於HTML中的<form>的method屬性只有GET或POST，無法使用RESTful風格的路由設計方式，因此使用method-override將應使用PUT、DELETE等HTTP動詞的路由，從GET或POST覆蓋為PUT或DELETE等原生HTML元素不支援的動詞。
const methodOverride = require('method-override')
const app = express()

// 載入list.js
const List = require('./models/list')

// Define localhost ralated variables
const port = 3000

// 引用Mongoose連線設定。這邊沒有將require存入const中，是因為mongoose.js中所寫的module.exports匯出的東西是dataBase，是要給seeder.js使用的，且app.js裡後續也沒有要再用到此連線設定。因此這邊直接寫require('./config/mongoose')，代表在執行app.js時一併執行mongoose.js。
require('./config/mongoose')
// 引入路由器時，路徑設定為 /routes 就會自動去尋找目錄下叫做 index 的檔案。
const routes = require('./routes')

// 告訴Express模板引擎要使用Handlebars
// app.engine()解釋：定義要使用的樣板引擎。第一個參數是這個樣板引擎的名稱(就是副檔名)；第二個參數是放入和此樣板引擎相關的設定。這裡設定了預設的佈局(default layout)需使用名為main的檔案。 所以Express會去抓main.handlebars這支檔案。
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
// 透過app.set()告訴Express說要設定的view engine是handlebars
app.set('view engine', 'handlebars')

// 靜態檔案所在的資料夾 & 使用body-parser所提供的解析URL方法
// 告訴 Express 靜態檔案是放在名為 public 的資料夾中，它不必針對這個資料夾內的檔案做什麼，只要產生對應的路由讓我們可以使用就好
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

// _method是method-override的一個參數。用途是在HTML元素中的路由設定裡加入「?_method=DELETE」(見index.hbs頁面中DELETE按鈕的<form>的action設定)，method-override會幫我們將「?_method」後面的內容(這邊是以DELETE為例)轉換成controller頁(就是app.js)所設定的HTTP方法(以app.delete()為例)。
app.use(methodOverride('_method'))

// routes是上面設定的變數，用來存放「總路由(/routes/index.js)」。而總路由用來整合各種頁面、功能所需的路由分支。
// 例如「首頁」路由設定於/routes/modules/home.js中；「CRUD」路由設定於/routes/modules/todos中。之後一併匯總到總路由/routes/index.js，於此(app.js)引用之。
app.use(routes)

// 監聽並啟動伺服器
app.listen(port, () => {
  console.log(`Restaurant list server started on localhost:${port}!`)
})
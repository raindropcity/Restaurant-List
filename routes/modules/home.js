// /routes/modules/home.js這支檔案用來設定「首頁」路由。之後匯出路由，於「總路由」/routes/index.js這支檔案中引用。

const express = require('express')
// Express中專門用於設定路由器的方法
const router = express.Router()
// 引用「上一層的上一層的models資料夾中的list.js檔案」
const List = require('../../models/list')

router.get('/', (req, res) => {
  List.find().lean().then((lists) => {
    // res.render()是指Express會「回傳HTML來呈現前端樣板」
    res.render('index', { lists: lists })
  })
    .catch((error) => { console.log(error) })
})

// 匯出路由給「總路由(/routes/index.js)」去引用
module.exports = router
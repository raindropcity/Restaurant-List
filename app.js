// 從node module中載入Express與Express-Handlebars
const express = require('express')
const exphbs = require('express-handlebars')
const restaurantList = require('./restaurant.json')
const app = express()

// 載入list.js
const List = require('./models/list')

// Define localhost ralated variables
const port = 3000

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

// 告訴Express模板引擎要使用Handlebars
// app.engine()解釋：定義要使用的樣板引擎。第一個參數是這個樣板引擎的名稱(就是副檔名)；第二個參數是放入和此樣板引擎相關的設定。這裡設定了預設的佈局(default layout)需使用名為main的檔案。 所以Express會去抓main.handlebars這支檔案。
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
// 透過app.set()告訴Express說要設定的view engine是handlebars
app.set('view engine', 'handlebars')

// 靜態檔案所在的資料夾 & 使用body-parser所提供的解析URL方法
// 告訴 Express 靜態檔案是放在名為 public 的資料夾中，它不必針對這個資料夾內的檔案做什麼，只要產生對應的路由讓我們可以使用就好
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

// 設定路由
app.get('/', (req, res) => {
  List.find().lean().then((lists) => {
    // res.render()是指Express會「回傳HTML來呈現前端樣板」
    res.render('index', { lists: lists })
  })
    .catch((error) => { console.log(error) })

})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim()
  const restaurants = restaurantList.results.filter(restaurant => {
    return restaurant.name.toLowerCase().includes(keyword.toLowerCase()) || restaurant.category.includes(keyword)
  })
  res.render('index', { restaurants: restaurants, keyword: keyword })

  // const restaurants = List.find().filter(restaurant => {
  //   return restaurant.name.toLowerCase().includes(keyword.toLowerCase()) || restaurant.category.includes(keyword)
  // })
  // res.render('index', { restaurants: restaurants, keyword: keyword })
})

// 瀏覽一筆資料
app.get('/restaurants/:restaurant_id', (req, res) => {
  const id = req.params.restaurant_id
  return List.findById(id)
    .lean()
    .then((restaurant) => { res.render('show', { restaurantList: restaurant }) })
    .catch((error) => { console.log(error) })
})

// 新增一筆資料
app.get('/restaurants/lists/new', (req, res) => {
  // 按「推薦餐廳」按鈕時，render new.hbs
  res.render('new')
})

app.post('/restaurants/lists', (req, res) => {
  const body = req.body
  return List.create({
    name: body.name,
    name_en: body.nameEn,
    category: body.category,
    image: body.image,
    location: body.location,
    phone: body.phone,
    google_map: body.googleMap,
    rating: body.rating,
    description: body.description
  })
    .then(() => { res.redirect('/') })
    .catch((error) => { console.log(error) })
})

// 修改一筆餐廳資料
app.get('/restaurants/lists/:restaurant_id/edit', (req, res) => {
  const id = req.params.restaurant_id
  return List.findById(id)
    .lean()
    .then((restaurant) => { res.render('edit', { restaurantList: restaurant }) })
    .catch((error) => { console.log(error) })
})

app.post('/restaurants/lists/:restaurant_id/edit', (req, res) => {
  const id = req.params.restaurant_id
  const body = req.body
  return List.findById(id)
    .then((restaurant) => {
      restaurant.name = body.name;
      restaurant.nameEn = body.nameEn;
      restaurant.category = body.category;
      restaurant.image = body.image;
      restaurant.location = body.location;
      restaurant.phone = body.phone;
      restaurant.googleMap = body.googleMap;
      restaurant.rating = body.rating;
      restaurant.description = body.description;
      return restaurant.save()
    })
    .then(() => { res.redirect(`/restaurants/${id}`) })
    .catch((error) => { console.log(error) })
})

// 刪除一筆特定資料
app.post('/restaurants/lists/:restaurant_id/delete', (req, res) => {
  const id = req.params.restaurant_id
  return List.findById(id)
    .then((restaurant) => restaurant.remove())
    .then(() => { res.redirect('/') })
    .catch((error) => { console.log(error) })
})

// 監聽並啟動伺服器
app.listen(port, () => {
  console.log(`Restaurant list server started on localhost:${port}!`)
})
// /routes/modules/todos.js這支檔案用來設定「CRUD」路由。之後匯出路由，於「總路由」/routes/index.js這支檔案中引用。

const express = require('express')
// Express中專門用於設定路由器的方法
const router = express.Router()
// 引用「上一層的上一層的models資料夾中的list.js檔案」
const List = require('../../models/list')

// 搜尋資料
router.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim()
  // const restaurants = restaurantList.results.filter(restaurant => {
  //   return restaurant.name.toLowerCase().includes(keyword.toLowerCase()) || restaurant.category.includes(keyword)
  // })
  // res.render('index', { restaurants: restaurants, keyword: keyword })

  List.find().lean().then((collection) => {
    const foundArray = collection.filter((restaurant) => {
      return restaurant.name.toLowerCase().includes(keyword.toLowerCase()) || restaurant.category.includes(keyword.toLowerCase())
    })
    res.render('index', { lists: foundArray, keyword: keyword })
  })
})

// 瀏覽一筆資料
router.get('/:restaurant_id', (req, res) => {
  const id = req.params.restaurant_id
  return List.findById(id)
    .lean()
    .then((restaurant) => { res.render('show', { restaurantList: restaurant }) })
    .catch((error) => { console.log(error) })
})

// 新增一筆資料
router.get('/lists/new', (req, res) => {
  // 按「推薦餐廳」按鈕時，render new.hbs
  res.render('new')
})

router.post('/lists', (req, res) => {
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
router.get('/lists/:restaurant_id/edit', (req, res) => {
  const id = req.params.restaurant_id
  return List.findById(id)
    .lean()
    .then((restaurant) => { res.render('edit', { restaurantList: restaurant }) })
    .catch((error) => { console.log(error) })
})

router.put('/lists/:restaurant_id', (req, res) => {
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
router.delete('/lists/:restaurant_id', (req, res) => {
  const id = req.params.restaurant_id
  return List.findById(id)
    .then((restaurant) => restaurant.remove())
    .then(() => { res.redirect('/') })
    .catch((error) => { console.log(error) })
})

// 匯出路由給「總路由(/routes/index.js)」去引用
module.exports = router
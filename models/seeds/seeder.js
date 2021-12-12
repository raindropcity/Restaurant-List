// 引用/config/mongoose.js後的寫法
// 在/config/mongoose.js中有寫好的東西，在這邊直接引用就行，不用再寫一次。
// 因為seeder.js是為了先建立一組種子資料存入資料庫，因此Mongoose連線成功的執行區域中有寫個for迴圈搭配create()來生成種子資料。也就是這部分跟/config/mongoose.js所寫內容不同，不可以省略。
const dataBase = require('../../config/mongoose')
const List = require('../list')
const restaurantList = require('./restaurant.json')

dataBase.once('open', () => {

  for (let i = 0; i < restaurantList.results.length; i++) {
    List.create({
      name: restaurantList.results[i].name,
      name_en: restaurantList.results[i].name_en,
      category: restaurantList.results[i].category,
      image: restaurantList.results[i].image,
      location: restaurantList.results[i].location,
      phone: restaurantList.results[i].phone,
      google_map: restaurantList.results[i].google_map,
      rating: restaurantList.results[i].rating,
      description: restaurantList.results[i].description
    })
  }

  console.log('done.')
})


import 'dotenv/config'
import mongoose from 'mongoose'
import express from 'express'
import mongoSanitize from 'express-mongo-sanitize'
import cors from 'cors'

import productsRoute from './router/product.js'
import usersRoute from './router/users.js'

mongoose.connect(process.env.DB_URL)
// 所有語法都可以使用，內建防止資料庫攻擊
mongoose.set('sanitizeFilter', true)

const app = express()

app.use(cors())

app.use(express.json())
app.use((_, req, res, next) => {
  res.status(400).json({ success: false, message: '資料格式錯誤' })
})

app.use(mongoSanitize())

// 所有進到 /products 這個路徑的請求，都會由 productsRoute 處理，都會跳到./router/products.js
app.use('/products', productsRoute)
app.use('/users', usersRoute)

app.all('*', (req, res) => {
  res.status(404).json({ success: false, message: '找不到' })
})

app.listen(process.env.PORT || 4000, () => {
  console.log('伺服器開啟')
})

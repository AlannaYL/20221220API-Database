import users from '../models/users.js'
import products from '../models/products.js'

export const createUser = async (req, res) => {
  try {
    let result = await users.create(req.body)
    // 將查詢結果的 mongoose Document 物件轉為一般的 {}
    result = result.toObject()
    // 移除密碼欄位
    delete result.password
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).json({ success: false, message })
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(409).json({ success: false, message: '帳號已使用' })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

export const addCart = async (req, res) => {
  try {
    // 用 ID 尋找有無使用者
    // findByid(req.params.id) 取出的資料是 mongoose 的 docutment
    //  '-password -account' 拿掉密碼欄位 跟 { password: 0 } 不會顯示密碼
    const user = await users.findById(req.params.id, 'cart')
    if (!user) {
      res.status(404).json({ sucess: false, message: '找不到使用者' })
      return
    }
    // 檢查有無指定商品
    const product = await products.findById(req.body.product)
    if (!product) {
      res.status(404).json({ success: false, message: '找不到商品' })
      return
    }
    // 找使用者的購物車陣列內有沒有商品
    const idx = user.cart.findIndex(product => product.p_id.toString() === req.body.product)
    if (idx === -1) {
    // 購物車內沒有就新增
      user.cart.push({ p_id: req.body.product, quantity: req.body.quantity })
    } else {
      // 購物車內有就改數量
      user.cart[idx].quantity = req.body.quantity
    }
    await user.save()
    res.status(200).json({ success: true, message: '', result: user })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).json({ success: false, message })
    } else if (error.name === 'CastError') {
      res.status(400).json({ success: false, message: 'ID 格式錯誤' })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

export const getUser = async (req, res) => {
  try {
    const result = await users.findById(req.params.id, '-password').populate('cart.p_id')
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400).json({ success: false, message: 'ID 格式錯誤' })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

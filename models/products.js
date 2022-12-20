import { Schema, model } from 'mongoose'

// 商品欄位定義
const schema = new Schema({
  name: {
    type: String,
    required: [true, '缺少商品名稱']
  },
  price: {
    type: Number,
    required: [true, '缺少商品價格'],
    min: [0, '商品價格不能小於 0 ']
  },
  category: {
    type: String,
    required: [true, '缺少商品分類'],
    // enum 限制欄位的值只能是陣列裡面的其中一個
    enum: {
      values: ['皮件', '鞋', '飾品', '衣服', '遊戲', '3C'],
      // {VALUE} 固定會自動被取代成傳入的值
      message: '沒有{VALUE}這個分類'
    }
  }
}, { versionKey: false })

export default model('products', schema)

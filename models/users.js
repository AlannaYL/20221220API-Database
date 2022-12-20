import { Schema, model, ObjectId, Error } from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'

const cartSchema = new Schema({
  p_id: {
    type: ObjectId,
    // 代表這裡放的是來自 products 的 _id
    ref: 'products',
    required: [true, '缺少商品 ID']
  },
  quantity: {
    type: Number,
    min: [0, '數量不能小於 0'],
    required: [true, '缺少商品數量']
  }
}, { versionKey: false })

const schema = new Schema({
  account: {
    type: String,
    required: [true, '缺少帳號'],
    minlength: [4, '帳號最少 4 個字'],
    maxlength: [20, '帳號最多 20 個字'],
    unique: true,
    validate: {
      validator (value) {
        return validator.isAlphanumeric(value)
      },
      message: '帳號只能是英數字'
    }
  },
  password: {
    type: String,
    required: true
  },
  cart: {
    // 資料型態是陣列，陣列每個東西的格式都是 cartSchema
    type: [cartSchema]
  }
}, { versionKey: false })

schema.pre('save', function (next) {
  // this 代表正要保存的資料
  const user = this
  // 如果密碼欄位有更改
  if (user.isModified('password')) {
    if (user.password.length >= 4 && user.password.length <= 20) {
      user.password = bcrypt.hashSync(user.password, 10)
    } else {
      // 產生一個 Mongoose(格式) 的驗證錯誤
      const error = new Error.ValidationError(null)
      error.addError('password', new Error.ValidatorError({ message: '密碼長度錯誤' }))
      next(error)
      return
    }
  }
  next()
})

schema.pre('findOneAndUpdate', function (next) {
  // this._update 代表正要保存的資料
  const user = this._update
  if (user.isModified('password')) {
    if (user.password.length >= 4 && user.password.length <= 20) {
      user.password = bcrypt.hashSync(user.password, 10)
    } else {
      // 產生一個 Mongoose 的驗證錯誤
      const error = new Error.ValidationError(null)
      error.addError('password', new Error.ValidatorError({ message: '密碼長度錯誤' }))
      next(error)
      return
    }
  }
  next()
})

export default model('users', schema)

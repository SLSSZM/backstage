const mongoose = require('../index');

const Goods = mongoose.model('Good', new mongoose.Schema({
  add_time: {
    type: Number,
    default: new Date().getTime()
  },
  cat_id: {
    type: Number,
    default: null
  },
  cat_one_id: {
    type: Number,
    default: null
  },
  cat_two_id: {
    type: Number,
    default: null
  },
  cat_three_id: {
    type: Number,
    default: null
  },
  goods_id: {
    type: Number
  },
  goods_name: {
    type: String
  },
  goods_number: {
    type: Number
  },
  goods_price: {
    type: Number
  },
  goods_state: {
    type: Number,
    default: null
  },
  goods_weight: {
    type: Number
  },
  goods_cat: {
    type: String
  },
  is_promote: {
    type: Object,
    default: false
  },
  upd_time: {
    type: Number,
    default: new Date().getTime()
  },
  hot_mumber: {
    type: Number,
    default: 0
  },
  pics: {
    type: Array
  },
  goods_instroduce: {
    type: String
  },
  attrs: {
    type: Array
  }
}))

module.exports = Goods;
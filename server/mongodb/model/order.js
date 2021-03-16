const mongoose = require('../index');

const Orders = mongoose.model('Order', mongoose.Schema({
  consignee_addr: {
    type: String
  },
  create_time: {
    type: Number,
    default: new Date().getTime()
  },
  is_send: {
    type: String,
    default: '否'
  },
  order_fapiao_company: {
    type: String,
    default: ''
  },
  order_fapiao_content: {
    type: String,
    default: ''
  },
  order_fapiao_title: {
    type: String,
    default: ''
  },
  order_id: {
    type: Number
  },
  order_number: {
    type: String
  },
  order_pay: {
    type: String,
    default: '0'
  },
  order_price: {
    type: Number
  },
  pay_status: {
    type: String,
    default: '0'
  },
  trade_no: {
    type: String
  },
  user_id: {
    type: Number
  },
  update_time: {
    type: Number,
    default: new Date().getTime()
  }
}));

module.exports = Orders;
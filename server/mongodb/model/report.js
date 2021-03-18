const mongoose = require('../index');
const Report = mongoose.model('Report', mongoose.Schema({
  legend: {
    type: Object,
    default: {}
  },
  series: {
    type: Array,
    default: []
  },
  xAxis: {
    type: Array,
    default: []
  },
  yAxis: {
    type: Array,
    default: []
  }
}));
module.exports = Report;
const express = require('express');
const reportRouter = express.Router();
const reportCollection = require('../../mongodb/model/report');

reportRouter.get('/api/report', async (req, res) => {
  const data = await reportCollection.findOne({});
  const areaStyle = { normal: {} };
  data.series.forEach(item => {
    item.areaStyle = areaStyle;
  })
  // console.log(data.series[0]);
  if (!data) {
    return res.send({ meta: { status: 403, msg: '失败' } });
  }
  res.send({ data, meta: { status: 201, msg: '成功' } });

})

module.exports = reportRouter;
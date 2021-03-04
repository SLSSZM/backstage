const mongoose = require('../index');

const CountersSchema = mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  sequence: {
    type: Number,
    default: 0
  }
});

const Counter = mongoose.model('counter', CountersSchema);

Counter.addId = async () => {
  const id = await Counter.findByIdAndUpdate(
    { _id: 'counters' },
    { $inc: { sequence: 1 } },
    { new: true, upsert: true }
  );
  return id.sequence;
}


module.exports = Counter;
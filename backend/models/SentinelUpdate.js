var mongoose = require('mongoose');

var SentinelUpdateSchema = new mongoose.Schema({
  date: {type: Date, default: Date.now},
  status: { type: String, enum: ['PENDING', 'IN_PROGRESS', 'DONE', 'ERROR'], default: 'PENDING' },
});

var SentinelUpdate = mongoose.model('SentinelUpdate', SentinelUpdateSchema);

SentinelUpdate.lastSuccessfulUpdate = function() {

  return this.model('SentinelUpdate')
    .findOne({status: 'DONE'})
    .sort({'date': -1})
    .exec();

}

module.exports = SentinelUpdate;
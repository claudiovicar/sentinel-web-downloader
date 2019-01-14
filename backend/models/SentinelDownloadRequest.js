var mongoose = require('mongoose');

/**
 * TODO: Comentários
 */
var SentinelDownloadRequestSchema = new mongoose.Schema({
  bands: { type: String },
  outputFormat: { type: String },
  status: { type: String, enum: ['QUEUED', 'IN_PROGRESS', 'DONE', 'ERROR'], default: 'QUEUED' },
  scene: { type: mongoose.Schema.Types.ObjectId, ref: 'SentinelScene' },
  requestDate: { type: Date, default: Date.now },
  finishDate: { type: Date }
});

var SentinelDownloadRequest = mongoose.model('SentinelDownloadRequest', SentinelDownloadRequestSchema);

module.exports = SentinelDownloadRequest;

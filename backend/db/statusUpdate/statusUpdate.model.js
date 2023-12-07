const mongoose = require('mongoose');
const StatusUpdateSchema = require('./statusUpdate.schema');

const StatusUpdate = mongoose.model('StatusUpdate', StatusUpdateSchema);

module.exports = StatusUpdate;

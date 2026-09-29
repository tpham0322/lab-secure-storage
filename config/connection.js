const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI);

module.exports = mongoose.connection;
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Device = new Schema({
  os: String,
  temp: String,
  cpu: String,
  memory: String,
  in: String,
  out: String,
  time: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Device', Device)

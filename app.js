require('dotenv').config()
const express = require('express')
const app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
// const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const port = process.env.PORT || 9999

// var data = {
//   cpu: 1,
//   os: 'mac',
//   temp: 20,
//   memory: 100,
//   in: 10,
//   out: 20,
//   interfaces: []
// }

mongoose.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/snmp`, { })
const Device = require('./models/Device')

app.get('/devices', (request, response) => {
  Device.find().then(devices => {
    response.json({devices})
  })
})
app.post('/device', (request, response) => {
  // Device.find().then(devices => {
  //   response.json({devices})
  // })
  let m = new Device({
    cpu: 1,
    os: 'mac',
    temp: 20,
    memory: 100,
    in: 10,
    out: 20,
    interfaces: []
  })
  m.save().then((res) => {
    console.log(res)
    if (res) {
      let s = res._id.toString()
      console.log(s)
      let timestamp = s.substring(0, 8)
      console.log(timestamp)
      let date = new Date(parseInt(timestamp, 16) * 1000)
      console.log(date)
    }
  })
  // if (io) {
  //   io.sockets.emit('update device', device)
  // }
  response.send()
})

var snmp = require('net-snmp')
var session = snmp.createSession('10.4.15.1', 'private')
// os, temp, cpu %, mem, in, out
var lists = [
  {
    oid: '1.3.6.1.2.1.1.1.0',
    key: 'os'
  }, {
    oid: '1.3.6.1.4.1.9.9.13.1.3.1.3.1008',
    key: 'temp'
  }, {
    oid: '1.3.6.1.4.1.9.9.109.1.1.1.1.5.1',
    key: 'cpu'
  }, {
    oid: '1.3.6.1.4.1.9.9.48.1.1.1.5.1',
    key: 'memmory'
  }, {
    oid: '1.3.6.1.2.1.2.2.1.10.1',
    key: 'in'
  }, {
    oid: '1.3.6.1.2.1.2.2.1.16.1',
    key: 'out'
  }]
var oids = lists.map(list => list.oid)
// .1.3.6.1.2.1.2.2.1.7
// setInterval(() => {
//   session.get(oids, function (error, varbinds) {
//     if (error) {
//       console.error(error)
//     } else {
//       let device = {}
//       for (var i = 0; i < varbinds.length; i++) {
//         if (snmp.isVarbindError(varbinds[i])) console.error(snmp.varbindError(varbinds[i]))
//         else {
//           let list = lists.find(list => list.oid === varbinds[i].oid)
//           if (list) {
//             console.log(list.key + ' : ' + varbinds[i].oid + ' = ' + varbinds[i].value)
//             device.key = varbinds[i].value
//           }
//         }
//       }
//       if (device !== {}) {
//         let m = new Device(device)
//         m.save()
//         io.sockets.emit('update device', device)
//       }
//     }
//     session.close()
//   })
// }, 30000)

io.on('connection', function (socket) {
  Device.find().then(devices => {
    socket.emit('init device', devices)
  })
})

// setInterval(() => {
//   io.sockets.emit('update data', data)
// }, 10000)

http.listen(port, function () {
  console.log('listening on *:', port)
})
console.log('Server is running on port: ' + port)

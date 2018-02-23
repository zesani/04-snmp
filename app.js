require('dotenv').config()
const express = require('express')
const app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)


// const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const port = process.env.PORT || 9999
var mockDevices = []
var interfaces = []
// var data = {
//   cpu: 1,
//   os: 'mac',
//   temp: 20,
//   memory: 100,
//   in: 10,
//   out: 20,
//   interfaces: []
// }

// mongoose.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/snmp`, { })
const Device = require('./models/Device')

app.get('/devices', (request, response) => {
  Device.find().then(devices => {
    response.json({devices})
  })
})
io.on('connection', function (socket) {
  // Device.find().then(devices => {
  //   socket.emit('init device', devices)
  // })
  socket.emit('init device', mockDevices)
  socket.emit('all interface', interfaces)
  socket.on('change interface', function (data) {
    console.log(data)
    changeInterface(data.index, data.value)
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

// var snmp = require('net-snmp')
/* var session = snmp.createSession('10.4.15.211', 'private', {
  port: 161,
  retries: 1,
  timeout: 5000,
  transport: "udp4",
  trapPort: 162,
  version: snmp.Version2c,
  idBitsSize: 16
}) */
var snmp = require('snmp-native')
var session = new snmp.Session({ host: '10.4.15.211', port: 161, community: 'private' });
// os, temp, cpu %, mem, in, out
var lists = [
  {
    oid: [1, 3, 6, 1, 2, 1, 1, 1, 0],
    key: 'os'
  }, {
    oid: [1, 3, 6, 1, 4, 1, 9, 9, 13, 1, 3, 1, 3, 1008],
    key: 'temp'
  }, {
    oid: [1, 3, 6, 1, 4, 1, 9, 9, 109, 1, 1, 1, 1, 5, 1],
    key: 'cpu'
  }, {
    oid: [1, 3, 6, 1, 4, 1, 9, 9, 48, 1, 1, 1, 5, 1],
    key: 'memory'
  }, {
    oid: [1, 3, 6, 1, 2, 1, 2, 2, 1, 10, 1],
    key: 'in'
  }, {
    oid: [1, 3, 6, 1, 2, 1, 2, 2, 1, 16, 1],
    key: 'out'
  }]
var oids = lists.map(list => list.oid)
setInterval(() => {
  session.getAll({ oids: oids }, function (error, varbinds) {
    let device = {}
    varbinds.forEach((varbind) => {
        // console.log(varbind.oid + ' = ' + varbind.value + ' (' + varbind.type + ')');
        const list = lists.find(list => list.oid.toString() === varbind.oid.toString())
        device[list.key] = varbind.value
    });
    if (device !== {}) {
      // let m = new Device(device)
      // m.save()
      device.time = Date.now()
      mockDevices.push(device)
      io.sockets.emit('update device', device)
    }
});
}, 30000)

getInterfaces()
function getInterfaces () {
  interfaces = []
  session.getSubtree({ oid: [1, 3, 6, 1, 2, 1, 2, 2, 1, 2] }, function (error, varbinds) {
    if (error) {
      console.log('Fail :(')
    } else {
      varbinds.forEach(function (vb) {
        interfaces.push({
          index: vb.oid[vb.oid.length - 1].toString(),
          description: vb.value
        })

      })
      session.getSubtree({ oid: '.1.3.6.1.2.1.2.2.1.7' }, function (error, varbindStatus) {
        if (error) {
          console.log('Fail :(')
        } else {
          varbindStatus.forEach(function (vb) {
            let interface = interfaces.find(interface => interface.index === vb.oid[vb.oid.length - 1].toString())
            if (interface) {
              interface.status = vb.value
            }
            // console.log(vb.oid + ' = ' + vb.value + ' (' + vb.type + ')');
          })
          io.sockets.emit('all interface', interfaces)
        }
      })
    }
  })
}
function changeInterface (index, value) {
  const oid = '.1.3.6.1.2.1.2.2.1.7.' + index
  session.set({ oid, value, type: 2 }, function (error, varbind) {
      if (error) {
          console.log('Fail :(');
      } else {
          console.log('The set is done.');
        getInterfaces()
      }
  });
}
var StringDecoder = require('string_decoder').StringDecoder;
var udp = require('dgram');
var decoder = new StringDecoder('utf8');
// --------------------creating a udp server --------------------

// creating a udp server
var server = udp.createSocket('udp4');
server.on('message',function(msg,info){
  // console.log('Data received from client : ', msg, info);
  console.log("  HEX  : " + msg.toString('hex'));
  console.log("  HEX  : " + JSON.stringify(msg.toString('utf8')));
  console.log("  HEX  : " + msg.toString('utf8'));
  console.log("  HEX  : " + JSON.stringify(info));
 
  var textChunk = decoder.write(msg)
  console.log("  HEX  : " + textChunk);
  console.log("  HEX  : " + msg.length);
  console.log(JSON.stringify(msg))
  io.sockets.emit('trap device', msg.toString('utf-8'))
});
server.on('listening',function(){
})
server.bind(162);

http.listen(port, function () {
  console.log('Server is running on port: ' + port)
})


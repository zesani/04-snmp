require('dotenv').config()
const express = require('express')
const app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
const mongoose = require('mongoose')
const port = process.env.PORT || 9999
var mockDevices = []
var interfaces = []

mongoose.connect(`mongodb://localhost:27017/snmp`, { })
const Device = require('./models/Device')

app.get('/devices', (request, response) => {
  Device.find().then(devices => {
    response.json({devices})
  })
})
io.on('connection', function (socket) {
  Device.find().then(devices => {
    socket.emit('init device', devices)
  })
  // socket.emit('init device', mockDevices)
  socket.emit('all interface', interfaces)
  socket.on('change interface', function (data) {
    changeInterface(data.index, data.value)
  })
})

var snmp = require('snmp-native')
var session = new snmp.Session({ host: '10.4.15.211', port: 161, community: 'private' });


var oidLists = [
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
var oids = oidLists.map(list => list.oid)
// get data & insert to db
setInterval(() => {
  // session.getAll({ oids: oids }, function (error, varbinds) {
  //   let device = {}
  //   varbinds.forEach((varbind) => {
  //     const list = oidLists.find(list => list.oid.toString() === varbind.oid.toString())
  //     device[list.key] = varbind.value
  //   })
  //   if (device !== {}) {
  //     device.time = Date.now()
  //     let d = new Device(device)
  //     d.save(function (err, res) {
  //       if (err) return handleError(err)
  //       io.sockets.emit('update device', res)
  //     })
  //   }
  // })
}, 10000)

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
  console.log(msg.toString());
  let response = snmp.parse(msg)
  console.log("--------------------------------------");
  response.pdu.varbinds.forEach(v => {
    console.log(v)
  })
});
server.on('listening',function(){
})
server.bind(162);

http.listen(port, function () {
  console.log('Server is running on port: ' + port)
})


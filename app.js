const express = require('express')
const app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var data = {
  cpu: 1,
  os: 'mac',
  temp: 20,
  memory: 100,
  in: 10,
  out: 20,
  interfaces: []
}
// var snmp = require('net-snmp')
// var session = snmp.createSession('192.168.1.1', 'private')
// // os, temp, cpu %, mem, in, out
// var oids = [
//   '1.3.6.1.2.1.1.1.0',
//   '1.3.6.1.4.1.9.9.13.1.3.1.3.1008',
//   '1.3.6.1.4.1.9.9.109.1.1.1.1.5.1',
//   '1.3.6.1.4.1.9.9.48.1.1.1.5.1',
//   '1.3.6.1.2.1.2.2.1.10.1',
//   '1.3.6.1.2.1.2.2.1.16.1'
// ]
// // .1.3.6.1.2.1.2.2.1.7
// session.get(oids, function (error, varbinds) {
//   if (error) {
//     console.error(error)
//   } else {
//     for (var i = 0; i < varbinds.length; i++) {
//       if (snmp.isVarbindError(varbinds[i])) console.error(snmp.varbindError(varbinds[i]))
//       else console.log(varbinds[i].oid + ' = ' + varbinds[i].value)
//     }
//   }
//   // If done, close the session
//   session.clos()
// })
io.on('connection', function (socket) {
  socket.emit('init data', data)
})
setInterval(() => {
  io.sockets.emit('update data', data)
}, 10000)
http.listen(5566, function () {
  console.log('listening on *:', 5566)
})

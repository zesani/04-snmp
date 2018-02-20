const express = require('express')
const app = express()

var snmp = require ("net-snmp")
var session = snmp.createSession ("192.168.1.1", "private");
console.log('Server is running on port: ')
// os, temp, cpu %, mem, in, out
var oids = [
  '1.3.6.1.2.1.1.1.0',
  '1.3.6.1.4.1.9.9.13.1.3.1.3.1008',
  '1.3.6.1.4.1.9.9.109.1.1.1.1.5.1',
  '1.3.6.1.4.1.9.9.48.1.1.1.5.1',
  '1.3.6.1.2.1.2.2.1.10.1',
  '1.3.6.1.2.1.2.2.1.16.1'
]
// .1.3.6.1.2.1.2.2.1.7
session.get (oids, function (error, varbinds) {
    if (error) {
        console.error (error);
    } else {
        for (var i = 0; i < varbinds.length; i++)
            if (snmp.isVarbindError (varbinds[i]))
                console.error (snmp.varbindError (varbinds[i]))
            else
                console.log (varbinds[i].oid + " = " + varbinds[i].value);
    }

    // If done, close the session
    session.close ();
});

// app.listen(port)
// console.log('Server is running on port: ' + port)
1.3.6.1.2.1.2.2.1.8
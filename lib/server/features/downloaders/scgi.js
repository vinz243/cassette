'use strict';

// Shamelessly stolen from:
// https://github.com/jfurrow/flood/blob/master/server/util/scgi.js
// thanks to jfurrow!

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Deserializer = require('xmlrpc/lib/deserializer');
var net = require('net');
var fs = require('fs');
var Serializer = require('xmlrpc/lib/serializer');
var mainStory = require('storyboard').mainStory;

exports.default = {
  methodCall: function methodCall(methodName, parameters, host, port) {

    var connectMethod = { port: port, host: host };
    var deserializer = new Deserializer('utf8');
    var headerLength = 0;
    var nullChar = String.fromCharCode(0);
    var stream = net.connect(connectMethod);
    var xml = Serializer.serializeMethodCall(methodName, parameters);

    stream.setEncoding('UTF8');

    var headerItems = ['CONTENT_LENGTH' + nullChar + xml.length + nullChar, 'SCGI' + nullChar + '1' + nullChar];

    headerItems.forEach(function (item) {
      headerLength += item.length;
    });

    var header = headerLength + ':';

    headerItems.forEach(function (headerItem) {
      header += headerItem;
    });

    stream.write(header + ',' + xml);

    var time = Date.now();

    return new Promise(function (resolve, reject) {
      mainStory.debug('scgi', 'Called ' + methodName + ' on ' + host + ':' + port + ' in ' + (Date.now() - time) + 'ms');
      deserializer.deserializeMethodResponse(stream, function (error, response) {
        if (error) {
          return reject(error);
        }
        return resolve(response);
      });
    });
  }
};
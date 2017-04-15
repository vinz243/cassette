
// Shamelessly stolen from:
// https://github.com/jfurrow/flood/blob/master/server/util/scgi.js
// thanks to jfurrow!

const Deserializer = require('xmlrpc/lib/deserializer');
const net = require('net');
const fs = require('fs');
const Serializer = require('xmlrpc/lib/serializer');
const mainStory = require('storyboard').mainStory;

module.exports.scgi = {
  methodCall: (methodName, parameters, host, port) => {

    const connectMethod = {port: port, host: host};

    const deserializer = new Deserializer('utf8');
    const nullChar = String.fromCharCode(0);
    const stream = net.connect(connectMethod);
    const xml = Serializer.serializeMethodCall(methodName, parameters);

    stream.setEncoding('UTF8');

    const headerItems = [
      `CONTENT_LENGTH${nullChar}${xml.length}${nullChar}`,
      `SCGI${nullChar}1${nullChar}`
    ];

    const headerLength = headerItems.reduce((length, item) => {
      return length + item.length;
    }, 0);

    const content = headerItems.reduce((acc, item) => {
      return `${acc}${item}`;
    }, '');

    const header = `${headerLength}:${content}`;
    
    stream.write(`${header},${xml}`);

    return new Promise((resolve, reject) => {
      deserializer.deserializeMethodResponse(stream, (error, response) => {
        if (error) {
          return reject(error);
        }
        return resolve(response);
      });
    });
  }
}

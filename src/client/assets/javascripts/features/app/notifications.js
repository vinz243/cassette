import React, { Component } from 'react';
import {Intent, ProgressBar} from '@blueprintjs/core';
import socket from 'app/socket';
import toaster from 'app/toaster';

function pingNotification () {
  setTimeout(function () {
    let start = 0;
    let working = false;
    let time = 0;
    socket.listen('client::pong', () => {
      time = Date.now() - start;
      working = true;
      toaster.show({
        message: `Socket.io connected. Ping is ${time}ms`,
        timeout: 2500,
        intent: Intent.SUCCESS
      });
    });
    setTimeout(() => {
      if (!working) {
        toaster.show({
          message: 'Socket.io doesnt seems to be working...',
          intent: Intent.WARNING,
          timeout: 5000,
          iconName: "warning-sign",
        });
      }
    }, 3000);
    start = Date.now();
    socket.emit('server::ping');
  }, 1500);
}

function scan () {
  let toast = null;
  socket.listen('scanner::scanstarted::*', function () {
    toast = toaster.show({
      message: 'Scanning libraries...',
      iconName: 'search',
      timeout: 5000000
    });
  });

  socket.listen('scanner::scanfinished::*', function (evt) {
    toaster.dismiss(toast);
    toaster.show({
      message: evt.clean ? 'No changes since last scan'
        : 'Library scan successfully finished',
      iconName: 'tick',
      intent: Intent.SUCCESS,
      timeout: 3500
    });
  })
}

export default function () {
  socket.on('connect', () => {
    pingNotification();
    scan();
  });
}

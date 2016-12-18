'use strict';
let assert = require('assert');
let scanpel = require('scanpel');
let config = {};

const execute = function (data) {
	assert(data.action === 'execute');
	assert(config && config.dir);

	let res = scanpel(config.dir, config).then((res) => {
		process.send({
			status: 'done',
			data: res
		});
	});

};

const setConfig = function (data) {
	config = data.data;
};


process.on('message', function (data) {
	if (data.action === 'execute') {
		execute(data);
	} else if (data.action === 'set_config') {
		setConfig(data);
	}
});
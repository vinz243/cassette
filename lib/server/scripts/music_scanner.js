'use strict';

var assert = require('assert');
var scanpel = require('scanpel');
var config = {};

var execute = function execute(data) {
	assert(data.action === 'execute');
	assert(config && config.dir);

	var res = scanpel(config.dir, config).then(function (res) {
		process.send({
			status: 'done',
			data: res
		});
	});
};

var setConfig = function setConfig(data) {
	config = data.data;
};

process.on('message', function (data) {
	if (data.action === 'execute') {
		execute(data);
	} else if (data.action === 'set_config') {
		setConfig(data);
	}
});
;

(function () {
	if (typeof __REACT_HOT_LOADER__ === 'undefined') {
		return;
	}

	__REACT_HOT_LOADER__.register(config, 'config', 'src/server/scripts/music_scanner.js');

	__REACT_HOT_LOADER__.register(execute, 'execute', 'src/server/scripts/music_scanner.js');

	__REACT_HOT_LOADER__.register(setConfig, 'setConfig', 'src/server/scripts/music_scanner.js');
})();

;
var assert = require('chai').assert,
    Jssows = require('../jssows');

describe('#constructor', function() {

  it('verifies module is function', function() {
	assert.typeOf(Jssows, 'function', 'Jssows is a function'); 
    var webscocketobj = {};
	var jssows = new Jssows(webscocketobj);
  });

  it('verifies constructor with one parameter and exported functions', function() {
    var webscocketobj = {};
	var jssows = new Jssows(webscocketobj);
	assert.typeOf(jssows.send, 'function', 'jssows.send is a function');
	assert.typeOf(jssows.bind, 'function', 'jssows.bind is a function');
	assert.typeOf(jssows.unbind, 'function', 'jssows.unbind is a function');
  });
  
  it('verifies constructor with two parameters and exported functions', function() {
    var webscocketobj = {};
	var onMessageUnknownServiceHandler = function(evt) {
		console.log('onMessageUnknownServiceHandler called!');
	};
	var jssows = new Jssows(webscocketobj, onMessageUnknownServiceHandler);
	assert.typeOf(jssows.send, 'function', 'jssows.send is a function');
	assert.typeOf(jssows.bind, 'function', 'jssows.bind is a function');
	assert.typeOf(jssows.unbind, 'function', 'jssows.unbind is a function');
  });

});

describe('#onMessageUnknownServiceHandler', function() {
  it('verifies onMessageUnknownServiceHandler function', function() {
	var message = {
		service: 'unknownService',
		data: 'dummy data'
	};
	var websocketEvent = {};
	websocketEvent.data = JSON.stringify(message);

    var websocketobj = {};
	var called = 0;
	var onMessageUnknownServiceHandler = function(data) {
		called++;
		assert.deepEqual(data, message, 'parameter should be websocket event data in JS');
		//console.log('onMessageUnknownServiceHandler called!');
	};
	var jssows = new Jssows(websocketobj, onMessageUnknownServiceHandler);
	websocketobj.onmessage(websocketEvent);
	assert.equal(called, 1, 'onMessageUnknownServiceHandler should have been called 1 time');
  });

});

describe('#bind', function() {
  it('verifies bind function', function() {
	var message = {
		service: 'boundService',
		data: 'dummy data'
	};
	var websocketEvent = {};
	websocketEvent.data = JSON.stringify(message);

    var websocketobj = {};
	var onMessageUnknownServiceHandler = function(evt) {
		assert.fail('should not have been called!');
	};
	var called = 0;
	var boundHandler = function(data) {
		called++;
		assert.deepEqual(data, message.data, 'parameter should be data of event data');
		//console.log('onMessageUnknownServiceHandler called!');
	};
	var jssows = new Jssows(websocketobj, onMessageUnknownServiceHandler);
	jssows.bind(message.service, boundHandler);
	websocketobj.onmessage(websocketEvent);
	assert.equal(called, 1, 'boundHandler should have been called 1 time');
  });

});

describe('#unbind', function() {
  it('verifies unbind function', function() {
	var message = {
		service: 'boundService',
		data: 'dummy data'
	};
	var websocketEvent = {};
	websocketEvent.data = JSON.stringify(message);

    var websocketobj = {};
	var called = 0;
	var onMessageUnknownServiceHandler = function(evt) {
		called++;
	};
	var boundHandler = function(data) {
		assert.fail('should not have been called!');
		//console.log('onMessageUnknownServiceHandler called!');
	};
	var jssows = new Jssows(websocketobj, onMessageUnknownServiceHandler);
	jssows.bind(message.service, boundHandler);
	jssows.unbind(message.service);
	websocketobj.onmessage(websocketEvent);
	assert.equal(called, 1, 'onMessageUnknownServiceHandler should have been called 1 time');
  });
  
});

describe('#send', function() {
  it('verifies send function', function() {
	var message = {
		service: 'boundService',
		data: 'dummy data'
	};
	var websocketEvent = {};
	websocketEvent.data = JSON.stringify(message);

    var websocketobj = {};
	var called = 0;
	websocketobj.send = function(msg) {
		called++;
		var jsMsg = JSON.parse(msg);
		assert.deepEqual(jsMsg, message, 'msg sent should be encapsulated in js object');
	};
	var onMessageUnknownServiceHandler = function(evt) {
		assert.fail('should not have been called!');
	};
	var jssows = new Jssows(websocketobj, onMessageUnknownServiceHandler);
	jssows.send(message.service, message.data);
	assert.equal(called, 1, 'websocketobj.send should have been called 1 time');
  });

  it('verifies send function with callback', function() {
	var message = {
		service: 'boundService',
		data: 'dummy data'
	};

    var websocketobj = {};
	var called = 0;
	var callbackId;
	websocketobj.send = function(msg) {
		called++;
		//console.log('send:' + msg);
		var jsMsg = JSON.parse(msg);
		assert.equal(jsMsg.service, message.service, 'service defined');
		assert.equal(jsMsg.data, message.data, 'data defined');
		assert.property(jsMsg, 'callback', 'callback defined');
		callbackId = jsMsg.callback;
	};
	var onMessageUnknownServiceHandler = function(evt) {
		assert.fail('should not have been called!');
	};
	var jssows = new Jssows(websocketobj, onMessageUnknownServiceHandler);
	var calledCallback = 0;
	var callbackHandler = function(data) {
		calledCallback++;
		assert.deepEqual(data, message.data, 'parameter should be data of event data');
		//console.log('onMessageUnknownServiceHandler called!');
	};
	jssows.send(message.service, message.data, callbackHandler);
	assert.equal(called, 1, 'websocketobj.send should have been called 1 time');
	
	var websocketEvent = {};
	message.service = callbackId;
	websocketEvent.data = JSON.stringify(message);
	websocketobj.onmessage(websocketEvent);
	assert.equal(calledCallback, 1, 'callbackHandler should have been called 1 time');
  });
  
});

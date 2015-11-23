# jssows-js
Json Services Over WebSocket sub protocol

##MOTIVATION

I looked for the web but did not find any very very simple standard sub protocol for calling services over websocket.
So I wrote it.

##Getting started


    var Jssows = require('jssows');
    var websocket = new WebSocket('ws://localhost:8887');
    
    var unknownHandler = function(jsonMessage) {
        console.info('Unknown service ' + jsonMessage.service);
    };
    
    var jssowsServices = new Jssows(websocket, unknownHandler);
    
    var bindingHandler = function(jsonMessage) {
        <yourcode>
    };
    jssowsServices.bind('binding', bindingHandler);
    
    var navigationHandler =  function(jsonMessage) {
        <yourcode>
    };
    jssowsServices.bind('navigation', navigationHandler);




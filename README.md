# jssows-js
Json Services Over WebSocket sub protocol

##MOTIVATION

I looked for the web but did not find any very very simple standard sub protocol for calling services over websocket.
So I wrote it.

##Getting started

'''
    var websocket = new WebSocket('ws://localhost:8887');
    
    var unknownHandler = function(jsonMessage) {
        console.info('Unknown service ' + jsonMessage.service);
    };
    
    var jwspserver = new Jssows(websocket, unknownHandler);
    
    var bindingHandler = function(jsonMessage) {
        require([ jsonMessage.modelName ], function(model) {
            console.info('Before mise a jour...' + jsonMessage.modelName);
            ko.mapping.fromJS(jsonMessage.model, model);
            console.info('Model mis a jour !' + jsonMessage.modelName);
        });
    };
    jwspserver.bind('binding', bindingHandler);
    
    var navigationHandler =  function(jsonMessage) {
        console.info('Before navigation...' + jsonMessage.hash);
        router.navigate(jsonMessage.hash);
        console.info('After navigation...' + jsonMessage.hash);
    };
    jwspserver.bind('navigation', navigationHandler);
'''



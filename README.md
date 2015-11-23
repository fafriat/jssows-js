## jssows-js
Json Standard Services Over WebSocket sub protocol

###Motivation

I looked for the web but did not find any very very simple standard sub protocol for calling services over websocket.
So I wrote it.

###Getting started

```

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

```
    
###Protocol

* Communication using Json String
* Service defined by a name

*Format:* `{"service":"<service name of the service to call>", "data":"<the data to give to the service>"}`

or to get a response on a given service name called callback:

*Format:* `{"service":"<service name of the service to call>", "data":"<the data to give to the service>", "callback": "service name of the service to call to send the response"}`



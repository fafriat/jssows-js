## jssows-js
Json Standard Services Over WebSocket sub protocol

###Motivation

I looked for something similar on the web but did not find any **very very simple** standard sub protocol for calling services over websocket and getting a response. So I wrote it. Putting it there so it can be useful for others.

I am new to javascript world so don't hesitate to send me comments and remarks to frank.afriat @ gmail.com (remove the spaces).


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

*Format:*
>     {
>       "service" : "<service name of the service to call>", 
>       "data"    : "<the data to give to the service>"
>     }

or to get a response on a given service name called callback:

*Format:* 
>     {
>       "service"  : "<service name of the service to call>",
>       "data"     : "<the data to give to the service>",
>       "callback" : "service name of the service to call to send the response"
>     }

#### Implementations
 1. javascript (client) - (should be usable for serversocket also but not tested)
 2. java (server) - ready but not yet published

###API

#### Constructor

One or Two arguments

1. Argument1: Websocket
2. Argument2: unknownHandler function accepting one argument (optional)
    
>     var Jssows = require('jssows');
>     var websocket = new WebSocket('ws://localhost:8887');
>     var unknownHandler = function(jsonMessage) {
>     	console.info('Unknown service ' + jsonMessage.service);
>     };
>     var jssowsServices = new Jssows(websocket, unknownHandler);

When receiving data for a service name that has no binding, the data is redirected to the unknownHandler.

#### Send

Send data to a given service on the underlying websocket and specify an eventual handler for receiving the response:

    jssowsServices.send(<service name>, <data as JS>, <optional callback handler>);

The <optional callback handler> should be a function and should return a boolean : shouldRemove
when true the handler is unbound after receiving the response.

#### Bind

Bind a service handler to a given service name. When receiving data for the given service name, the data is send as argument of the bound handler.

    var navigationHandler =  function(jsonMessage) {
    	<yourcode>
    };
    jssowsServices.bind('navigation', navigationHandler);


#### Unbind

Unbind a given service name.

    jssowsServices.unbind('navigation');



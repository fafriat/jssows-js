/*
    Copyright 2015 Frank Afriat

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define([], factory);
    }
}(this, function () {
    return function (websocket, onMessageUnknownServiceHandler) {
        var self = this;
        self.debug = false;
        self.websocket = websocket;
        self.onMessageUnknownServiceHandler = onMessageUnknownServiceHandler;
        self.bindings = {};
        self.callCounter = 0;
        self.internal = {};
        self.internal.isFunction = function (functionToCheck) {
            var getType = {};
            return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
        };
        self.internal.callUnknownHandler = function (jsonMessage) {
            if (self.debug) {
                console.warn('JSSOWS unknown message:' + jsonMessage);
            }
            if (onMessageUnknownServiceHandler !== undefined) {
                onMessageUnknownServiceHandler(jsonMessage);
            }
        };
        self.websocket.onmessage = function (evt) {
            if (self.debug) {
                console.info('JSSOWS received on websocket:' + evt.data);
            }
            var jsonMessage = JSON.parse(evt.data);
            var service = jsonMessage.service;
            if (service === undefined) {
                self.internal.callUnknownHandler(jsonMessage);
                return;
            }
            var handler = self.internal.getBinding(service);
            if (handler === undefined) {
                self.internal.callUnknownHandler(jsonMessage);
                return;
            }
            var data = jsonMessage.data;
            var callback = jsonMessage.callback;
            var shouldRemove = handler(data, callback);
            if (shouldRemove) {
                self.unbind(service);
            }
        };
        self.internal.bindCallback = function (callback) {
            var callId = ++self.callCounter;
            var bindingId = 'callback' + callId;
            self.bindings[bindingId] = callback;
            return bindingId;
        };
        self.internal.getBinding = function (service) {
            return self.bindings[service];
        };
        self.send = function (service, data, callback) {
            var toSendJson = {service: service, data: data};
            if (arguments.length === 3) {
                var callbackId = self.internal.bindCallback(callback);
                toSendJson.callback = callbackId;
            }
            var toSend = JSON.stringify(toSendJson);
            websocket.send(toSend);
        };
        self.bind = function (service, handler) {
            self.bindings[service] = handler;
        };
        self.unbind = function (service) {
            self.bindings[service] = undefined;
        };
    };
}));

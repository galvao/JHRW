/**
 * JHRW - JavaScript HTTP Reuqest Wrapper
 *
 * A wrapper around so-called "AJAX" requests.
 *
 * @author Er Galvão Abbott <galvao@galvao.eti.br>
 * @link https://github.com/galvao/JHRW
 */

'use strict';

function JHRW(destination, lazyExecution)
{
    if (typeof destination === 'undefined') {
        throw new Error('Destination is a required parameter.');
    }

    this.lazy = typeof lazyExecution === 'undefined' ? false : lazyExecution;
    this.availableHandlers = [
        'loadstart', 
        'progress', 
        'abort', 
        'error', 
        'load', 
        'timeout', 
        'loadend', 
        'onreadystatechange'
    ];

    this.config = {
        URI              : destination,
        asynchronous     : true,
        verb             : 'get',
        data             : null,
        requestHeaders   : {},
        responseType     : 'text/plain',
        handlers         : {'load': defaultHandler, 'error': defaultHandler},
        attempts         : 0,
        attemptInterval  : 3000,
        timeout          : 5000
    };

    this.request = new XMLHttpRequest();

    if (this.lazy === true) {
        this.init();
        this.send();
    }

    this.configure = function (configureObject) {
        for (let c in configureObject) {
            if ((c in this.config) === false) {
                let configList = Object.getOwnPropertyNames(this.config).join("\n");
                throw new ReferenceError(c + " is not a config attribute.\nAccepted config attributes:\n" + configList);
            }

            this.config[c] = configureObject[c];
        }

        return;
    };

    this.init = function () {
        this.request.overrideMimeType(this.config.responseType);

        for (let handler in this.config.handlers) {
            if (this.availableHandlers.includes(handler) === false) {
                let handlerList = this.availableHandlers.join("\n");
                throw new ReferenceError('Invalid handler type: ' + handler + "\nAvailable handlers:\n" + handlerList);
            }

            this.request.addEventListener(handler, this.config.handlers[handler]);
        }

        this.request.open(this.config.verb, this.config.URI, this.config.asynchronous);
        this.timeout = this.config.timeout;

        for (let header in this.config.requestHeaders) {
            this.request.setRequestHeader(header, this.config.requestHeaders[header]);
        }
    };

    this.send = function () {
        this.request.send(this.config.data);
    };
}

/**
 * An example handler
 */

function defaultHandler(event)
{
    if (event.type === 'error') {
        alert('There was an error on the request.');
    } else if (event.type === 'load') {
        if (this.status === 200) {
            let d = document.createElement('div');
            d.textContent = this.response;
            document.body.appendChild(d);
        } else {
            alert('Returned status: ' + this.status + '(' + this.statusText + '); Possible error.');
        }
    }
}

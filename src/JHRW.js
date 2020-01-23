/**
 * JHRW - JavaScript HTTP Request Wrapper
 *
 * A wrapper around so-called "AJAX" requests.
 *
 * @author Er Galvão Abbott <galvao@galvao.eti.br>
 * @link https://github.com/galvao/JHRW
 * @license Apache 2.0
 */

'use strict';

class JHRW
{
    /**
     * Constructor
     *
     * @param string  destination The request's destination
     * @param boolean lazyExecution If the request should be immediately initialized and sent
     *
     * @return object An instance of the JHRW class
     * @throws Error If the destination parameter is undefined
     */
    constructor(destination, lazyExecution)
    {
        if (typeof destination === 'undefined') {
            throw new Error('Destination is a required parameter.');
        }

        lazyExecution = typeof lazyExecution !== 'boolean' ? false : lazyExecution;

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
    }

    /**
     * Configure - Configure the various settings for the request
     *
     * @param object A configuration object (JSON)
     *
     * @return void
     * @throws ReferenceError If a configuration index inside the configuration object is not defined by the class or
     * if a handler defined in the configuration object is not made available.
     */
    configure(configureObject)
    {
        for (let configAttr in configureObject) {
            if ((configAttr in this.config) === false) {
                let configList = Object.getOwnPropertyNames(this.config).join("\n");
                throw new ReferenceError(configAttr + " is not a config attribute.\nAccepted config attributes:\n" + configList);
            }

            if (configAttr === 'handlers') {
                for (let handler in configureObject.handlers) {
                    if (this.availableHandlers.includes(handler) === false) {
                        let handlerList = this.availableHandlers.join("\n");
                        throw new ReferenceError('Invalid handler type: ' + handler + "\nAvailable handlers:\n" + handlerList);
                    }

                    this.config.handlers[handler] = configureObject.handlers[handler];
                }
            } else {
                this.config[configAttr] = configureObject[configAttr];
            }
        }

        return;
    }

    /**
     * init - Initializes the Request object (overrides MimeType, adds event listeners for handlers, opens the request and sets
     * the request headers, if available).
     *
     * @return void
     */
    init()
    {
        this.request.overrideMimeType(this.config.responseType);

        for (let handler in this.config.handlers) {
            this.request.addEventListener(handler, this.config.handlers[handler]);
        }

        this.request.open(this.config.verb, this.config.URI, this.config.asynchronous);
        this.timeout = this.config.timeout;

        for (let header in this.config.requestHeaders) {
            this.request.setRequestHeader(header, this.config.requestHeaders[header]);
        }

        return;
    }

    /**
     * send - Sends the request
     *
     * @return void
     */
    send()
    {
        this.request.send(this.config.data);
        return;
    }
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

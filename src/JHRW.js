/**
 * JHRW - JavaScript HTTP Request Wrapper
 *
 * A wrapper around so-called "AJAX" requests.
 *
 * @version 2.0.0
 * @author Er Galvão Abbott <galvao@galvao.eti.br>
 * @link https://github.com/galvao/JHRW
 * @license MIT
 */

'use strict';

class JHRW
{
    attempts;
    config;
    configList;
    request;
    timer;

    /**
     * Constructor
     *
     * @param string  base          The request's URL base
     * @param string  urlPath       The request's path on the base URL
     * @param boolean lazyExecution If the request should be immediately initialized and sent
     * @param boolean bypassCache   If the request should generate a timed param to bypass cache
     *
     * @return object An instance of the JHRW class
     *
     * @throws ReferenceError If there's no 'JHRWHandler' function defined
     * @throws Error If the base parameter is undefined
     *               If the urlPath parameter is undefined
     * @throws TypeError If the base parameter is not a string
     *                   If the urlPath parameter is not a string
     *                   If the lazyExecution parameter is not a boolean
     *                   If the bypassCache parameter is not a boolean
     */
    constructor(base, urlPath, lazyExecution = false, bypassCache = false)
    {
        if (typeof JHRWHandler !== 'function') {
            throw new ReferenceError('There is no handler for JHRW. A function named \'JHRWHandler\' must exist.');
        }

        if (typeof base === 'undefined') {
            throw new Error('base is a required parameter.');
        }

        if (typeof urlPath === 'undefined') {
            throw new Error('urlPath is a required parameter.');
        }

        if (typeof base !== 'string') {
            throw new TypeError('base is a *string* parameter.');
        }

        if (typeof urlPath !== 'string') {
            throw new TypeError('urlPath is a *string* parameter.');
        }

        if (typeof lazyExecution !== 'boolean') {
            throw new TypeError('lazyExecution is a required *boolean* parameter.');
        }

        if (typeof bypassCache !== 'boolean') {
            throw new TypeError('bypassCache is a required *boolean* parameter.');
        }

        const url = new URL(encodeURI(urlPath), base);

        if (bypassCache === true) {
            url.searchParams.append('requestTime', new Date().getTime());
        }

        /**
         * Keeps the url object from changing, making it "truly" constant.
         * @see https://twitter.com/galvao/status/1249576416196296704
         */

        Object.freeze(url);

        this.attempts = 0;
        this.timer    = undefined;

        // Default Configuration Object

        this.config = {
            URI              : url.href,
            asynchronous     : true,
            verb             : 'get',
            data             : null,
            requestHeaders   : {},
            requestType      : 'text/plain',
            responseType     : 'text/plain',
            handlers         : {
                'load':    JHRWHandler,
                'error':   JHRWHandler,
                'timeout': this.timeoutHandler.bind(this)
            },
            attempts         : 1,
            attemptInterval  : 3,
            timeout          : 0,
            postTimeout      : undefined
        };

        this.configList = Object.getOwnPropertyNames(this.config).join("\n");

        if (lazyExecution === true) {
            this.init();
            this.send();
        }
    }

    /**
     * Configure - Validates the configuration object and configures the various settings for the request
     *
     * @param object configureObject A configuration object
     *
     * @return void
     *
     * @throws ReferenceError If a configuration index inside the configuration object is not defined by the class.
     *                        If a handler defined in the configuration object is not available.
     * @throws Error          If trying to set a timeout for synchronous requests.
     *                        If the set timeout is less than a second.
     *                        If trying to set the interval between attempts to less than a second.
     */
    configure(configureObject)
    {
        if (configureObject['timeout'] !== 0) {
            if (configureObject['timeout'] < 1) {
                throw new Error('Timeout must be at least a second.');
            }

            if (configureObject['attempts'] > 1) {
                if (configureObject['attemptInterval'] < 1) {
                    throw new Error('Interval between attempts must be at least a second.');
                }
            }
        }

        for (let configAttr in configureObject) {
            if ((configAttr in this.config) === false) {
                throw new ReferenceError(configAttr + " is not a config attribute.\nAccepted config attributes:\n" + this.configList);
            }

            if (configAttr === 'handlers') {
                for (let handler in configureObject.handlers) {
                    if (JHRW.availableHandlers.includes(handler) === false) {
                        throw new ReferenceError('Invalid handler type: ' + handler + "\nAvailable handlers:\n" + JHRW.handlerList);
                    }

                    this.config.handlers[handler] = configureObject.handlers[handler];
                }
            } else {
                if ((configAttr === 'attemptInterval' || configAttr === 'timeout') && configAttr['asynchronous'] !== false) {
                    this.config[configAttr] = configureObject[configAttr] * 1000;
                    continue;
                }

                this.config[configAttr] = configureObject[configAttr];
            }
        }

        return;
    }

    /**
     * init - Initializes the Request object
     * (Creates the request, overrides MimeType, adds event listeners for handlers,
     * opens the request and sets the request headers, if available).
     *
     * @return void
     */
    init()
    {
        this.request = undefined;
        this.request = new XMLHttpRequest();

        this.request.overrideMimeType(this.config.requestType);

        for (let handler in this.config.handlers) {
            this.request.addEventListener(handler, this.config.handlers[handler]);
        }

        this.request.open(this.config.verb, this.config.URI, this.config.asynchronous);

        if (this.config.asynchronous === true) {
            this.request.responseType = this.config.responseType;
            this.request.timeout      = this.config.timeout;
        }

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

    /**
     * The timeout handler.
     * A function may be executed after this by passing a 'postTimeout' config.
     *
     * @return void
     */
    timeoutHandler()
    {
        if (typeof this.config.postTimeout === 'function') {
            this.config.postTimeout();
        }

        this.timer = window.setInterval(this.retry.bind(this), this.config.attemptInterval);

        return;
    }

    /**
     * retry - If all attempts were made, returns. Otherwise, inits and sends the next attempt.
     *
     * @return void
     */
    retry()
    {
        if ((this.attempts + 1) === this.config.attempts) {
            window.clearInterval(this.timer);
            return;
        }

        this.attempts++;

        this.init();
        this.send();

        return;
    }

    end()
    {
        this.attempts = this.config.attempts - 1;
    }
}

/**
 * Static properties
 */

JHRW.availableHandlers = [
    'loadstart',
    'progress',
    'onabort',
    'error',
    'load',
    'loadend',
    'onreadystatechange'
];

JHRW.handlerList = JHRW.availableHandlers.join("\n");

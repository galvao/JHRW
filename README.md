<p align="center">
    <img src="media/logo.png" width="200">
</p>

# JHRW - JavaScript HTTP Request Wrapper
A wrapper for so-called "AJAX" Requests

## Goals
I've made JHRW to:

* Advance my JavaScript skills;
* Improve/Simplify the usage of the [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) object by:
    * Adding default values to what's undefined;
    * Adding additional Error checking and clarification;
    * Adding interesting, simplified, feature, such as timeouts and retries.

## Documentation
```JavaScript
Object JHRW(String base, String urlPath [, Boolean lazyExecution = false [, Boolean bypassCache = false]]);
```

### Parameters
* `String base` - The request's base URL
* `String urlPath` - The request's endpoint
* `Boolean lazyExecution`(optional) - If the request should be initialized and sent right after instantiation. Default: false
* `Boolean bypassCache`(optional) - If the request URL should have a timed parameter added in order to bypass cache. Default: false

### Throws
* A `ReferenceError`
    * If there's no JHRWHandler function defined.
* A `Error`
	* if the base parameter is `undefined`
	* if the urlPath parameter is `undefined`
* A `TypeError`
	* if the base parameter is not a `String`
	* if the urlPath parameter is not a `String`
	* if the lazyExecution parameter is not a `Boolean`
	* if the bypassCache parameter is not a `Boolean`


### Returns
An Object containing:

#### Properties
* `Object request` - The native [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) Object
* `Object config` - The configuration Object
	* `String URI` - The request's target
	* `Boolean asynchronous` - If the request should be asynchronous
	* `String verb` - The HTTP verb
	* `Mixed data` - Data to be sent along with the request
	* `Object requestHeaders` - HTTP headers for the request
	* `String responseType` - Expected MIME type of the response
	* `Object handlers` - The functions to handle the request
	* `Number attempts` - # of attempts to retry if the request fails
	* `Number attemptInterval` - Interval between attempts, **in seconds**.
	* `Number timeout` - The timeout, **in seconds**, for the request - after which it should be retried.
	* `Function postTimeout`: The function to be executed if the request times out.
	* `Number timer` - The [timer](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval) that controls the retry process.

##### Static Properties
* `Array JHRW.availableHandlers`: The types of handlers that can be [re-]defined.
* `String JHRW.handlerList`: Convenience property to be shown in error messages.

#### Methods
##### configure
```JavaScript
void configure(Object configureObject);
```
Overwrites one or more configuration options (see the config object above)

##### init
```JavaScript
void init();
```
Initializes the request: Sets the expected response MIME Type; Sets the handlers as listeners; Opens the request; Sets the request's headers.

##### send
```JavaScript
void send();
```
Sends the request, including data, if available.

##### end
```JavaScript
void end();
```

Ends the request. Useful if you wish for JHRW to stop retrying on success.

### Basic Usage
```JavaScript
try {
	var obj = new JHRW('http://localhost', /foo.php', true);
} catch (Error e) {
	// Do something
}
```
or

```JavaScript
try {
	var req = new JHRW('http://localhost', 'foo.php');

	try {
        req.init();
	} catch (ReferenceError e) {
        // Do something
    }

    req.send();
} catch (Error e) {
    // Do something
}
```

For a more advanced usage example see [the testing page](src/example/requestTester.html).

## Credits

* Developed by @galvao.
* Logo font: [Neutra Text Bold](http://fontsgeek.com/fonts/Neutra-Text-Bold)

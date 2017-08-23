# JHRW - JavaScript HTTP Request Wrapper
A wrapper for so-called "AJAX" Requests

## Goals
I've made JHRW to:

* Advance my JavaScript skills;
* Improve/Simplify the usage of the XMLHttpRequest object by:
	* Adding default values to what's undefined;
	* Adding additional Error checking and clarification;

## Documentation
```JavaScript
Object JHRW(String destination [, Boolean lazyExecution = false]);
```

### Parameters
* `String destination` - The request's target
* `Boolean lazyExecution`(optional) - If the request should be initialized and sent right after instantiation

### Throws
A `new Error` if the destination parameter is `undefined`

### Returns
An Object containing:

#### Properties
* request - The `XMLHttpRequest` Object
* config - The configuration Object
	* URI - The re'uest's target
	* asynchronous - If the request should be asynchronous
	* verb - The HTTP verb
	* data - Data to be sent along with the request
	* requestHeaders - HTTP headers for the request
	* responseType - Expected MIME type of the response
	* handlers - Object containing the functions to handle the request
	* attempts - Number of attempts to retry the request
	* attemptInterval - Interval between attempts
* availableHandlers - Which handlers can be set

#### Methods
##### configure
Overwrites one or more configuration options (see the config object above)
```JavaScript
Undefined configure(Object configureObject);
```
##### init
Initializes the request: Sets the expected response MIME Type; Sets the handlers as listeners; Opens the request; Sets the request's headers.
```JavaScript
Undefined init();
```
##### send
Sends the request, including data, if available.
```JavaScript
Undefined send();
```

### Basic Usage
```JavaScript
try {
	var obj = new JHRW('foo.php', true);
} catch (Error e) {
	// Do something
}
```
or

```JavaScript
try {
	var req = new JHRW('foo.php');
	
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
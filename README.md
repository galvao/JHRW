# JHRW - JavaScript HTTP Request Wrapper
#### IMPORTANT
---
This code is under heavy development. 
The documentation below is incomplete, needs corrections and there's at least one unintended behavior for this code.
---
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

### Return
A JHRW Object containing:

#### Properties
* config
	* URI
	* asynchronous
	* verb
	* data
	* requestHeaders
	* responseType
	* handler
	* attempts
	* attemptInterval

#### Methods
##### configure
Overwrites one or more configuration options (see the config object above)
```JavaScript
Undefined configure(Object configureObject);
```
##### init
Initializes the request: Sets the request's MIME Type; Sets the handlers; Opens the request; Sets the request's headers.
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
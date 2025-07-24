# Add url-request to a webhandle environment

## Install

```
npm install url-tracking-and-reporting
```

Add to less: 
```
@import "../node_modules/@webhandle/url-tracking-and-reporting/less/components";
```

Add to client js:

```
let clientIntegrator = require('@webhandle/url-tracking-and-reporting').default
clientIntegrator()
```

Add to server js:
```
const serverIntegrator = (await import('@webhandle/url-tracking-and-reporting')).default
serverIntegrator(dbName, options)
```

By default, the urls are:

/admin/@webhandle/url-tracking-and-reporting

Server side services are:
- urlRequest

Client side services are:

webhandle.services.webhandle['url-tracking-and-reporting'].urlRequest

which offers a DataStore interface to the logged requests


## Capturing Requests

By default, all requests will be captured. However, that may lead to a LOT of junk in the db.
To capture just some urls, pass a `filter` as part of the options:


```js
const serverIntegrator = (await import('@webhandle/url-tracking-and-reporting')).default
serverIntegrator(dbName, {
	filter: (entry) => {
		if(entry.originalUrl.startsWith('/resources')) {
			return true
		}
		return false
	}
})
```

`entry` will be a logged object that looks more or less like an Express request. However, the logged
object will also have a field `loggerName` which will have one of the values:


```
webhandle:requests
webhandle:not-found
```

and a `requestId` field that can be used to correlate multiple points in the request lifecycle.

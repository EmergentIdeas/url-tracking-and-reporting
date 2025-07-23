# Add url-request to a webhandle environment

## Install

```
npm install url-tracking-and-reporting
```

Add to less: 
```
@import "../node_modules/url-tracking-and-reporting/less/components";
```

Add to client js:

```
let clientIntegrator = require('url-tracking-and-reporting').default
clientIntegrator()
```

Add to server js:
```
const serverIntegrator = (await import('url-tracking-and-reporting')).default
serverIntegrator(dbName)
```

By default, the urls are:

/admin/url-request

Services are:
- urlRequest

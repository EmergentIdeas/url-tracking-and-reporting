import webhandle from 'webhandle'
import filog from 'filter-log'
import { Writable } from 'node:stream'

export default function setupCaptureRequests(filter) {
	filog.defineProcessor(
		'requests-watcher',
		{},
		new MongoWriteStream(),
		(entry) => {
			
			// we only want to write events are the logged requests or the logged "not found" events
			// and then, only if the user supplied filter wants to record them.
			return (
				entry.loggerName === "webhandle:requests" 
				|| entry.loggerName === "webhandle:not-found" 
				
			) && filter(entry)
		}
	)

}


class MongoWriteStream extends Writable {
	constructor(options) {
		super({ ...options, objectMode: true })
		this.serializedParameters = ['body', 'query', 'params', 'cookies']
	}
	
	clean(chunk) {
		let req = Object.assign({}, chunk)
		
		delete req._readableState
		delete req._parsedUrl
		
		for(let parm of this.serializedParameters) {
			try {
				req[parm] = JSON.stringify(req[parm])
			}
			catch(e) {
				delete req[parm]
			}
		}
		
		req.timestamp = new Date().getTime()
		
		return req
	}

	_write(chunk, encoding, callback) {
		let dataService = webhandle.services['urlRequest']
		let req = this.clean(chunk)
		dataService.save(req)
		callback()
	}
}

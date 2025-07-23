import RemoteDataService from '@dankolz/data-service-server/client-lib/remote-data-service.mjs'

export default function setupDataService() {

	let packageName = 'url-tracking-and-reporting'
	if (!window.webhandle) {
		window.webhandle = {}
	}

	if (!window.webhandle.services) {
		window.webhandle.services = {}
	}

	if (!window.webhandle.services.webhandle) {
		window.webhandle.services.webhandle = {}
	}

	if (!window.webhandle.services.webhandle[packageName]) {
		window.webhandle.services.webhandle[packageName] = {}
	}

	let servicesParent = window.webhandle.services.webhandle[packageName]
	let serv = new RemoteDataService({
		urlPrefix: '/admin/@webhandle/url-tracking-and-reporting/services/urlRequest'
	})
	servicesParent['urlRequest'] = serv
	
	return serv
}
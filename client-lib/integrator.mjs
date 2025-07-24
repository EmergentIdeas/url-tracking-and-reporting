
import '../views/load-browser-views.mjs'

import RecordTable from '@webhandle/record-table'

import setupDataService from './setup-data-service.mjs'
import AllDataView from '../client-lib/all-data-view.mjs'



let dataService = null

export default function integrate() {
	if (!dataService) {
		dataService = setupDataService()
		let frame = document.querySelector('#url-request-and-tracking-all-data-view')
		if (frame) {
			let dataService = window.webhandle.services.webhandle['url-tracking-and-reporting'].urlRequest
			let one = new AllDataView({
				dataService: dataService
			})
			one.render()
			one.appendTo(frame)
		}
	}


	return dataService
}

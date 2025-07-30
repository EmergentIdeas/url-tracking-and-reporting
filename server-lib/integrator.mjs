import webhandle from 'webhandle'
import express from 'express'
import path from 'path'

import DataServiceServer from '@dankolz/data-service-server'
import UrlRequestDreck from './dreck.mjs'
import allowGroup from 'webhandle-users/utils/allow-group.js'

import filog from 'filter-log'
let log = filog('url-request-integrator:')

import UrlRequestDataService from './data-service.mjs'
import setupCaptureRequests from './capture-requests.mjs'

let templatesAdded = false
let templates = {}

export default function integrate(dbName, options) {
	let opt = Object.assign({
		collectionName: 'urlRequest',
		templateDir: 'node_modules/@webhandle/url-tracking-and-reporting/views',
		mountPoint: '/admin/@webhandle/url-tracking-and-reporting',
		allowedGroups: ['administrators'],
		dreckOptions: {},
		filter: () => true
	}, options || {})
	let collectionName = opt.collectionName


	// setup collections
	if (!webhandle.dbs[dbName].collections[collectionName]) {
		webhandle.dbs[dbName].collections[collectionName] = webhandle.dbs[dbName].db.collection(collectionName)
	}

	// Setup data service
	let dataService = new UrlRequestDataService({
		collections: {
			default: webhandle.dbs[dbName].collections[collectionName]
		}
	})
	webhandle.services['urlRequest'] = dataService
	



	if(!opt.dreckOptions.dataService) {
		opt.dreckOptions.dataService = dataService
	}

	// setup admin gui tools
	let dreck = new UrlRequestDreck(opt.dreckOptions)
	let router = dreck.addToRouter(express.Router())
	if(!webhandle.drecks) {
		webhandle.drecks = {}
	}
	webhandle.drecks['urlRequest'] = dreck
	
	if(opt.allowedGroups && opt.allowedGroups.length > 0) {
		let securedRouter = allowGroup(
			opt.allowedGroups,
			router
		)
		webhandle.routers.primary.use(opt.mountPoint, securedRouter)
	}
	else {
		// Use this for testing or when no group is needed to access
		webhandle.routers.primary.use(opt.mountPoint, router)
	}
	
	let server = new DataServiceServer({
		dataService: dataService
	})
	let serviceRouter = express.Router()
	server.addToRouter(serviceRouter)
	router.use('/services/urlRequest', serviceRouter)
	
	setupCaptureRequests(opt.filter)

	if(!templatesAdded) {
		templatesAdded = true

		// add templates directory
		if (opt.templateDir) {
			webhandle.addTemplateDir(path.join(webhandle.projectRoot, opt.templateDir))
		}

		// webhandle.templateLoaders.push((name, callback) => {
		// 	callback(templates[name])
		// })
	}
	
	integrate.service = dataService
	integrate.dreck = dreck
}

integrate.templates = templates

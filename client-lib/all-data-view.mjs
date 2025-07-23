
import { View } from '@webhandle/backbone-view'

import {allDataViewFrame, byUsersTable, byResourcesTable} from '../views/load-browser-views.mjs'
import createAlwaysHasMap from './always-has-map.mjs'
import UserInfoMap from './user-info-map.mjs'


export default class AllDataView extends View {
	constructor(options) {
		super(options)

	}

	preinitialize() {
		this.events = {
			'click button[name="update-now"]': 'updateData'
		}
	}

	render() {
		this.el.innerHTML = allDataViewFrame()
		return this
	}
	
	filterRows(rows) {
		return rows
	}
	
	simplifyToUserResourceDate(rows) {
		return rows.map(row => {
			let simp = {
				timestamp: row.timestamp
				, originalUrl: row.originalUrl
			}
			
			if(row.originalUrl == '/') {
				simp.resource = '/'
			}
			else {
				simp.resource = row.originalUrl.split('/').map(part => part.trim()).filter(part => !!part).pop()
			}
			
			if(row.user) {
				simp.user = row.user.name
			}
			else {
				simp.user = 'unknown'
			}
			
			return simp
		})
	}

	
	createUserTree(simps) {
		let users = new UserInfoMap()
		
		for(let simp of simps) {
			let userRecord = users.get(simp.user)
			userRecord.resources[simp.resource] = (userRecord.resources[simp.resource] || 0) + 1
		}
		
		return users
	}

	createResourceTree(simps) {
		let users = new UserInfoMap()
		
		for(let simp of simps) {
			let resourceRecord = users.get(simp.resource)
			resourceRecord.resources[simp.user] = (resourceRecord.resources[simp.user] || 0) + 1
		}
		
		return users
	}

	async updateData(evt, selected) {
		let year = this.el.querySelector('input[name="year"]').value
		let monthIndex = parseInt(this.el.querySelector('select[name="month"]').value) - 1
		let layout = this.el.querySelector('select[name="layout"]').value
		
		let start = Date.UTC(year, monthIndex, 1, 0, 0, 0)
		if(monthIndex === 11) {
			year++
			monthIndex = 0
		}
		else {
			monthIndex++
		}
		let end = Date.UTC(year, monthIndex, 1, 0, 0, 0)

		
		let rows = await this.dataService.fetch({
			timestamp: {
				$gt: start
				, $lt: end
			}
		})
		
		rows = this.filterRows(rows)
		
		if(rows.length > 0) {
			let simps = this.simplifyToUserResourceDate(rows)
			
			if(layout === 'by-user') {
				let users = this.createUserTree(simps)
				this.el.querySelector('.data-show').innerHTML = byUsersTable(users)
				
			}
			else if(layout === 'by-resource') {
				let resources = this.createResourceTree(simps)
				this.el.querySelector('.data-show').innerHTML = byUsersTable(resources)
				
			}
			else {
				this.el.querySelector('.data-show').innerHTML = '<pre>' + JSON.stringify(rows, null, '\t') + '</pre>'
			}

		}
		else {
			this.el.querySelector('.data-show').innerHTML = '<p>No data for this period.</p>'
		}
		
		
	}
}


export default class UserInfoMap {
	
	
	get(userName) {
		if(userName in this) {
			return this[userName]
		}
		else {
			let user = {
				name: userName
				, resources: {}
				, getSortedResources() {
					let rscs = Object.entries(this.resources)
					rscs.sort((one, two) => {
						return one[1] > two[1] ? -1 : 1
					})
					return rscs
				}
			}
			this[userName] = user
			return user
		}
	}
}
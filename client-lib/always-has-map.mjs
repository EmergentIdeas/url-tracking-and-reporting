export default function createAlwaysHasMap(options) {
	
	let raw = {}
	let proxied = new Proxy(raw, {
		get(target, prop, receiver) {
			if(prop in raw) {
				return raw[prop]
			}
			else {
				if(options.createProperty) {
					raw[prop] = options.createProperty(prop)
				}
				else {
					raw[prop] = {}
				}
			}
		}
	})
	
	return proxied
}
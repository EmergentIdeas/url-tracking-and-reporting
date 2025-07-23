let initialized = false
import serverIntegrator from "../integrator.mjs"
export default function enableUrlRequest(dbName, options) {
	if (!initialized) {
		initialized = true
		serverIntegrator(dbName, options)
	}
}


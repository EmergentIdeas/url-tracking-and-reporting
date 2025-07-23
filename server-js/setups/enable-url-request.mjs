let initialized = false
import serverIntegrator from "../../server-lib/integrator.mjs"
export default function enableUrlRequest(dbName, options) {
	if (!initialized) {
		initialized = true
		serverIntegrator(dbName, options)
	}
}


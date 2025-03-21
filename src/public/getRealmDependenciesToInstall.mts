import type {API} from "#~src/API.d.mts"
import {createEntity} from "@enkore/spec"

const impl: API["getRealmDependenciesToInstall"] = async function() {
	return {
		"@enkore/realm-js-and-web-utils": createEntity(
			"EnkoreCoreRealmDependencyInstallSpecification", 0, 0, {
				version: "0.0.8",
				importKind: "star"
			}
		),
		"@aniojs/node-my-ts": createEntity(
			"EnkoreCoreRealmDependencyInstallSpecification", 0, 0, {
				version: "0.16.2",
				importKind: "star"
			}
		)
	}
}

export const getRealmDependenciesToInstall = impl

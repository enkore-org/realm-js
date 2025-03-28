import type {API} from "#~src/API.d.mts"
import {getInternalData} from "#~src/getInternalData.mts"
import {getRealmDependency} from "#~src/getRealmDependency.mts"

const impl: API["hook"]["preLint"] = async function(session) {
	const nodeMyTS = getRealmDependency(session, "@enkore/typescript")
	const myProgram = getInternalData(session).myTSProgram

	const realmOptions = session.realm.getConfig("js")

	if (realmOptions.exports) {
		for (const x in realmOptions.exports) {
			const p = realmOptions.exports[x]

			if (!p.checkAgainstInterface) continue
			if (!p.checkAgainstInterface.named) continue

			const [interfaceSource, interfaceName] = p.checkAgainstInterface.named

			const modules = getInternalData(session).entryPointMap.get(x)!;

			let testCodeImports = ``, testCode = ``

			testCodeImports += `import type {${interfaceName} as __InterfaceToTestAgainst} from "${interfaceSource}"\n`
			testCode += `const exportObject: __InterfaceToTestAgainst = {\n`

			for (const [exportName, meta] of modules) {
				if (meta.descriptor.kind === "type") continue

				testCodeImports += `import {${exportName}} from "../${meta.relativePath}"\n`

				testCode += `    ${exportName},\n`
			}

			testCode += `}\n`

			const vFile = nodeMyTS.defineVirtualProgramFile(
				`project/src/testInterfaceCode.mts`, `${testCodeImports}\n${testCode}`
			)

			const {program: testProg} = nodeMyTS.createProgram(
				session.project.root,
				[vFile],
				getInternalData(session).myTSProgram.compilerOptions
			)

			console.log(
				nodeMyTS.typeCheckModule(testProg.getModule(vFile.path), true)
			)
		}
	}

	if (session.enkore.getOptions().isCIEnvironment) {
		session.enkore.emitMessage(
			"info", "doing complete typescript check (ci-only)"
		)

		const {diagnosticMessages} = nodeMyTS.typeCheckProgram(myProgram)

		for (const msg of diagnosticMessages) {
			session.enkore.emitMessage(
				"error", msg.message
			)
		}
	}
}

export const preLint = impl

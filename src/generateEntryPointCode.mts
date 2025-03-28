import type {InternalData} from "./InternalData.d.mts"

type EntryPointMap = InternalData["entryPointMap"]
// thanks to josephjnk https://www.reddit.com/r/typescript/comments/hf5g3a/comment/fvvn0ez/
type MapValueType<A> = A extends Map<any, infer V> ? V : never;
type EntryPoint = MapValueType<EntryPointMap>

export function generateEntryPointCode(
	entryPoint: EntryPoint,
	declarationOnly: boolean
): string {
	let code = ``

	for (const [exportName, meta] of entryPoint.entries()) {
		if (!declarationOnly && meta.descriptor.kind === "type") continue

		if (meta.descriptor.kind === "type") {
			code += `export type {${exportName}} from "./${meta.pathToDtsFile}"\n`
		} else {
			code += `export {${exportName}} from "./${meta.pathToJsFile}"\n`
		}
	}

	return code
}

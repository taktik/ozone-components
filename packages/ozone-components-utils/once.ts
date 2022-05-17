export default function once<T, U extends (...args: any[]) => T>(fun: U): U {
	let executed = false

	return ((...args: any[]) => {
		if (executed) {
			return
		}
		const result = fun(...args)
		executed = true
		return result
	}) as U
}

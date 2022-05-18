export default function once<T, U extends (...args: any[]) => T>(fun: U): U {
	let executed = false
	let firstResult: T

	return ((...args: any[]) => {
		if (!executed) {
			firstResult = fun(...args)
			executed = true
		}
		return firstResult
	}) as U
}

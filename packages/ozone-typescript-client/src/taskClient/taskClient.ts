import { UUID, TaskExecution, GroupExecution } from 'ozone-type'

export interface TaskClient {
	waitForTask<T>(taskId: UUID): TaskHandler<T>
}

export interface TaskHandlerOption {
	/**
	 * Skip waiting on sub-task.
	 * Resolve as soon as the primary task is done.
	 */
	skipWaitingOnSubTask?: boolean

	/**
	 * poll interval to refresh task status
	 */
	pollInterval?: number
}
export interface TaskHandler<T = any> {

	/**
	 * on Finish callback
	 */
	onFinish?: (taskExecution: TaskExecution) => void

	/**
	 * on Error callback
	 */
	onError?: (taskExecution: TaskExecution) => void

	/**
	 * on Progress callback
	 */
	onProgress?: (taskExecution: TaskExecution) => void

	/**
	 * cancel the waiting acion on the task
	 */
	stopWaiting(): void

	/**
	 * Promise that resolve on task completion the the primary task result.
	 */
	readonly waitResult: Promise<T | undefined>
}

import { UUID, TaskExecution, GroupExecution } from 'ozone-type'

export interface TaskClient {
	waitForTask(taskId: UUID): TaskHandler
}

export interface TaskHandler<T = any> {

	onFinish?: (taskExecution: TaskExecution) => void

	onError?: (taskExecution: TaskExecution) => void

	onProgress?: (taskExecution: TaskExecution) => void

	stopWaiting(): void

	readonly waitResult: Promise<T | undefined>
}

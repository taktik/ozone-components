import { UUID, TaskExecution, GroupExecution } from 'ozone-type'
import { TaskClient, TaskHandler } from './taskClient'
import { OzoneClient } from '../ozoneClient/ozoneClient'
import { httpclient } from 'typescript-http-client'
import Request = httpclient.Request

export class TaskClientImpl implements TaskClient {
	constructor(private client: OzoneClient, private baseUrl: string) {}

	waitForTask(taskId: UUID): TaskHandlerImpl {
		return new TaskHandlerImpl(taskId, this.client, this.baseUrl)
	}
}

export class TaskHandlerImpl<T = any> implements TaskHandler {

	onFinish?: (taskExecution: TaskExecution) => void

	onError?: (taskExecution: TaskExecution) => void

	onProgress?: (taskExecution: TaskExecution) => void

	private interval?: number

	cancel(): void {
		clearInterval(this.interval)
	}

	private executeCallback(callback: ((taskExecution: TaskExecution) => void) | undefined, param: TaskExecution) {
		if (callback) {
			setTimeout(() => callback(param))
		}
	}
	readonly waitResult: Promise<T | undefined>

	constructor(taskId: string, private client: OzoneClient, private baseUrl: string, private pollInterval: number = 500) {
		this.waitResult = this._waitForTask(taskId)
	}

	private _waitForSubTasks(asyncTasksGroupId: string): Promise<void> {
		debugger
		let mediaId: string
		return (new Promise((resolve, reject) => {
			this.interval = window.setInterval(() => {
				this._awaitTask(asyncTasksGroupId)
					.then((data: GroupExecution) => {
						if (data.stepsCount === data.stepsDone) {
							this.cancel()
							resolve()
						} else if (data.hasErrors) {
							reject('possessing tasks as an error')
 }
					})
					.catch((error) => {
						this.cancel()
						reject(error)
					})
			}, this.pollInterval)
		}))
	}
	private _waitForTask<T>(taskId: string): Promise<T | undefined> {
		let primaryTaskResult: T
		return (new Promise<TaskExecution>((resolve, reject) => {
			let interval = setInterval(() => {
				this._awaitTask(taskId)
					.then((data: GroupExecution) => {
						if (data && data.taskExecutions) {
							const taskExecution: TaskExecution = data.taskExecutions[taskId]
							this.executeCallback(this.onProgress, taskExecution)

							if (taskExecution &&
								taskExecution.completed ||
								taskExecution.completed) {
								clearInterval(interval)
								if (taskExecution.taskResult) {
									primaryTaskResult = taskExecution.taskResult
								}
								resolve(taskExecution)
							}
						}
					})
					.catch((error) => {
						clearInterval(interval)
						reject(error)
					})
			}, this.pollInterval)
		}))
			// .then((taskResult: TaskExecution): any => {
			// 	// if (taskResult.groupId) {
			// 	// 	return this._waitForSubTasks(taskResult.asyncTasksGroupId)
			// 	// }
			// })
			.then((taskResult: TaskExecution) => {
				this.executeCallback(this.onFinish, taskResult)
				return primaryTaskResult
			})
	}

	private async _awaitTask(taskId: string): Promise<GroupExecution> {
		const url = `${this.baseUrl}/rest/v3/task/wait/${taskId}/120`
		const request = new Request(url)
			.setMethod('GET')
		return this.client.call<GroupExecution>(request)
	}
}


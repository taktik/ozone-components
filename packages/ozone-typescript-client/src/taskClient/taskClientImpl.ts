import { UUID, TaskExecution, GroupExecution } from 'ozone-type'
import { TaskClient, TaskHandler, TaskHandlerOption } from './taskClient'
import { OzoneClient } from '../ozoneClient/ozoneClient'
import { httpclient } from 'typescript-http-client'
import Request = httpclient.Request

export class TaskClientImpl implements TaskClient {
	constructor(private client: OzoneClient, private baseUrl: string) {}

	waitForTask<T>(taskId: UUID, options?: TaskHandlerOption): TaskHandlerImpl {
		return new TaskHandlerImpl<T>(taskId, this.client, this.baseUrl, options || {})
	}
}

export class TaskHandlerImpl<T = any> implements TaskHandler {

	onFinish?: (taskExecution: TaskExecution) => void

	onError?: (taskExecution: TaskExecution) => void

	onProgress?: (taskExecution: TaskExecution) => void

	private subTaskinterval?: number

	private pollInterval: number

	private interval?: number

	private rejectPromise?: (reason?: any) => void

	stopWaiting(): void {
		this._clearPullInterval()
		this.executeCallback(this.onError, { error: 'Wait for task canceled' })
		this.executeCallback(this.rejectPromise, { error: 'Wait for task canceled' })
	}

	_clearPullInterval(): void {
		clearInterval(this.subTaskinterval)
		clearInterval(this.interval)
	}

	private executeCallback(callback: ((taskExecution: TaskExecution) => void) | undefined, param: TaskExecution) {
		if (callback) {
			setTimeout(() => callback(param))
		}
	}
	readonly waitResult: Promise<T | undefined>

	constructor(taskId: string, private client: OzoneClient, private baseUrl: string, private options: TaskHandlerOption) {
		this.pollInterval = options.pollInterval || 500
		this.waitResult = this._waitForTask(taskId)
	}

	private _waitForSubTasks(asyncTasksGroupId: string): Promise<void> {
		return (new Promise((resolve, reject) => {
			this.subTaskinterval = window.setInterval(() => {
				this._awaitTask(asyncTasksGroupId)
					.then((data: GroupExecution) => {
						if (data.stepsCount === data.stepsDone) {
							this._clearPullInterval()
							resolve()
						} else if (data.hasErrors) {
							reject('One of the possessing sub tasks as an error')
 }
					})
					.catch((error) => {
						this._clearPullInterval()
						reject(error)
					})
			}, this.pollInterval)
		}))
	}
	private _waitForTask<T>(taskId: string): Promise<T | undefined> {
		let primaryTaskResult: TaskExecution
		return (new Promise<TaskExecution>((resolve, reject) => {
			this.rejectPromise = reject
			this.interval = window.setInterval(() => {
				this._awaitTask(taskId)
					.then((data: GroupExecution) => {
						if (data && data.taskExecutions) {
							const taskExecution: TaskExecution = data.taskExecutions[taskId]
							this.executeCallback(this.onProgress, taskExecution)
							if (data.hasErrors) {
								this.executeCallback(this.onError, taskExecution)
								clearInterval(this.interval)
								reject(Error(taskExecution.error || 'Error in ozone task'))

							} else if (taskExecution.completed) {
								this._clearPullInterval()
								primaryTaskResult = taskExecution
								resolve(taskExecution)
							}
						}
					})
					.catch((error) => {
						clearInterval(this.interval)
						reject(error)
					})
			}, this.pollInterval)
		}))
			.then((taskResult: TaskExecution): any => {
				if (!this.options.skipWaitingOnSubTask
					&& taskResult.taskResult
					&& taskResult.taskResult.asyncTasksGroupId) {
					return this._waitForSubTasks(taskResult.taskResult.asyncTasksGroupId)
				}
			})
			.then((taskResult: TaskExecution) => {
				this.executeCallback(this.onFinish, primaryTaskResult)
				return primaryTaskResult.taskResult
			})
	}

	private async _awaitTask(taskId: string): Promise<GroupExecution> {
		const url = `${this.baseUrl}/rest/v3/task/wait/${taskId}/120`
		const request = new Request(url)
			.setMethod('GET')
		return this.client.call<GroupExecution>(request)
	}
}

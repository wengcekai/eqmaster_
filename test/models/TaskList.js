export default class TaskList {
	constructor(taskList) {
		this.taskList = taskList;
		this.taskLength = taskList.length ? taskList.length : 0;
		this.doneTaskLength = 0;
	}

	getTask(index) {
		return this.taskList[index];
	}

	addTask(task) {
		this.taskList.push(task);
		this.taskLength += 1;
	}

	getDoneTaskLength() {
		return this.doneTaskLength;
	}

	getTotalTaskLength() {
		return this.taskLength;
	}

	getOnceTaskCount() {
		return this.taskList.reduce((count, task) => {
			return task.once ? count + 1 : count;
		}, 0);
	}

	async execute(judgeResult) {
		const checkPromises = this.taskList.map((task) => task.executeCheck(judgeResult))
		await Promise.all(checkPromises)

		// 使用 forEach 判断所有任务是否完成
		this.taskList.forEach((task) => {
			if (!task.once && task.status) {
				this.doneTaskLength += 1;
				task.once = true;
				return;
			}
		})
		if (this.doneTaskLength === this.taskLength) return true;
		return false;
	}

}
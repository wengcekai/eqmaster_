// src/models/Task.js

export default class Task {
	constructor(id, title, check, status = false, totalRoundNum = 1, completedRoundNum = 0) {
		this._id = id
		this._title = title
		this._check = check // 检查任务完成状态的方法
		this._status = status // 表示任务是否完成
		this.once = false; // 确保任务完成后不会被执行
		this.judgeResult = {};
		this.totalRoundNum = totalRoundNum;
		this._completedRoundNum = completedRoundNum;
	}

	// Getter 和 Setter for id
	get id() {
		return this._id
	}

	set id(value) {
		this._id = value
	}

	// Getter 和 Setter for title
	get title() {
		return this._title
	}

	set title(value) {
		this._title = value
	}

	// Getter 和 Setter for status
	get status() {
		return this._status
	}

	set status(value) {
		this._status = value
	}

	set completedRoundNum(value) {
		this._completedRoundNum = value
	}

	// 执行检查方法
	async executeCheck(judgeResult) {
		const isFinished = await this._check(judgeResult)
		if (isFinished || this.once) {
			this.status = true
		}
		return isFinished
	}
}
// 定义常量URL
const BASE_URL = 'https://eqmaster-gfh8gvfsfwgyb7cb.eastus-01.azurewebsites.net/chat/batttlefield';
const EVAL_URL = 'https://eqmaster-gfh8gvfsfwgyb7cb.eastus-01.azurewebsites.net/eval/battlefield';
//return await sendRequest(chatHistory.person_id, chatHistory.course_id, body, EVAL_URL);
function sendRequest(person_id, course_id, chat_content, outerBody, url = BASE_URL) {
	return new Promise((resolve, reject) => {
		const formattedChatContent = [];
		let assistantDialog = {
			role: 'assistant',
			content: [{
				type: 'text',
				text: {
					dialog: []
				}
			}]
		};

		// 遍历 chat_content，将“领导”、“同事A”、“同事B”的对话存入 dialog 数组中
		chat_content.forEach(chat => {
			if (['领导', '同事A', '同事B'].includes(chat.role)) {
				assistantDialog.content[0].text.dialog.push({
					role: chat.role,
					content: chat.content
				});
			} else {
				// 非 assistant 且非 tipping 的对话直接加入 formattedChatContent
				if (chat.role !== 'tipping') {
					formattedChatContent.push({
						...chat,
						content: Array.isArray(chat.content) ? chat.content.map(c => ({
							type: c.type || 'text',
							text: c.text || c
						})) : chat.content
					});
				}
			}
		});

		// 将 dialog 转为 JSON 字符串格式
		assistantDialog.content[0].text = JSON.stringify(assistantDialog.content[0].text, null, 4);

		// 将组合好的 assistant 对象插入到结果数组中
		formattedChatContent.unshift(assistantDialog);

		console.log(formattedChatContent);

		const body = outerBody || {
			person_id: person_id || Math.floor(Math.random() * 500),
			course_id: parseInt(course_id) || 1,
			chat_content: JSON.stringify(formattedChatContent)
		};

		console.log('body:', body);

		uni.request({
			url: url,
			method: 'POST',
			header: {
				'Content-Type': 'application/json'
			},
			data: body,
			success: (res) => {
				console.log('请求成功:', res);
				resolve(res.data);
			},
			fail: (err) => {
				console.error('请求失败:', err);
				reject(err);
			}
		});
	});
}

// 导出startField函数
export async function startField(person_id, course_id) {
	return await sendRequest(person_id, course_id, [{
		role: "user",
		content: [{
			type: "text",
			text: "开始测试"
		}]
	}]);
}

// 导出reply函数
export async function reply(chatHistory) {
	// console.log(chatHistory);
	return await sendRequest(chatHistory.person_id, chatHistory.course_id, chatHistory);
}

// 导出helpReply函数
export async function helpReply(chatHistory) {
	// 在 chat_content 中插入“帮我回答”
	chatHistory.push({
		role: "user",
		content: [{
			type: "text",
			text: "帮我回答"
		}]
	});
	const result = await sendRequest(chatHistory.person_id, chatHistory.course_id, chatHistory);
	chatHistory.pop();
	return result;
}

// 导出hint函数
export async function hint(chatHistory) {
	// 在 chat_content 中插入“给我提示”
	chatHistory.push({
		role: "user",
		content: [{
			type: "text",
			text: "给我提示"
		}]
	});
	const result = await sendRequest(chatHistory.person_id, chatHistory.course_id, chatHistory);
	chatHistory.pop();
	return result;
}

// 导出continueChat函数
export async function continueChat(chatHistory) {
	// 在 chat_content 中插入“继续”
	chatHistory.push({
		role: "user",
		content: [{
			type: "text",
			text: "继续"
		}]
	});
	const result = await sendRequest(chatHistory.person_id, chatHistory.course_id, chatHistory);
	chatHistory.pop();
	return result;
}

// 导出evalBattlefield函数，发送到 /eval/battlefield
// export async function evalBattlefield(chatHistory) {
// 	return await sendRequest(chatHistory.person_id, chatHistory.course_id, chatHistory, EVAL_URL);
// }
export async function evalBattlefield(chatHistory, isPass, gemCount, diamonds) {
	// 在 body 中添加 isPass, gemCount, diamonds
	const body = {
		person_id: chatHistory.person_id || Math.floor(Math.random() * 500),
		course_id: chatHistory.course_id || 3,
		chat_content: JSON.stringify(chatHistory),
		status: isPass ? "completed" : "incompleted", // 添加 isPass
		result: gemCount, // 添加 gemCount
		person_star: diamonds // 添加 diamonds
	};
	console.log("evalBattlefield chatHistory: ", chatHistory)
	console.log("evalBattlefield body: ", body)

	// 发送请求
	return await sendRequest(chatHistory.person_id, chatHistory.course_id, chatHistory, body, EVAL_URL);
}


export function filterChatHistory(chatHistory) {
	const keywords = ["继续", "给我提示", "帮我回答", "开始测试"];

	return chatHistory.filter(chat => {
		for (let keyword of keywords) {
			if (chat.content.includes(keyword)) {
				return false; // 该条目被过滤掉
			}
		}

		// 如果 role 不是 tipping 且不包含关键字，则保留该条目
		return true;
	});
}

export function getNpcIndex(role) {
	if (role == '老板') {
		return 0;
	}
	if (role == "同事A") {
		return 1;
	}
	if (role == "同事B") {
		return 2;
	}

	return -1;
}
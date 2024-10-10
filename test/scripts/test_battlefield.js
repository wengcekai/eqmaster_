// testScript.js

// 导入chatFunctions.js中的所有函数
import {
	startField,
	reply,
	helpReply,
	hint,
	continueChat,
	evalBattlefield
} from './battlefield-chat.js';

// 模拟的 chatHistory 数据
const chatHistory = {
	person_id: 0,
	course_id: "test_course",
	chat_content: [{
		role: "user",
		content: [{
			type: "text",
			text: "开始测试"
		}]
	}]
};

// 测试脚本，使用async/await语法
async function testChatFunctions() {
	try {
		// 测试 startField 函数
		let response = await startField(0, "test_course");
		console.log('startField 请求的返回结果:', response);

		// 测试 reply 函数
		response = await reply(chatHistory);
		console.log('reply 请求的返回结果:', response);

		// 测试 helpReply 函数
		response = await helpReply(chatHistory);
		console.log('helpReply 请求的返回结果:', response);

		// 测试 hint 函数
		response = await hint(chatHistory);
		console.log('hint 请求的返回结果:', response);

		// 测试 continueChat 函数
		response = await continueChat(chatHistory);
		console.log('continueChat 请求的返回结果:', response);

		// 测试 evalBattlefield 函数
		response = await evalBattlefield(chatHistory);
		console.log('evalBattlefield 请求的返回结果:', response);

	} catch (error) {
		console.error(error);
	}
}

// 执行测试
testChatFunctions();
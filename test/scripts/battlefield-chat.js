// 定义常量URL
const BASE_URL =
  "https://eqmaster-gfh8gvfsfwgyb7cb.eastus-01.azurewebsites.net/chat/batttlefield";
const EVAL_URL =
  "https://eqmaster-gfh8gvfsfwgyb7cb.eastus-01.azurewebsites.net/eval/battlefield";
const TOOLTIP_URL =
  "https://eqmaster-gfh8gvfsfwgyb7cb.eastus-01.azurewebsites.net/course_exists";
//return await sendRequest(chatHistory.person_id, chatHistory.course_id, body, EVAL_URL);
function sendRequest(
  person_id,
  course_id,
  chat_content,
  outerBody,
  url = BASE_URL
) {
  return new Promise((resolve, reject) => {
    const formattedChatContent = formatChatContent(chat_content);
    console.log("formattedChatContent:", formattedChatContent);
    const body = outerBody || {
      person_id: person_id || Math.floor(Math.random() * 500),
      course_id: parseInt(course_id) || 1,
      chat_content: JSON.stringify(formattedChatContent),
    };

    console.log("body:", body);

    uni.request({
      url: url,
      method: "POST",
      header: {
        "Content-Type": "application/json",
      },
      data: body,
      success: (res) => {
        console.log("请求成功:", res);
        resolve(res.data);
      },
      fail: (err) => {
        console.error("请求失败:", err);
        reject(err);
      },
    });
  });
}

function formatChatContent(chat_content) {
  const formattedChatContent = [];
  let assistantDialog = {
    role: "assistant",
    content: [
      {
        type: "text",
        text: {
          dialog: [],
        },
      },
    ],
  };

  chat_content.forEach((chat) => {
    if (["领导", "同事A", "同事B"].includes(chat.role)) {
      // If the role is one of the NPCs, add it to the assistant's dialog
      assistantDialog.content[0].text.dialog.push({
        role: chat.role,
        content: chat.content,
      });
    } else {
      // If the role is not an NPC and not 'tipping', it's a user turn
      if (chat.role !== "tipping") {
        // Push the current assistantDialog to formattedChatContent
        if (assistantDialog.content[0].text.dialog.length > 0) {
          // Convert dialog to a string
          assistantDialog.content[0].text = JSON.stringify(
            assistantDialog.content[0].text,
            null,
            4
          );
          formattedChatContent.push(assistantDialog);

          // Reset assistantDialog for the next batch of NPC dialogues
          assistantDialog = {
            role: "assistant",
            content: [
              {
                type: "text",
                text: {
                  dialog: [],
                },
              },
            ],
          };
        }

        // Add the user's dialogue to formattedChatContent
        const userDialog = {
          role: chat.role,
          content: Array.isArray(chat.content)
            ? chat.content.map((c) => ({
                type: c.type || "text",
                text: c.text || c,
              }))
            : [
                {
                  type: "text",
                  text: chat.content,
                },
              ],
        };

        // Add the user's dialogue to formattedChatContent
        formattedChatContent.push(userDialog);

      }
    }
  });

  // Add any remaining assistant dialog to the formattedChatContent, but should
  // no way codes execute this block.
  if (assistantDialog.content[0].text.dialog.length > 0) {
    assistantDialog.content[0].text = JSON.stringify(
      assistantDialog.content[0].text,
      null,
      4
    );
    formattedChatContent.push(assistantDialog);
  }

  return formattedChatContent;
}

// 导出startField函数
export async function startField(person_id, course_id) {
  return await sendRequest(person_id, course_id, [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "开始测试",
        },
      ],
    },
  ]);
}

// 导出reply函数
export async function reply(chatHistory) {
  console.log("reply:", chatHistory);
  return await sendRequest(
    chatHistory.person_id,
    chatHistory.course_id,
    chatHistory
  );
}

// 导出helpReply函数
export async function helpReply(chatHistory) {
  // 在 chat_content 中插入“帮我回答”
  chatHistory.push({
    role: "user",
    content: [
      {
        type: "text",
        text: "帮我回答",
      },
    ],
  });
  const result = await sendRequest(
    chatHistory.person_id,
    chatHistory.course_id,
    chatHistory
  );
  chatHistory.pop();
  return result;
}

// 导出hint函数
export async function hint(chatHistory) {
  // 在 chat_content 中插入“给我提示”
  chatHistory.push({
    role: "user",
    content: [
      {
        type: "text",
        text: "给我提示",
      },
    ],
  });
  const result = await sendRequest(
    chatHistory.person_id,
    chatHistory.course_id,
    chatHistory
  );
  chatHistory.pop();
  return result;
}

// 导出continueChat函数
export async function continueChat(chatHistory) {
  // 在 chat_content 中插入“继续”
  chatHistory.push({
    role: "user",
    content: [
      {
        type: "text",
        text: "继续",
      },
    ],
  });
  const result = await sendRequest(
    chatHistory.person_id,
    chatHistory.course_id,
    chatHistory
  );
  chatHistory.pop();
  console.log("after pop:", chatHistory);
  return result;
}

// 请求后端是否显示工具提示
export async function checkShowToolTips(personId) {
  return new Promise((resolve, reject) => {
    // 构造完整的请求 URL
    const url = `${TOOLTIP_URL}/${personId}`; // 使用传入的 personId

    uni.request({
      url: url, // 使用构造的 URL
      method: "GET", // 使用 GET 请求
      success: (res) => {
        // 假设后端返回的是直接的 true/false
        if (typeof res.data === "boolean") {
          resolve(res.data); // 返回后端的 true/false
        } else {
          reject("Invalid response format");
        }
      },
      fail: (err) => {
        console.error("请求失败:", err);
        reject(err);
      },
    });
  });
}
// 导出evalBattlefield函数，发送到 /eval/battlefield
// export async function evalBattlefield(chatHistory) {
// 	return await sendRequest(chatHistory.person_id, chatHistory.course_id, chatHistory, EVAL_URL);
// }
export async function evalBattlefield(chatHistory, isPass, gemCount, diamonds) {
  // 在 body 中添加 isPass, gemCount, diamonds
  const body = {
    person_id: chatHistory.person_id || Math.floor(Math.random() * 500),
    course_id: chatHistory.course_id || 1,
    chat_content: JSON.stringify(chatHistory),
    status: isPass ? "completed" : "incompleted", // 添加 isPass
    result: gemCount, // 添加 gemCount
    person_star: diamonds, // 添加 diamonds
  };
  console.log("evalBattlefield chatHistory: ", chatHistory);
  console.log("evalBattlefield body: ", body);

  // 发送请求
  return await sendRequest(
    chatHistory.person_id,
    chatHistory.course_id,
    chatHistory,
    body,
    EVAL_URL
  );
}

export function filterChatHistory(chatHistory) {
  const keywords = ["继续", "给我提示", "帮我回答", "开始测试"];

  return chatHistory.filter((chat) => {
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
  if (role == "老板") {
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
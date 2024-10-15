if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  const _imports_0$f = "/static/splash.png";
  const _imports_1$7 = "/static/landingB.png";
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$y = {
    data() {
      return {
        showSplash: true,
        // 控制闪屏显示
        username: ""
        // 用于存储从上一页接收的用户名
      };
    },
    methods: {
      startQuiz() {
        this.username = "user_" + Math.floor(Math.random() * 1e4);
        uni.navigateTo({
          url: `/pages/experience/experience?username=${this.username}`
        });
      },
      goToLogin() {
        uni.navigateTo({
          url: "/pages/login/login"
        });
      }
    },
    onLoad(options) {
      if (options.username) {
        this.username = options.username;
      }
    },
    mounted() {
      formatAppLog("log", "at pages/landing/landing.vue:51", "页面已挂载，showSplash:", this.showSplash);
      setTimeout(() => {
        formatAppLog("log", "at pages/landing/landing.vue:54", "隐藏闪屏");
        this.showSplash = false;
      }, 300);
    }
  };
  function _sfc_render$x(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      $data.showSplash ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "splash-screen"
      }, [
        vue.createElementVNode("image", {
          class: "splash-image",
          src: _imports_0$f,
          mode: "aspectFill"
        })
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 添加背景图片 "),
      vue.createElementVNode("image", {
        class: "background-image",
        src: _imports_1$7,
        mode: "widthFix"
      }),
      vue.createCommentVNode(" 开始体验按钮 "),
      vue.createElementVNode("view", {
        class: "button button1",
        onClick: _cache[0] || (_cache[0] = (...args) => $options.startQuiz && $options.startQuiz(...args))
      }, [
        vue.createElementVNode("text", { class: "button-text" }, "开始体验")
      ]),
      vue.createElementVNode("text", { class: "login-text" }, "登录已有账号")
    ]);
  }
  const PagesLandingLanding = /* @__PURE__ */ _export_sfc(_sfc_main$y, [["render", _sfc_render$x], ["__scopeId", "data-v-f45ff4f6"], ["__file", "/Users/peipeiwang/wppDev/eqmaster_/test/pages/landing/landing.vue"]]);
  const BASE_URL = "https://eqmaster-gfh8gvfsfwgyb7cb.eastus-01.azurewebsites.net/chat/batttlefield";
  const EVAL_URL = "https://eqmaster-gfh8gvfsfwgyb7cb.eastus-01.azurewebsites.net/eval/battlefield";
  function sendRequest(person_id, course_id, chat_content, url = BASE_URL) {
    return new Promise((resolve, reject) => {
      const formattedChatContent = [];
      let assistantDialog = {
        role: "assistant",
        content: [{
          type: "text",
          text: {
            dialog: []
          }
        }]
      };
      chat_content.forEach((chat) => {
        if (["领导", "同事A", "同事B"].includes(chat.role)) {
          assistantDialog.content[0].text.dialog.push({
            role: chat.role,
            content: chat.content
          });
        } else {
          formattedChatContent.push({
            ...chat,
            content: Array.isArray(chat.content) ? chat.content.map((c) => ({
              type: c.type || "text",
              text: c.text || c
            })) : chat.content
          });
        }
      });
      assistantDialog.content[0].text = JSON.stringify(assistantDialog.content[0].text, null, 4);
      formattedChatContent.unshift(assistantDialog);
      formatAppLog("log", "at scripts/battlefield-chat.js:43", formattedChatContent);
      const body = {
        person_id: person_id || 1,
        course_id: course_id || 1,
        chat_content: JSON.stringify(formattedChatContent)
      };
      formatAppLog("log", "at scripts/battlefield-chat.js:51", "body:", body);
      uni.request({
        url,
        method: "POST",
        header: {
          "Content-Type": "application/json"
        },
        data: body,
        success: (res) => {
          formatAppLog("log", "at scripts/battlefield-chat.js:61", "请求成功:", res);
          resolve(res.data);
        },
        fail: (err) => {
          formatAppLog("error", "at scripts/battlefield-chat.js:65", "请求失败:", err);
          reject(err);
        }
      });
    });
  }
  async function startField(person_id, course_id) {
    return await sendRequest(person_id, course_id, [{
      role: "user",
      content: [{
        type: "text",
        text: "开始测试"
      }]
    }]);
  }
  async function reply(chatHistory) {
    return await sendRequest(chatHistory.person_id, chatHistory.course_id, chatHistory);
  }
  async function continueChat(chatHistory) {
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
  async function evalBattlefield(chatHistory) {
    return await sendRequest(chatHistory.person_id, chatHistory.course_id, chatHistory, EVAL_URL);
  }
  function filterChatHistory(chatHistory) {
    const keywords = ["继续", "给我提示", "帮我回答", "开始测试"];
    return chatHistory.filter((chat) => {
      for (let keyword of keywords) {
        if (chat.content.includes(keyword)) {
          return false;
        }
      }
      return true;
    });
  }
  function getNpcIndex(role) {
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
  const _imports_0$e = "/static/battlefield/background.png";
  const _sfc_main$x = {
    async mounted() {
      const result = await startField(1, "string");
      formatAppLog("log", "at pages/battlefield/battlefield-loading.vue:18", "result from start field:", result);
      uni.setStorage({
        key: "chats",
        data: result.dialog
      });
      uni.navigateTo({
        url: "/pages/battlefield/battlefield-playground"
      });
    }
  };
  function _sfc_render$w(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "background-image loading-container" }, [
      vue.createElementVNode("image", {
        class: "background-image",
        src: _imports_0$e,
        mode: "aspectFill"
      }),
      vue.createCommentVNode(" Content "),
      vue.createElementVNode("view", { class: "loading-text-container" }, [
        vue.createElementVNode("text", { class: "loading-text" }, "聚餐中")
      ])
    ]);
  }
  const PagesBattlefieldBattlefieldLoading = /* @__PURE__ */ _export_sfc(_sfc_main$x, [["render", _sfc_render$w], ["__scopeId", "data-v-f3b7f371"], ["__file", "/Users/peipeiwang/wppDev/eqmaster_/test/pages/battlefield/battlefield-loading.vue"]]);
  const _sfc_main$w = {
    props: {
      name: {
        type: String,
        required: true
      },
      avatar: {
        type: String,
        required: true
      },
      comment: {
        type: String,
        required: true
      }
    }
  };
  function _sfc_render$v(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "card-container" }, [
      vue.createElementVNode("view", { class: "avatar-container" }, [
        vue.createElementVNode("image", {
          class: "avatar",
          src: $props.avatar,
          mode: "aspectFill"
        }, null, 8, ["src"])
      ]),
      vue.createElementVNode("view", { class: "description" }, [
        vue.createElementVNode(
          "view",
          { class: "name" },
          vue.toDisplayString($props.name),
          1
          /* TEXT */
        ),
        vue.createElementVNode(
          "view",
          { class: "comment" },
          vue.toDisplayString($props.comment),
          1
          /* TEXT */
        )
      ])
    ]);
  }
  const NpcComment = /* @__PURE__ */ _export_sfc(_sfc_main$w, [["render", _sfc_render$v], ["__scopeId", "data-v-dd44ef29"], ["__file", "/Users/peipeiwang/wppDev/eqmaster_/test/components/NpcComment.vue"]]);
  const _imports_0$d = "/static/summary-bg.png";
  const _sfc_main$v = {
    components: {
      NpcComment
      // 注册组件
    },
    data() {
      return {
        comments: [
          "哈哈哈你看看哈哈哈你看看哈哈哈你看看哈哈哈你看看哈哈哈你看看",
          "好好哈哈哈你看看哈哈哈你看看哈哈哈你看看哈哈哈你看看好我看看",
          "嘿嘿哈哈哈你看看哈哈哈你看看哈哈哈你看看哈哈哈你看看哈哈哈你看看嘿"
        ],
        suggestion: "注意倾听每个人的需求，及时回应对方的感受。",
        diamondAdd: 3
      };
    },
    methods: {
      progressWidth(value) {
        const percentage = value / 100 * 100;
        return `${percentage}%`;
      },
      navigateToGuide() {
        formatAppLog("log", "at pages/battlefield/battlefield-summary.vue:80", "Navigating to guide with data:", {
          userId: this.userId,
          username: this.username,
          jobId: this.homepageData.response.personal_info.job_id
        });
        uni.navigateTo({
          url: `/pages/dashboard/dashboard?userId=${this.userId}&username=${encodeURIComponent(this.username)}&jobId=${this.homepageData.response.personal_info.job_id}`
        });
      },
      navigateToNextPage() {
        uni.navigateTo({
          url: "/pages/battlefield/battlefield-task"
          // Replace this with the actual path to your next page
        });
      }
    },
    onLoad() {
      uni.getStorage({
        key: "evalResult",
        success: (res) => {
          formatAppLog("log", "at pages/battlefield/battlefield-summary.vue:102", "result:", res);
          const list = res.data.eval.map((item) => item.analysis);
          this.comments = list;
          this.suggestion = res.data.eq_tips.join("\n");
        }
      });
      uni.getStorage({
        key: "gemCount",
        success: (res) => {
          const gemCount = res.data;
          let diamondAdd = 3;
          if (gemCount > 0) {
            diamondAdd = 10;
          }
          this.diamondAdd = diamondAdd;
          formatAppLog("log", "at pages/battlefield/battlefield-summary.vue:118", "获取到的 Gem Count:", gemCount, "Diamond Add 值为:", diamondAdd);
        },
        fail: (err) => {
          formatAppLog("error", "at pages/battlefield/battlefield-summary.vue:122", "获取 Gem Count 失败:", err);
        }
      });
    }
  };
  function _sfc_render$u(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_npc_comment = vue.resolveComponent("npc-comment");
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("scroll-view", {
        "scroll-y": "",
        style: { "height": "100%" }
      }, [
        vue.createCommentVNode(' <view class="debug-info"> '),
        vue.createCommentVNode(" 如需调试信息，可取消注释以下行 "),
        vue.createCommentVNode(" <text>homepageData: {{ JSON.stringify(homepageData) }}</text> "),
        vue.createCommentVNode(" </view> "),
        vue.createElementVNode("view", { class: "card first-card" }, [
          vue.createElementVNode("image", {
            class: "head-image",
            src: _imports_0$d,
            mode: "aspectFill"
          })
        ]),
        vue.createElementVNode("view", { class: "card second-card" }, [
          vue.createElementVNode("view", { class: "score" }, [
            vue.createElementVNode("text", { class: "summary-dimension" }, "情绪平衡力"),
            vue.createElementVNode("text", { class: "course-score" }, "+15")
          ]),
          vue.createElementVNode("view", { class: "progress-container" }, [
            vue.createElementVNode("view", { class: "progress-bar1" }, [
              vue.createElementVNode(
                "view",
                {
                  class: "progress",
                  style: vue.normalizeStyle({ width: $options.progressWidth(45) })
                },
                null,
                4
                /* STYLE */
              )
            ]),
            vue.createElementVNode("text", { class: "score-title2" }, "45%")
          ]),
          vue.createElementVNode("view", { class: "comments" }, [
            vue.createElementVNode("view", { class: "comment-header" }, [
              vue.createElementVNode("view", { class: "down-line" }),
              vue.createElementVNode("text", { class: "comment-title" }, "互动评价")
            ]),
            vue.createElementVNode("view", { class: "sub-card" }, [
              vue.createVNode(_component_npc_comment, {
                name: "领导",
                avatar: "/static/battlefield/boss.png",
                comment: $data.comments[0]
              }, null, 8, ["avatar", "comment"]),
              vue.createVNode(_component_npc_comment, {
                name: "同事A",
                avatar: "/static/battlefield/xiaoA.png",
                comment: $data.comments[1]
              }, null, 8, ["avatar", "comment"]),
              vue.createVNode(_component_npc_comment, {
                name: "同事B",
                avatar: "/static/battlefield/xiaoB.png",
                comment: $data.comments[2]
              }, null, 8, ["avatar", "comment"])
            ])
          ])
        ]),
        vue.createElementVNode("view", { class: "card third-card" }, [
          vue.createElementVNode("view", { class: "third-card-title" }, [
            vue.createElementVNode("view", { class: "down-line second-line" }),
            vue.createElementVNode("text", { class: "comment-title" }, "本关情商技巧")
          ]),
          vue.createElementVNode("view", { class: "suggestion" }, [
            vue.createElementVNode(
              "text",
              null,
              vue.toDisplayString($data.suggestion),
              1
              /* TEXT */
            )
          ])
        ]),
        vue.createElementVNode("button", {
          class: "guide-button",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.navigateToGuide && $options.navigateToGuide(...args))
        }, "开启高情商之旅")
      ])
    ]);
  }
  const PagesBattlefieldBattlefieldSummary = /* @__PURE__ */ _export_sfc(_sfc_main$v, [["render", _sfc_render$u], ["__scopeId", "data-v-2b5d4ef4"], ["__file", "/Users/peipeiwang/wppDev/eqmaster_/test/pages/battlefield/battlefield-summary.vue"]]);
  const _sfc_main$u = {
    props: {
      isActive: {
        type: Boolean,
        default: false
        // 默认是非active状态
      }
    }
  };
  function _sfc_render$t(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["bar-item", { active: $props.isActive }])
      },
      null,
      2
      /* CLASS */
    );
  }
  const ProgressBar = /* @__PURE__ */ _export_sfc(_sfc_main$u, [["render", _sfc_render$t], ["__scopeId", "data-v-aad32a68"], ["__file", "/Users/peipeiwang/wppDev/eqmaster_/test/components/ProgressBar.vue"]]);
  const _imports_0$c = "/static/battlefield/back-iconpng.png";
  const _sfc_main$t = {
    components: {
      ProgressBar
      // 注册组件
    },
    methods: {
      navigateToNextPage() {
        uni.navigateTo({
          url: "/pages/battlefield/battlefield-loading"
        });
      },
      goback() {
        uni.navigateTo({
          url: "/pages/battlefield/battlefield-intro"
        });
      }
    }
  };
  function _sfc_render$s(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_progress_bar = vue.resolveComponent("progress-bar");
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("view", { class: "overlay" }),
      vue.createElementVNode("view", { class: "navbar" }, [
        vue.createElementVNode("image", {
          onClick: _cache[0] || (_cache[0] = (...args) => $options.goback && $options.goback(...args)),
          class: "back-button",
          src: _imports_0$c
        }),
        vue.createElementVNode("view", { class: "progress-bar" }, [
          vue.createVNode(_component_progress_bar, { isActive: true }),
          vue.createVNode(_component_progress_bar, { isActive: true })
        ])
      ]),
      vue.createElementVNode("view", { class: "content" }, [
        vue.createElementVNode("view", { class: "task-header" }, [
          vue.createElementVNode("text", { class: "main-title" }, "老板肚子里的蛔虫"),
          vue.createElementVNode("text", { class: "sub-title" }, "本关任务")
        ]),
        vue.createCommentVNode(" 任务列表 "),
        vue.createElementVNode("view", { class: "task-list" }, [
          vue.createElementVNode("view", { class: "task-item" }, [
            vue.createElementVNode("view", { class: "index-circle" }, [
              vue.createElementVNode("text", { class: "index-word" }, " 1 ")
            ]),
            vue.createElementVNode("text", { class: "task-word" }, "一句话让每个人心情愉悦"),
            vue.createCommentVNode(' <text class="task-word">得到领导的夸赞× 2</text> ')
          ]),
          vue.createElementVNode("view", { class: "task-item" }, [
            vue.createElementVNode("view", { class: "index-circle" }, [
              vue.createElementVNode("text", { class: "index-word" }, " 2 ")
            ]),
            vue.createElementVNode("text", { class: "task-word" }, "让老板对你点得菜满意")
          ])
        ])
      ]),
      vue.createElementVNode("view", { class: "continue-button-container" }, [
        vue.createElementVNode("button", {
          class: "continue-btn",
          onClick: _cache[1] || (_cache[1] = (...args) => $options.navigateToNextPage && $options.navigateToNextPage(...args))
        }, "我知道了")
      ])
    ]);
  }
  const PagesBattlefieldBattlefieldTask = /* @__PURE__ */ _export_sfc(_sfc_main$t, [["render", _sfc_render$s], ["__scopeId", "data-v-f52b0df4"], ["__file", "/Users/peipeiwang/wppDev/eqmaster_/test/pages/battlefield/battlefield-task.vue"]]);
  const _sfc_main$s = {
    data() {
      return {
        // Removed progress variable
        bezierPoints: [],
        // 存储贝塞尔曲线的采样点
        canvasWidth: 0,
        // 动态获取画布宽度
        canvasHeight: 0,
        // 动态获取画布高度
        circleRadius: 90,
        // 调整后的圆的半径
        circleDistance: 100,
        // 控制两个半圆之间的横向距离
        verticalOffset: 50
        // 新增的垂直偏移量
      };
    },
    mounted() {
      uni.getSystemInfo({
        success: (res) => {
          this.canvasWidth = res.windowWidth * 0.8;
          this.canvasHeight = this.canvasWidth * 2;
          this.calculateBezierPoints();
          this.drawSProgress();
        }
      });
    },
    methods: {
      calculateBezierPoints() {
        const width = this.canvasWidth;
        this.canvasHeight;
        const radius = this.circleRadius;
        const offset = this.verticalOffset;
        const points = [];
        const steps = 100;
        const loops = 1;
        const initX = width / 2;
        const initY = offset;
        points.push({ x: initX, y: initY });
        for (let i = 0; i <= steps / 2; i++) {
          const angle = -Math.PI / 2 + Math.PI * i / steps;
          const x = width / 2 + radius * Math.cos(angle) + this.circleDistance / 2;
          const y = radius + radius * Math.sin(angle) + offset;
          points.push({ x, y });
        }
        for (let loop = 0; loop < loops; loop++) {
          const baseY = loop * 4 * radius;
          for (let i = steps / 2; i <= steps; i++) {
            const angle = -Math.PI / 2 + Math.PI * i / steps;
            const x = width / 2 + radius * Math.cos(angle) + this.circleDistance / 2;
            const y = baseY + radius + radius * Math.sin(angle) + offset;
            points.push({ x, y });
          }
          for (let i = 0; i <= steps / 2; i++) {
            const angle = Math.PI / 2 + Math.PI * i / steps;
            const x = width / 2 + radius * Math.cos(angle) - this.circleDistance / 2;
            const y = baseY + 4 * radius - (radius + radius * Math.sin(angle)) + offset;
            points.push({ x, y });
          }
          for (let i = steps / 2; i <= steps; i++) {
            const angle = Math.PI / 2 + Math.PI * i / steps;
            const x = width / 2 + radius * Math.cos(angle) - this.circleDistance / 2;
            const y = baseY + 4 * radius - (radius + radius * Math.sin(angle)) + offset;
            points.push({ x, y });
          }
          for (let i = 0; i <= steps / 2; i++) {
            const angle = -Math.PI / 2 + Math.PI * i / steps;
            const x = width / 2 + radius * Math.cos(angle) + this.circleDistance / 2;
            const y = baseY + 4 * radius + radius + radius * Math.sin(angle) + offset;
            points.push({ x, y });
          }
        }
        const keyPoints = {
          leftCenter: points[steps + Math.floor(steps / 2) + 1],
          rightCenter: points[Math.floor(steps / 2)]
        };
        this.bezierPoints = points;
        this.keyPoints = keyPoints;
      },
      drawSProgress() {
        const ctx = uni.createCanvasContext("sProgress", this);
        const width = this.canvasWidth;
        const height = this.canvasHeight;
        ctx.clearRect(0, 0, width, height);
        ctx.beginPath();
        ctx.moveTo(this.bezierPoints[0].x, this.bezierPoints[0].y);
        for (let i = 1; i < this.bezierPoints.length; i++) {
          ctx.lineTo(this.bezierPoints[i].x, this.bezierPoints[i].y);
        }
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#ddd";
        ctx.stroke();
        this.drawKeyPoints(ctx);
        ctx.draw();
      },
      drawKeyPoints(ctx) {
        const keyPoints = this.keyPoints;
        const radius = 5;
        ctx.beginPath();
        ctx.arc(keyPoints.leftCenter.x, keyPoints.leftCenter.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = "grey";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(keyPoints.rightCenter.x, keyPoints.rightCenter.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = "grey";
        ctx.fill();
      }
      // Removed calculateProgressSteps method
    }
  };
  function _sfc_render$r(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("canvas", {
        "canvas-id": "sProgress",
        class: "progress-canvas"
      }),
      vue.createCommentVNode(" Removed progress text display ")
    ]);
  }
  const ComponentsSProgressBar = /* @__PURE__ */ _export_sfc(_sfc_main$s, [["render", _sfc_render$r], ["__scopeId", "data-v-b77c9478"], ["__file", "/Users/peipeiwang/wppDev/eqmaster_/test/components/SProgressBar.vue"]]);
  const _imports_0$b = "/static/dashboard/ciwei.png";
  const _imports_1$6 = "/static/diamond.png";
  const _imports_2$5 = "/static/fullbutton.png";
  const _imports_3$4 = "/static/add.png";
  const _imports_4$3 = "/static/x.png";
  const _imports_5$3 = "/static/CTA1.png";
  const _imports_2$4 = "/static/head.png";
  const _imports_6$2 = "/static/expand.png";
  const _imports_8 = "/static/Frame1.png";
  const _imports_9 = "/static/Frame2.png";
  const _imports_10 = "/static/Frame3.png";
  const _imports_11 = "/static/addlater3.png";
  const _imports_12 = "/static/addlater.png";
  const _imports_13 = "/static/addlater1.png";
  const _imports_14 = "/static/dashboard2/star.jpg";
  const _imports_15 = "/static/dashboard2/1.jpg";
  const _imports_16 = "/static/dashboard2/icon2.jpg";
  const _imports_17 = "/static/dashboard2/icon1.jpg";
  const _sfc_main$r = {
    data() {
      return {
        currentView: "dashboard2",
        score: 28,
        // 示例分数，可根据需要动态改
        maxScore: 100,
        // 假设最大分数为100
        userId: "",
        username: "",
        gender: "",
        birthday: null,
        selectedOptions: [],
        jobId: null,
        num: null,
        finishComponents: 2,
        totalComponents: 5,
        isLoading: true,
        error: null,
        homepageData: {
          response: {
            personal_info: { name: "" },
            eq_scores: { score: 0, overall_suggestion: "" },
            contacts: []
          }
        },
        intervalId: null,
        showSplash: false,
        // 默认不显示闪屏
        progress: 0,
        progressInterval: null,
        isExpanded: false,
        // 默认收起状态
        showPopup: false,
        // 将初始值设为 false，使弹窗在页面加载时不显示
        selectedOption: "subordinate",
        // 默认选择"同事"
        // 添加同类型的标签表
        colleagueTags: ["摸鱼高手", "时间管理大师", "潜力股", "马屁精", "靠谱伙伴"],
        bossSubordinateTags: ["完美主义者", "PUA大", "加班狂魔", "甩锅侠", "独裁者"],
        selectedTags: [],
        isProfileComplete: false,
        // New data property to track profile completion
        profileName: "",
        // New data property for profile name
        roleCards: [
          { title: "角色卡1" },
          { title: "角色卡2" },
          { title: "角色卡3" },
          { title: "角色卡4" },
          { title: "角色卡5" }
          // 可以根据需要添加更多卡片
        ],
        showNewPopup: false,
        tipImageSrc: "/static/tip.png"
        // Initial image source
      };
    },
    computed: {
      formattedBirthday() {
        if (this.birthday) {
          const date = new Date(this.birthday.year, this.birthday.month - 1, this.birthday.day);
          return date.toLocaleDateString();
        }
        return "未设置";
      },
      currentMonth() {
        const options = { month: "long" };
        return new Intl.DateTimeFormat("zh-CN", options).format(/* @__PURE__ */ new Date());
      },
      currentDate() {
        return (/* @__PURE__ */ new Date()).getDate();
      },
      currentTags() {
        if (this.selectedOption === "subordinate") {
          return this.colleagueTags;
        } else if (this.selectedOption === "supervisor" || this.selectedOption === "下属") {
          return this.bossSubordinateTags;
        } else {
          return [];
        }
      },
      canNavigateToProfile() {
        return this.profileName.trim() !== "" && this.selectedTags.length > 0;
      },
      userCard() {
        var _a, _b;
        const scores = (_b = (_a = this.homepageData) == null ? void 0 : _a.response) == null ? void 0 : _b.eq_scores;
        formatAppLog("log", "at pages/dashboard/dashboard.vue:271", "jobid:", this.jobId);
        formatAppLog("log", "at pages/dashboard/dashboard.vue:272", "results for backgrounds:", scores);
        const minScore = Math.min((scores == null ? void 0 : scores.dimension1_score) || 0, (scores == null ? void 0 : scores.dimension2_score) || 0, (scores == null ? void 0 : scores.dimension3_score) || 0, (scores == null ? void 0 : scores.dimension4_score) || 0, (scores == null ? void 0 : scores.dimension5_score) || 0);
        if (minScore === (scores == null ? void 0 : scores.dimension1_score)) {
          formatAppLog("log", "at pages/dashboard/dashboard.vue:277", "usercard src:", "水豚");
          return "/static/dashboard/shuitu.png";
        } else if (minScore === (scores == null ? void 0 : scores.dimension2_score)) {
          formatAppLog("log", "at pages/dashboard/dashboard.vue:280", "usercard src:", "猴子");
          return "/static/dashboard/houzi.png";
        } else if (minScore === (scores == null ? void 0 : scores.dimension3_score)) {
          formatAppLog("log", "at pages/dashboard/dashboard.vue:283", "usercard src:", "刺猬");
          return "/static/dashboard/ciwei.png";
        } else if (minScore === (scores == null ? void 0 : scores.dimension4_score)) {
          formatAppLog("log", "at pages/dashboard/dashboard.vue:286", "usercard src:", "鸵鸟");
          return "/static/dashboard/tuoniao.png";
        } else if (minScore === (scores == null ? void 0 : scores.dimension5_score)) {
          formatAppLog("log", "at pages/dashboard/dashboard.vue:289", "usercard src:", "狼");
          return "/static/dashboard/lang.png";
        }
      }
    },
    components: {
      SProgressBar: ComponentsSProgressBar
    },
    onLoad(option) {
      formatAppLog("log", "at pages/dashboard/dashboard.vue:298", "Received options:", option);
      this.userId = option.userId || "";
      this.username = decodeURIComponent(option.username || "Dgidegfiugrwi");
      this.jobId = option.jobId || "154ee592-287b-4675-b8bd-8f88de348476";
      this.getHomepageData();
      formatAppLog("log", "at pages/dashboard/dashboard.vue:310", "Parsed data:", {
        userId: this.userId,
        username: this.username,
        jobId: this.jobId
      });
      formatAppLog("log", "at pages/dashboard/dashboard.vue:316", "Received options:", option);
      if (option.currentView) {
        this.currentView = option.currentView;
      }
      formatAppLog("log", "at pages/dashboard/dashboard.vue:323", "Current View:", this.currentView);
      this.intervalId = setInterval(() => {
        this.getHomepageData();
      }, 5e4);
    },
    onUnload() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
      if (this.progressInterval) {
        clearInterval(this.progressInterval);
      }
    },
    methods: {
      progressWidth(value) {
        const percentage = value / this.maxScore * 100;
        return `${percentage}%`;
      },
      circleLeftPosition(value) {
        const percentage1 = value / this.maxScore * 100;
        const progressBarWidth = uni.getSystemInfoSync().windowWidth * 0.8;
        formatAppLog("log", "at pages/dashboard/dashboard.vue:351", percentage1);
        return percentage1 / 100 * progressBarWidth;
      },
      navigateToGuide() {
        uni.navigateTo({
          url: `/pages/dashboard/dashboard?userId=${this.userId}&username=${encodeURIComponent(this.username)}&jobId=${this.jobId}`
          // 添加查询参数
        });
      },
      getHomepageData() {
        const that = this;
        this.isLoading = true;
        this.error = null;
        formatAppLog("log", "at pages/dashboard/dashboard.vue:363", "Fetching homepage data with jobId:", this.jobId);
        uni.request({
          url: `https://eqmaster.azurewebsites.net/get_homepage/${this.jobId}`,
          method: "POST",
          success(response) {
            if (response.statusCode === 200) {
              that.homepageData = response.data;
              formatAppLog("log", "at pages/dashboard/dashboard.vue:370", "Homepage data received:", that.homepageData);
              that.$nextTick(() => {
                that.drawRadar();
              });
            } else {
              that.error = `Failed to fetch homepage data: ${response.statusCode}`;
              formatAppLog("error", "at pages/dashboard/dashboard.vue:376", that.error);
            }
          },
          fail(error) {
            that.error = "Error fetching homepage data";
            formatAppLog("error", "at pages/dashboard/dashboard.vue:381", that.error, error);
          },
          complete() {
            that.isLoading = false;
          }
        });
      },
      expand() {
        this.isExpanded = true;
      },
      openPopup() {
        this.showPopup = true;
      },
      closePopup() {
        this.showPopup = false;
      },
      selectOption(option) {
        this.selectedOption = option;
        this.selectedTags = [];
      },
      toggleTag(tag) {
        const index = this.selectedTags.indexOf(tag);
        if (index > -1) {
          this.selectedTags.splice(index, 1);
        } else {
          this.selectedTags.push(tag);
        }
      },
      createProfile() {
        formatAppLog("log", "at pages/dashboard/dashboard.vue:410", "创建档案", {
          name: this.profileName,
          option: this.selectedOption,
          tags: this.selectedTags
        });
        this.closePopup();
      },
      navigateToBattlefieldIntro() {
        var _a, _b, _c;
        uni.navigateTo({
          url: `/pages/battlefield/battlefield-intro?userId=${this.userId}&username=${encodeURIComponent(this.username)}&jobId=${(_c = (_b = (_a = this.homepageData) == null ? void 0 : _a.response) == null ? void 0 : _b.personal_info) == null ? void 0 : _c.job_id}`
        });
      },
      toProfilePage() {
        var _a, _b, _c;
        if (this.canNavigateToProfile) {
          this.getHomepageData();
          const requestData = {
            personal_name: ((_c = (_b = (_a = this.homepageData) == null ? void 0 : _a.response) == null ? void 0 : _b.personal_info) == null ? void 0 : _c.name) || "",
            name: this.profileName,
            tag: this.selectedTags.join(","),
            contact_relationship: this.selectedOption
          };
          formatAppLog("log", "at pages/dashboard/dashboard.vue:435", "Sending data to create contact profile:", requestData);
          uni.request({
            url: "https://eqmaster.azurewebsites.net/create_contact_profile",
            method: "POST",
            data: requestData,
            success: (res) => {
              if (res.statusCode === 200) {
                formatAppLog("log", "at pages/dashboard/dashboard.vue:444", "Contact profile created successfully:", res.data);
                uni.navigateTo({
                  url: `/pages/profile/profile?personal_name=${encodeURIComponent(this.username)}&name=${encodeURIComponent(this.profileName)}&jobId=${this.jobId}&relation=${encodeURIComponent(this.selectedOption)}&tags=${encodeURIComponent(JSON.stringify(this.selectedTags))}&contactId=${res.data.contact_id}`
                });
              } else {
                formatAppLog("error", "at pages/dashboard/dashboard.vue:450", "Failed to create contact profile:", res.statusCode, res.data);
                uni.showToast({
                  title: `创建档案失败: ${res.statusCode}`,
                  icon: "none"
                });
              }
            },
            fail: (err) => {
              formatAppLog("error", "at pages/dashboard/dashboard.vue:458", "Error creating contact profile:", err);
              uni.showToast({
                title: "网络错误，请稍后重试",
                icon: "none"
              });
            }
          });
        }
      },
      toProfilePage1(contact) {
        var _a, _b, _c, _d, _e, _f;
        this.getHomepageData();
        formatAppLog("log", "at pages/dashboard/dashboard.vue:469", "Navigating to profile page for contact:", contact);
        formatAppLog("log", "at pages/dashboard/dashboard.vue:470", "Navigating to profile page for contact:", (_c = (_b = (_a = this.homepageData) == null ? void 0 : _a.response) == null ? void 0 : _b.personal_info) == null ? void 0 : _c.name);
        if (this.canNavigateToProfile) {
          this.getHomepageData();
          const requestData = {
            personal_name: ((_f = (_e = (_d = this.homepageData) == null ? void 0 : _d.response) == null ? void 0 : _e.personal_info) == null ? void 0 : _f.name) || "",
            name: (contact == null ? void 0 : contact.name) || "",
            tag: (contact == null ? void 0 : contact.tag) || "",
            contact_relationship: (contact == null ? void 0 : contact.contact_relationship) || ""
          };
          formatAppLog("log", "at pages/dashboard/dashboard.vue:482", "Sending data to create contact profile:", requestData);
          uni.request({
            url: "https://eqmaster.azurewebsites.net/create_contact_profile",
            method: "POST",
            data: requestData,
            success: (res) => {
              if (res.statusCode === 200) {
                formatAppLog("log", "at pages/dashboard/dashboard.vue:491", "Contact profile created successfully:", res.data);
                uni.navigateTo({
                  url: `/pages/profile/profile?personal_name=${encodeURIComponent(this.username)}&name=${encodeURIComponent((contact == null ? void 0 : contact.name) || "")}&jobId=${this.jobId}&relation=${encodeURIComponent((contact == null ? void 0 : contact.contact_relationship) || "")}&tags=${encodeURIComponent((contact == null ? void 0 : contact.tag) || "")}&contactId=${res.data.contact_id}`
                });
              } else {
                formatAppLog("error", "at pages/dashboard/dashboard.vue:496", "Failed to create contact profile:", res.statusCode, res.data);
                uni.showToast({
                  title: `创建档案失败: ${res.statusCode}`,
                  icon: "none"
                });
              }
            },
            fail: (err) => {
              formatAppLog("error", "at pages/dashboard/dashboard.vue:504", "Error creating contact profile:", err);
              uni.showToast({
                title: "网络错误，请稍后重试",
                icon: "none"
              });
            }
          });
        }
      },
      navigateToResult() {
        uni.navigateTo({
          url: `/pages/result/loading?jobId=${this.jobId}`
        });
      },
      openWeChat() {
        try {
          uni.navigateTo({
            url: "weixin://",
            success: () => {
              formatAppLog("log", "at pages/dashboard/dashboard.vue:524", "WeChat opened successfully");
            },
            fail: () => {
              uni.showToast({
                title: "WeChat is not installed",
                icon: "none"
              });
            }
          });
        } catch (error) {
          formatAppLog("error", "at pages/dashboard/dashboard.vue:536", "Error opening WeChat:", error);
          uni.showToast({
            title: "Unable to open WeChat",
            icon: "none"
          });
        }
      },
      toggleTipImage() {
        this.tipImageSrc = this.tipImageSrc === "/static/tip.png" ? "/static/tipp.png" : "/static/tip.png";
      },
      truncateName(name) {
        const maxLength = 6;
        if (name.length > maxLength) {
          return name.substring(0, maxLength) + "...";
        }
        return name;
      },
      generateSPath(progress) {
        return `M 0 25 C ${progress * 0.25} 0, ${progress * 0.75} 0, ${progress} 25 S ${progress * 1.75} 50, ${progress * 2} 25`;
      },
      navigateToDashboard() {
        this.switchView("dashboard");
      },
      navigateToDashboard2() {
        this.switchView("dashboard2");
      },
      switchView(view) {
        this.currentView = view;
      }
    }
  };
  function _sfc_render$q(_ctx, _cache, $props, $setup, $data, $options) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t;
    const _component_SProgressBar = vue.resolveComponent("SProgressBar");
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("scroll-view", {
        "scroll-y": "",
        style: { "height": "100%" }
      }, [
        $data.currentView === "dashboard" ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "content"
        }, [
          vue.createCommentVNode(" 添加错误处理和加载状态 "),
          $data.isLoading ? (vue.openBlock(), vue.createElementBlock("view", { key: 0 }, "加载中...")) : $data.error ? (vue.openBlock(), vue.createElementBlock(
            "view",
            { key: 1 },
            vue.toDisplayString($data.error),
            1
            /* TEXT */
          )) : (vue.openBlock(), vue.createElementBlock("view", { key: 2 }, [
            vue.createCommentVNode(" 使用可选链操作符和默认值 "),
            vue.createElementVNode(
              "text",
              { class: "score-title-head" },
              "早，" + vue.toDisplayString(((_c = (_b = (_a = $data.homepageData) == null ? void 0 : _a.response) == null ? void 0 : _b.personal_info) == null ? void 0 : _c.name) || "用户") + "！",
              1
              /* TEXT */
            ),
            vue.createCommentVNode(" 添加插图 "),
            vue.createElementVNode("view", { class: "dashboard1-card-o" }, [
              vue.createElementVNode("image", {
                class: "illustration1",
                src: _imports_0$b,
                mode: "widthFix"
              }),
              vue.createCommentVNode(" 添加白色卡片 "),
              vue.createElementVNode("view", { class: "card" }, [
                vue.createElementVNode("image", {
                  class: "illustration3",
                  src: _imports_1$6,
                  mode: "widthFix"
                }),
                vue.createElementVNode(
                  "text",
                  { class: "score-value-large" },
                  vue.toDisplayString(Math.round(((_f = (_e = (_d = $data.homepageData) == null ? void 0 : _d.response) == null ? void 0 : _e.eq_scores) == null ? void 0 : _f.score) || 0)),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", { class: "progress-bar" }, [
                  vue.createElementVNode(
                    "view",
                    {
                      class: "progress",
                      style: vue.normalizeStyle({ width: $options.progressWidth(((_i = (_h = (_g = $data.homepageData) == null ? void 0 : _g.response) == null ? void 0 : _h.eq_scores) == null ? void 0 : _i.score) || 0) })
                    },
                    null,
                    4
                    /* STYLE */
                  )
                ]),
                vue.createElementVNode(
                  "text",
                  { class: "card-description" },
                  vue.toDisplayString(((_l = (_k = (_j = $data.homepageData) == null ? void 0 : _j.response) == null ? void 0 : _k.eq_scores) == null ? void 0 : _l.overall_suggestion) || "暂无建议"),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("image", {
                  class: "illustration31",
                  src: _imports_2$5,
                  mode: "widthFix",
                  onClick: _cache[0] || (_cache[0] = (...args) => $options.navigateToResult && $options.navigateToResult(...args))
                })
              ])
            ]),
            vue.createElementVNode("text", { class: "card-title1" }, "今日锦囊"),
            vue.createElementVNode("image", {
              class: "illustration32",
              src: $data.tipImageSrc,
              mode: "widthFix",
              onClick: _cache[1] || (_cache[1] = (...args) => $options.toggleTipImage && $options.toggleTipImage(...args))
            }, null, 8, ["src"]),
            vue.createElementVNode("text", { class: "card-title1" }, "我的人脉网"),
            vue.createElementVNode("text", { class: "card-title15" }, "AI 战略家通过分析多维关系，帮助您建立职场联系"),
            vue.createCommentVNode(" 添加白色卡片1 "),
            vue.createElementVNode("view", { class: "card1" }, [
              vue.createElementVNode("text", { class: "card-title14" }, "添加微信助手，获取深度职场分析！"),
              vue.createElementVNode("image", {
                class: "illustration33",
                src: _imports_3$4,
                mode: "widthFix",
                onClick: _cache[2] || (_cache[2] = (...args) => _ctx.openNewPopup && _ctx.openNewPopup(...args))
              }),
              vue.createElementVNode("image", {
                class: "illustration34",
                src: _imports_4$3,
                mode: "widthFix"
              })
            ]),
            vue.createElementVNode("view", { class: "dashboard1-card-o" }, [
              vue.createElementVNode("image", {
                class: "illustration35",
                src: _imports_5$3,
                mode: "widthFix",
                onClick: _cache[3] || (_cache[3] = (...args) => $options.openPopup && $options.openPopup(...args))
              }),
              vue.createElementVNode("view", { class: "peoplecontain" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList(((_n = (_m = $data.homepageData) == null ? void 0 : _m.response) == null ? void 0 : _n.contacts) || [], (contact, index) => {
                    return vue.openBlock(), vue.createElementBlock(
                      "view",
                      {
                        key: index,
                        class: vue.normalizeClass(["cardjuese", index % 2 === 1 ? "lower-card" : ""])
                      },
                      [
                        vue.createElementVNode("view", {
                          class: "card-a",
                          onClick: ($event) => $options.toProfilePage1(contact)
                        }, [
                          vue.createElementVNode("view", { class: "card1inner" }, [
                            vue.createElementVNode("image", {
                              class: "illustrationhead",
                              src: _imports_2$4,
                              mode: "widthFix"
                            }),
                            vue.createElementVNode("view", { class: "card2inner" }, [
                              vue.createElementVNode(
                                "text",
                                { class: "usercard-title1" },
                                vue.toDisplayString($options.truncateName((contact == null ? void 0 : contact.name) || "")),
                                1
                                /* TEXT */
                              ),
                              vue.createElementVNode(
                                "text",
                                { class: "usercard-title2" },
                                vue.toDisplayString((contact == null ? void 0 : contact.contact_relationship) || ""),
                                1
                                /* TEXT */
                              )
                            ])
                          ]),
                          vue.createElementVNode("view", { class: "white-line" }),
                          vue.createElementVNode(
                            "text",
                            { class: "usercard-title3" },
                            vue.toDisplayString((contact == null ? void 0 : contact.relationship_analysis) || ""),
                            1
                            /* TEXT */
                          )
                        ], 8, ["onClick"]),
                        vue.createCommentVNode(" 如果卡片有更多内容，可以在这里添加 ")
                      ],
                      2
                      /* CLASS */
                    );
                  }),
                  128
                  /* KEYED_FRAGMENT */
                )),
                vue.createCommentVNode(" 添加一个空的占位卡片 "),
                vue.createElementVNode("view", {
                  class: "cardjuese1",
                  style: { "visibility": "hidden" }
                })
              ])
            ]),
            $data.showPopup ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "popup-overlay"
            }, [
              vue.createElementVNode("view", {
                class: "popup-content",
                onClick: _cache[11] || (_cache[11] = vue.withModifiers(() => {
                }, ["stop"]))
              }, [
                vue.createElementVNode("view", { class: "popup-header" }, [
                  vue.createElementVNode("text", { class: "popup-title" }, "创建人脉档案"),
                  vue.createElementVNode("text", {
                    class: "popup-close",
                    onClick: _cache[4] || (_cache[4] = (...args) => $options.closePopup && $options.closePopup(...args))
                  }, "×")
                ]),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "popup-input",
                    "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $data.profileName = $event),
                    placeholder: "请输入名字"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.profileName]
                ]),
                vue.createElementVNode("view", { class: "popup-section" }, [
                  vue.createElementVNode("text", { class: "popup-question" }, "TA是你的？")
                ]),
                vue.createElementVNode("view", { class: "popup-options" }, [
                  vue.createElementVNode(
                    "text",
                    {
                      class: vue.normalizeClass(["popup-option", { active: $data.selectedOption === "subordinate" }]),
                      onClick: _cache[6] || (_cache[6] = ($event) => $options.selectOption("subordinate"))
                    },
                    "同事",
                    2
                    /* CLASS */
                  ),
                  vue.createElementVNode(
                    "text",
                    {
                      class: vue.normalizeClass(["popup-option1", { active: $data.selectedOption === "supervisor" }]),
                      onClick: _cache[7] || (_cache[7] = ($event) => $options.selectOption("supervisor"))
                    },
                    "老板",
                    2
                    /* CLASS */
                  ),
                  vue.createElementVNode(
                    "text",
                    {
                      class: vue.normalizeClass(["popup-option2", { active: $data.selectedOption === "下属" }]),
                      onClick: _cache[8] || (_cache[8] = ($event) => $options.selectOption("下属"))
                    },
                    "下属",
                    2
                    /* CLASS */
                  )
                ]),
                vue.createElementVNode("view", { class: "popup-section" }, [
                  vue.createElementVNode("text", { class: "popup-question" }, "哪些标签可以用来形容TA？")
                ]),
                vue.createElementVNode("view", { class: "popup-tags" }, [
                  (vue.openBlock(true), vue.createElementBlock(
                    vue.Fragment,
                    null,
                    vue.renderList($options.currentTags, (tag) => {
                      return vue.openBlock(), vue.createElementBlock("text", {
                        key: tag,
                        class: vue.normalizeClass(["popup-tag", { active: $data.selectedTags.includes(tag) }]),
                        onClick: ($event) => $options.toggleTag(tag)
                      }, vue.toDisplayString(tag), 11, ["onClick"]);
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  ))
                ]),
                !$data.isExpanded ? (vue.openBlock(), vue.createElementBlock("image", {
                  key: 0,
                  onClick: _cache[9] || (_cache[9] = (...args) => $options.expand && $options.expand(...args)),
                  src: _imports_6$2,
                  class: "expand-image"
                })) : vue.createCommentVNode("v-if", true),
                vue.createCommentVNode(" Updated button with simplified disabled style "),
                vue.createElementVNode(
                  "button",
                  {
                    class: "popup-button",
                    onClick: _cache[10] || (_cache[10] = (...args) => $options.toProfilePage && $options.toProfilePage(...args)),
                    style: vue.normalizeStyle({ opacity: $options.canNavigateToProfile ? 1 : 0.5 })
                  },
                  " 创建档案 ",
                  4
                  /* STYLE */
                )
              ])
            ])) : vue.createCommentVNode("v-if", true),
            vue.createCommentVNode(" 添加蓝色按钮 "),
            vue.createElementVNode("view", { class: "card3" }, [
              vue.createElementVNode("image", {
                class: "illustration36",
                src: _imports_8,
                mode: "widthFix"
              }),
              vue.createElementVNode("image", {
                class: "illustration37",
                src: _imports_9,
                mode: "widthFix",
                onClick: _cache[12] || (_cache[12] = (...args) => $options.navigateToDashboard2 && $options.navigateToDashboard2(...args))
              }),
              vue.createElementVNode("image", {
                class: "illustration38",
                src: _imports_10,
                mode: "widthFix"
              })
            ]),
            vue.createCommentVNode(" New Popup "),
            $data.showNewPopup ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "popup-overlay"
            }, [
              vue.createElementVNode("view", {
                class: "popup-content",
                onClick: _cache[15] || (_cache[15] = vue.withModifiers(() => {
                }, ["stop"]))
              }, [
                vue.createElementVNode("view", { class: "popup-wordy" }, [
                  vue.createElementVNode("image", {
                    class: "popup-icon2",
                    src: _imports_11,
                    mode: "widthFix"
                  }),
                  vue.createElementVNode("text", { class: "popup-title" }, " 微信号复制成功"),
                  vue.createElementVNode("text", { class: "popup-notitle" }, " 微信号:wxid 3cnxu4266mt012"),
                  vue.createElementVNode("text", { class: "popup-notitle" }, " 是否立即跳转微信添加助手?"),
                  vue.createElementVNode("view", { class: "popup-icon" }, [
                    vue.createElementVNode("image", {
                      class: "popup-icon1",
                      src: _imports_12,
                      onClick: _cache[13] || (_cache[13] = (...args) => _ctx.closeNewPopup && _ctx.closeNewPopup(...args)),
                      mode: "widthFix"
                    }),
                    vue.createElementVNode("image", {
                      class: "popup-icon1",
                      src: _imports_13,
                      mode: "widthFix",
                      onClick: _cache[14] || (_cache[14] = (...args) => $options.openWeChat && $options.openWeChat(...args))
                    })
                  ])
                ])
              ])
            ])) : vue.createCommentVNode("v-if", true)
          ]))
        ])) : $data.currentView === "dashboard2" ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "dashboard2-content"
        }, [
          vue.createCommentVNode(" Integrated dashboard2.vue content "),
          vue.createElementVNode("view", { class: "dashboard2-card-o" }, [
            vue.createElementVNode("view", { class: "dashboard2-card" }, [
              vue.createElementVNode("image", {
                class: "dashboard2-illustration3",
                src: _imports_1$6,
                mode: "widthFix"
              }),
              vue.createElementVNode(
                "text",
                { class: "dashboard2-score-value-large-y" },
                vue.toDisplayString(Math.round(((_q = (_p = (_o = $data.homepageData) == null ? void 0 : _o.response) == null ? void 0 : _p.eq_scores) == null ? void 0 : _q.score) || 0)),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "dashboard2-card" }, [
              vue.createElementVNode("image", {
                class: "dashboard2-illustration3",
                src: _imports_14,
                mode: "widthFix"
              }),
              vue.createElementVNode(
                "text",
                { class: "dashboard2-score-value-large-g" },
                vue.toDisplayString(Math.round(5)),
                1
                /* TEXT */
              )
            ])
          ]),
          vue.createElementVNode("image", {
            class: "dashboard2-illustration31",
            src: _imports_15,
            mode: "widthFix"
          }),
          vue.createElementVNode("view", { class: "dashboard2-card1-container" }, [
            vue.createElementVNode("view", { class: "dashboard2-card1" }, [
              vue.createElementVNode(
                "text",
                { class: "dashboard2-score-value-large1" },
                "情绪刹车术" + vue.toDisplayString(),
                1
                /* TEXT */
              ),
              vue.createElementVNode("view", { class: "dashboard2-level-badge" }, [
                vue.createElementVNode("text", { class: "dashboard2-score-title1" }, "Lv1小试牛刀")
              ]),
              vue.createElementVNode("view", { class: "dashboard2-progress-container" }, [
                vue.createElementVNode("text", { class: "dashboard2-score-title2" }, "情绪掌控力"),
                vue.createElementVNode("view", { class: "dashboard2-progress-bar1" }, [
                  vue.createElementVNode(
                    "view",
                    {
                      class: "dashboard2-progress",
                      style: vue.normalizeStyle({ width: $options.progressWidth(((_t = (_s = (_r = $data.homepageData) == null ? void 0 : _r.response) == null ? void 0 : _s.eq_scores) == null ? void 0 : _t.dimension3_score) || 0) })
                    },
                    null,
                    4
                    /* STYLE */
                  )
                ])
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "dashboard2-card-o" }, [
            vue.createCommentVNode(" 调用进度条组件 "),
            vue.createVNode(_component_SProgressBar, {
              finishComponents: 1,
              totalComponents: 5
            }),
            vue.createCommentVNode(' <image class="dashboard2-xiuluochang-image" src="/static/dashboard2/xiuluochang.jpg" mode="aspectFill" /> ')
          ]),
          vue.createCommentVNode(' <image class="dashboard2-illustration35" src="/static/dashboard2/plgon9.jpg" mode="widthFix" @click="navigateToBattlefieldIntro"></image> '),
          vue.createElementVNode("view", { class: "dashboard2-card3" }, [
            vue.createElementVNode("image", {
              class: "dashboard2-illustration36",
              src: _imports_16,
              mode: "widthFix",
              onClick: _cache[16] || (_cache[16] = ($event) => $options.switchView("dashboard"))
            }),
            vue.createElementVNode("image", {
              class: "dashboard2-illustration37",
              src: _imports_17,
              mode: "widthFix"
            }),
            vue.createElementVNode("image", {
              class: "dashboard2-illustration38",
              src: _imports_10,
              mode: "widthFix"
            })
          ])
        ])) : vue.createCommentVNode("v-if", true)
      ])
    ]);
  }
  const PagesDashboardDashboard = /* @__PURE__ */ _export_sfc(_sfc_main$r, [["render", _sfc_render$q], ["__scopeId", "data-v-75e816e7"], ["__file", "/Users/peipeiwang/wppDev/eqmaster_/test/pages/dashboard/dashboard.vue"]]);
  const _sfc_main$q = {
    props: {
      gemCount: {
        type: Number,
        default: 0
      }
    }
  };
  function _sfc_render$p(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "gem-container" }, [
      vue.createCommentVNode(' <image class="gem-icon" src="/static/battlefield/diamond.png" mode="aspectFit"></image> '),
      (vue.openBlock(), vue.createElementBlock(
        vue.Fragment,
        null,
        vue.renderList(3, (n) => {
          return vue.createElementVNode("view", {
            key: n,
            class: "gem"
          }, [
            vue.createCommentVNode(" 根据 gemCount 的值，亮起相应数量的绿色星星 "),
            vue.createElementVNode("image", {
              class: "gem-icon",
              src: n <= $props.gemCount ? "/static/battlefield/mingcute_star-fill.svg" : "/static/battlefield/mingcute_star-grey.svg",
              mode: "aspectFit"
            }, null, 8, ["src"])
          ]);
        }),
        64
        /* STABLE_FRAGMENT */
      ))
    ]);
  }
  const RewardBar = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["render", _sfc_render$p], ["__scopeId", "data-v-860e4543"], ["__file", "/Users/peipeiwang/wppDev/eqmaster_/test/components/RewardBar.vue"]]);
  const _sfc_main$p = {
    name: "NpcStatus",
    props: {
      health: {
        type: Number,
        default: 100
        // 初始健康值
      },
      avatar: {
        type: String,
        default: "/static/battlefield/boss.png"
        // 默认头像路径
      },
      characterName: {
        type: String,
        default: "老板"
        // 默认角色名字
      }
    },
    data() {
      return {
        prevHealth: this.health,
        // 保存之前的健康值
        showIndicator: false,
        // 控制指示器的显示
        indicatorColor: "#EDFB8B",
        // 指示器颜色（默认绿色）
        indicatorTimeout: null
        // 定时器引用
      };
    },
    computed: {
      healthBarStyle() {
        const color = this.health < 6.7 ? "#FF6262" : "#9EE44D";
        const width = `${this.health * 5}%`;
        formatAppLog("log", "at components/NpcStatus.vue:52", "health width: ", width);
        return {
          width,
          backgroundColor: color,
          transition: "width 0.5s ease, background-color 0.5s ease"
          // 动态变化的平滑效果
        };
      },
      indicatorStyle() {
        return {
          position: "absolute",
          top: "50%",
          // 垂直居中
          transform: "translateY(-50%)",
          left: "80%",
          // 放置在背景条的末端
          marginLeft: "-18rpx",
          // 调整圆圈与血条末端的间距
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          border: `2px solid ${this.indicatorColor}`,
          // 空心圈的边框颜色
          backgroundColor: "transparent",
          // 背景透明
          boxShadow: `0 0 8px ${this.indicatorColor}`,
          // 发光效果
          animation: "fadeOutScale 2s forwards"
          // 使用新的动画效果
        };
      }
    },
    watch: {
      health(newVal, oldVal) {
        if (newVal > oldVal) {
          this.indicatorColor = "#EDFB8B";
        } else if (newVal < oldVal) {
          this.indicatorColor = "#FE8C8C";
        } else {
          return;
        }
        this.showIndicator = true;
        formatAppLog("log", "at components/NpcStatus.vue:87", "show the circle");
        if (this.indicatorTimeout) {
          clearTimeout(this.indicatorTimeout);
        }
        this.indicatorTimeout = setTimeout(() => {
          this.showIndicator = false;
          this.indicatorTimeout = null;
        }, 2e3);
        formatAppLog("log", "at components/NpcStatus.vue:99", "hide the circle");
        this.prevHealth = newVal;
      }
    },
    beforeUnmount() {
      if (this.indicatorTimeout) {
        clearTimeout(this.indicatorTimeout);
      }
    }
  };
  function _sfc_render$o(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "character-container" }, [
      vue.createCommentVNode(" 血条 "),
      vue.createElementVNode("view", { class: "blood-container" }, [
        vue.createElementVNode("view", { class: "health-bar-container" }, [
          vue.createElementVNode("view", { class: "health-bar-line" }),
          vue.createElementVNode("view", { class: "health-bar-background" }, [
            vue.createElementVNode(
              "view",
              {
                class: "health-bar-foreground",
                style: vue.normalizeStyle($options.healthBarStyle)
              },
              [
                vue.createCommentVNode(" 血条终点的指示器 "),
                $data.showIndicator ? (vue.openBlock(), vue.createElementBlock(
                  "view",
                  {
                    key: 0,
                    class: "health-bar-indicator",
                    style: vue.normalizeStyle($options.indicatorStyle)
                  },
                  null,
                  4
                  /* STYLE */
                )) : vue.createCommentVNode("v-if", true)
              ],
              4
              /* STYLE */
            )
          ])
        ])
      ]),
      vue.createElementVNode("view", { class: "avatar-container" }, [
        vue.createElementVNode("image", {
          class: "avatar",
          src: $props.avatar,
          mode: "aspectFill"
        }, null, 8, ["src"]),
        vue.createElementVNode(
          "text",
          { class: "character-name" },
          vue.toDisplayString($props.characterName),
          1
          /* TEXT */
        )
      ])
    ]);
  }
  const NpcStatus = /* @__PURE__ */ _export_sfc(_sfc_main$p, [["render", _sfc_render$o], ["__scopeId", "data-v-dafce8e7"], ["__file", "/Users/peipeiwang/wppDev/eqmaster_/test/components/NpcStatus.vue"]]);
  const _imports_0$a = "/static/battlefield/character_background.png";
  const _sfc_main$o = {
    props: {
      avatar: {
        type: String,
        required: true
      },
      character: {
        type: String,
        required: true
      },
      wording: {
        type: String,
        required: true
      }
    }
  };
  function _sfc_render$n(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "inner-container" }, [
      vue.createElementVNode("view", { class: "bubble-container" }, [
        vue.createElementVNode("image", {
          class: "avatar",
          src: $props.avatar,
          mode: "aspectFill"
        }, null, 8, ["src"]),
        vue.createElementVNode("view", { class: "background-parent" }, [
          vue.createElementVNode("image", {
            class: "character-background",
            src: _imports_0$a
          }),
          vue.createElementVNode(
            "view",
            { class: "character" },
            vue.toDisplayString($props.character),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode(
          "text",
          { class: "wording" },
          vue.toDisplayString($props.wording),
          1
          /* TEXT */
        )
      ])
    ]);
  }
  const LargeAvatarBubble = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["render", _sfc_render$n], ["__scopeId", "data-v-f3476ae6"], ["__file", "/Users/peipeiwang/wppDev/eqmaster_/test/components/LargeAvatarBubble.vue"]]);
  const _sfc_main$n = {
    props: {
      title: {
        type: String,
        required: true
      },
      wording: {
        type: String,
        required: true,
        fontColor: "#fff"
      },
      goodJudge: {
        type: Boolean,
        required: true
      }
    },
    methods: {
      onContinue() {
        formatAppLog("log", "at components/Judge.vue:34", "emitting event");
        this.$emit("judge", this.goodJudge);
      }
    },
    computed: {
      bgColor() {
        return this.goodJudge ? "#E8FFC4" : "#fff2b4";
      },
      fontColor() {
        return this.goodJudge ? "#315B00" : "#936A15";
      },
      buttonBgColor() {
        return this.goodJudge ? "#A9E55B" : "#FFD044";
      }
    }
  };
  function _sfc_render$m(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "judge-container",
        style: vue.normalizeStyle({ backgroundColor: $options.bgColor })
      },
      [
        vue.createElementVNode(
          "text",
          {
            class: "title",
            style: vue.normalizeStyle({ color: $options.fontColor })
          },
          vue.toDisplayString($props.title),
          5
          /* TEXT, STYLE */
        ),
        vue.createElementVNode(
          "text",
          {
            class: "wording",
            style: vue.normalizeStyle({ color: $options.fontColor })
          },
          vue.toDisplayString($props.wording),
          5
          /* TEXT, STYLE */
        ),
        vue.createElementVNode("view", { class: "judge-button-container" }, [
          vue.createElementVNode(
            "button",
            {
              class: "judge-action-button",
              style: vue.normalizeStyle({
                backgroundColor: $options.buttonBgColor
              }),
              onClick: _cache[0] || (_cache[0] = (...args) => $options.onContinue && $options.onContinue(...args))
            },
            "继续",
            4
            /* STYLE */
          )
        ])
      ],
      4
      /* STYLE */
    );
  }
  const Judge = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["render", _sfc_render$m], ["__scopeId", "data-v-a1094024"], ["__file", "/Users/peipeiwang/wppDev/eqmaster_/test/components/Judge.vue"]]);
  const _imports_0$9 = "/static/battlefield/quit.png";
  const _imports_1$5 = "/static/battlefield/tipping-left.png";
  const _imports_2$3 = "/static/battlefield/diamond.png";
  const _imports_3$3 = "/static/battlefield/tipping-right.png";
  const _sfc_main$m = {
    props: {
      quit: {
        type: Function,
        required: true
      },
      help: {
        type: Function,
        required: true
      },
      hint: {
        type: Function,
        required: true
      }
    },
    data() {
      return {
        selectedCard: null
      };
    },
    methods: {
      selectCard(card) {
        formatAppLog("log", "at components/Tipping.vue:73", "Selected card:", card);
        this.selectedCard = card;
      },
      confirmSelection() {
        if (this.selectedCard) {
          formatAppLog("log", "at components/Tipping.vue:78", "Selected card:", this.selectedCard);
          quit();
          if (this.selectedCard === "help") {
            help();
          } else {
            hint();
          }
        } else {
          uni.showToast({
            title: "请选择一张卡片",
            icon: "none"
          });
        }
      }
    }
  };
  function _sfc_render$l(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("view", { class: "modal" }, [
        vue.createElementVNode("image", {
          class: "quit",
          src: _imports_0$9,
          onClick: _cache[0] || (_cache[0] = (...args) => $props.quit && $props.quit(...args))
        }),
        vue.createElementVNode("view", { class: "modal-header" }, [
          vue.createElementVNode("text", { class: "title" }, "选择锦囊卡片")
        ]),
        vue.createElementVNode("view", { class: "cards" }, [
          vue.createCommentVNode(" 帮回卡 "),
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["card", { selected: $data.selectedCard === "help" }]),
              onClick: _cache[1] || (_cache[1] = ($event) => $options.selectCard("help"))
            },
            [
              vue.createElementVNode("image", {
                class: "card-background",
                src: _imports_1$5,
                mode: "scaleToFill"
              }),
              vue.createElementVNode("view", { class: "card-content" }, [
                vue.createElementVNode("text", { class: "card-title" }, "帮回卡"),
                vue.createElementVNode("text", { class: "card-description" }, " 快速调整你的回答，提升质量，让对话更流畅。 "),
                vue.createElementVNode("view", { class: "card-cost" }, [
                  vue.createElementVNode("image", {
                    class: "diamond",
                    src: _imports_2$3
                  }),
                  vue.createElementVNode("text", null, "60")
                ])
              ])
            ],
            2
            /* CLASS */
          ),
          vue.createCommentVNode(" 提示卡 "),
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["card", { selected: $data.selectedCard === "hint" }]),
              onClick: _cache[2] || (_cache[2] = ($event) => $options.selectCard("hint"))
            },
            [
              vue.createElementVNode("image", {
                class: "card-background",
                src: _imports_3$3,
                mode: "scaleToFill"
              }),
              vue.createElementVNode("view", { class: "card-content" }, [
                vue.createElementVNode("text", { class: "card-title" }, "提示卡"),
                vue.createElementVNode("text", { class: "card-description" }, " 提供情绪引导或建议，帮助你更好地理解和回应。 "),
                vue.createElementVNode("view", { class: "card-cost" }, [
                  vue.createElementVNode("image", {
                    class: "diamond",
                    src: _imports_2$3
                  }),
                  vue.createElementVNode("text", null, "20")
                ])
              ])
            ],
            2
            /* CLASS */
          )
        ]),
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["confirm-btn", { "not-selected": !$data.selectedCard }]),
            onClick: _cache[3] || (_cache[3] = (...args) => $options.confirmSelection && $options.confirmSelection(...args))
          },
          [
            vue.createElementVNode("text", { class: "confirm-text" }, "确定兑换")
          ],
          2
          /* CLASS */
        )
      ])
    ]);
  }
  const Tipping = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["render", _sfc_render$l], ["__scopeId", "data-v-6f0eed4e"], ["__file", "/Users/peipeiwang/wppDev/eqmaster_/test/components/Tipping.vue"]]);
  const _imports_0$8 = "/static/battlefield/question-mark.png";
  const _imports_1$4 = "/static/battlefield/tip-yellow.png";
  const _sfc_main$l = {
    props: {
      tip: {
        type: String,
        required: true
      }
    }
  };
  function _sfc_render$k(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "tip-container" }, [
      vue.createElementVNode("image", {
        class: "tip-background",
        src: _imports_0$8,
        mode: "widthFix"
      }),
      vue.createElementVNode("view", { class: "tip-content" }, [
        vue.createElementVNode("image", {
          class: "tip-mark",
          src: _imports_1$4
        }),
        vue.createElementVNode(
          "text",
          { class: "tip-text" },
          vue.toDisplayString($props.tip),
          1
          /* TEXT */
        )
      ])
    ]);
  }
  const TippingChatBox = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["render", _sfc_render$k], ["__scopeId", "data-v-23a165a0"], ["__file", "/Users/peipeiwang/wppDev/eqmaster_/test/components/TippingChatBox.vue"]]);
  const _sfc_main$k = {
    props: {
      wording: {
        type: String,
        required: true
      }
    }
  };
  function _sfc_render$j(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "bubble-container" }, [
      vue.createElementVNode(
        "text",
        { class: "txt" },
        vue.toDisplayString($props.wording),
        1
        /* TEXT */
      )
    ]);
  }
  const SelfChatBox = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["render", _sfc_render$j], ["__scopeId", "data-v-ca8700c1"], ["__file", "/Users/peipeiwang/wppDev/eqmaster_/test/components/SelfChatBox.vue"]]);
  const _sfc_main$j = {
    props: {
      avatar: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      dialog: {
        type: String,
        required: true
      }
    }
  };
  function _sfc_render$i(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "bubble-container" }, [
      vue.createElementVNode("view", { class: "background-parent" }, [
        vue.createElementVNode("view", { class: "user-info" }, [
          vue.createElementVNode("view", { class: "avatar-background" }, [
            vue.createElementVNode("image", {
              class: "avatar",
              src: $props.avatar,
              mode: "aspectFill"
            }, null, 8, ["src"])
          ]),
          vue.createElementVNode("view", { class: "name" }, [
            vue.createElementVNode("image", {
              class: "character-background",
              src: _imports_0$a,
              mode: "scaleToFill"
            }),
            vue.createElementVNode(
              "view",
              { class: "character" },
              vue.toDisplayString($props.name),
              1
              /* TEXT */
            )
          ])
        ])
      ]),
      vue.createElementVNode(
        "text",
        { class: "txt" },
        vue.toDisplayString($props.dialog),
        1
        /* TEXT */
      )
    ]);
  }
  const NpcChatBox = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["render", _sfc_render$i], ["__scopeId", "data-v-7860702c"], ["__file", "/Users/peipeiwang/wppDev/eqmaster_/test/components/NpcChatBox.vue"]]);
  function findLastName(str) {
    const regex = /(小李|小王)(?!.*(小李|小王))/;
    const match = str.match(regex);
    return match ? match[0] : "老板";
  }
  function getAvatar(name) {
    if (name == "小李") {
      return "/static/npc1.png";
    }
    if (name == "小王") {
      return "/static/npc2.png";
    }
    return "/static/npc3.png";
  }
  function getBattlefieldAvatar(name) {
    if (name == "领导") {
      return "static/battlefield/boss.png";
    }
    if (name == "同事A") {
      return "/static/battlefield/xiaoA.png";
    }
    return "/static/battlefield/xiaoB.png";
  }
  class Task {
    constructor(id, title, check, status = false) {
      this._id = id;
      this._title = title;
      this._check = check;
      this._status = status;
      this.once = false;
      this.judgeResult = {};
    }
    // Getter 和 Setter for id
    get id() {
      return this._id;
    }
    set id(value) {
      this._id = value;
    }
    // Getter 和 Setter for title
    get title() {
      return this._title;
    }
    set title(value) {
      this._title = value;
    }
    // Getter 和 Setter for status
    get status() {
      return this._status;
    }
    set status(value) {
      this._status = value;
    }
    // 执行检查方法
    async executeCheck(judgeResult) {
      const isFinished = await this._check(judgeResult);
      if (isFinished || this.once) {
        this.status = true;
      }
      return isFinished;
    }
  }
  class TaskList {
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
    async execute(judgeResult) {
      const checkPromises = this.taskList.map((task) => task.executeCheck(judgeResult));
      await Promise.all(checkPromises);
      this.taskList.forEach((task) => {
        if (!task.once && task.status) {
          this.doneTaskLength += 1;
          task.once = true;
          return;
        }
      });
      if (this.doneTaskLength === this.taskLength)
        return true;
      return false;
    }
  }
  const _imports_2$2 = "/static/battlefield/copy.png";
  const _imports_3$2 = "/static/battlefield/setting.png";
  const _imports_4$2 = "/static/battlefield/keyboard.png";
  const _imports_5$2 = "/static/battlefield/microphone.png";
  const _imports_6$1 = "/static/battlefield/streamline.png";
  const recorderManager = uni.getRecorderManager();
  const _sfc_main$i = {
    components: {
      RewardBar,
      NpcStatus,
      LargeAvatarBubble,
      Judge,
      Tipping,
      TippingChatBox,
      SelfChatBox,
      NpcChatBox
    },
    data() {
      return {
        judgeTitle: "",
        judgeContent: "",
        taskList: new TaskList([]),
        isGoodReply: true,
        state: "NpcTalk",
        // Current state
        showTippingCard: false,
        // Controls the tipping card visibility
        talkingNpc: 0,
        displayedNpcChatIndex: 0,
        // Tracks the last displayed NPC chat
        npcDialog: "NPC dialogue here",
        // Replace with actual dialogue
        // Other data properties
        someoneTalk: true,
        chattingHistory: [{
          role: "领导",
          content: "唉，我最近有点上火，医生嘱咐我要清淡饮食。这些重口味的菜我可真不敢吃了，不然怕是吃完嘴上火气就更旺了。"
        }],
        showInput: false,
        focusInput: false,
        npcs: [
          {
            characterName: "领导",
            health: 10,
            avatar: "/static/battlefield/boss.png"
          },
          {
            characterName: "同事A",
            health: 10,
            avatar: "/static/battlefield/xiaoA.png"
          },
          {
            characterName: "同事B",
            health: 10,
            avatar: "/static/battlefield/xiaoB.png"
          }
        ],
        gemCount: 2,
        tempFilePath: "",
        // 临时录音文件路径
        isRecording: false,
        // Controls the display state of recording box
        remainingTime: 30,
        // 录音剩余时间
        isCanceling: false,
        // 判断是否处于取消状态
        touchStartY: 0,
        // 记录touchstart的位置
        touchThreshold: -100,
        // 上滑取消的阈值（负值表示向上滑动）
        countdownInterval: null,
        // 倒计时的定时器
        getBattlefieldAvatar
      };
    },
    created() {
      this.taskList.addTask(new Task(1, "一句话让同事们赞不绝口", async (judgeResult) => {
        const allPositive = judgeResult.moods.every((item) => parseInt(item.mood, 10) > 0);
        if (allPositive && !this.taskList.getTask(1).once) {
          this.judgeTitle = `做得好！ ${this.taskList.getTask(0).title} (${this.taskList.doneTaskLength + 1}/${this.taskList.taskLength})`;
          return true;
        }
        return false;
      }));
      this.taskList.addTask(new Task(2, "让小B不高兴", async (judgeResult) => {
        let res = "";
        judgeResult.moods.filter((mood) => {
          if (mood.role === "同事B")
            res = mood.mood;
        });
        const bMood = parseInt(res ? res : 0, 10);
        if (bMood < 0 && !this.taskList.getTask(1).once) {
          this.judgeTitle = `做得好！ ${this.taskList.getTask(1).title} (${this.taskList.doneTaskLength + 1}/${this.taskList.taskLength})`;
          return true;
        }
        return false;
      }));
    },
    methods: {
      goToDashboard() {
        uni.navigateTo({
          url: "/pages/dashboard/dashboard?currentView=dashboard2"
        });
      },
      handleClickRecording(e) {
        this.isRecording = true;
        this.isCanceling = false;
        this.remainingTime = 30;
        this.touchStartY = e.touches[0].clientY;
        this.startRecording();
        this.startCountdown();
      },
      handleTouchMove(e) {
        formatAppLog("log", "at pages/battlefield/battlefield-playground.vue:211", "move start , isRecording: ", this.isRecording);
        if (!this.isRecording)
          return;
        const currentY = e.touches[0].clientY;
        const distance = currentY - this.touchStartY;
        if (distance < this.touchThreshold) {
          this.isCanceling = true;
          formatAppLog("log", "at pages/battlefield/battlefield-playground.vue:217", "canceled");
        } else {
          this.isCanceling = false;
          formatAppLog("log", "at pages/battlefield/battlefield-playground.vue:220", "not canceled");
        }
      },
      handleRecordingDone() {
        if (!this.isRecording)
          return;
        recorderManager.stop();
        clearInterval(this.countdownInterval);
        this.isRecording = false;
      },
      resetRecording() {
        this.isRecording = false;
        this.isCanceling = false;
        this.remainingTime = 30;
        clearInterval(this.countdownInterval);
      },
      startCountdown() {
        this.countdownInterval = setInterval(() => {
          if (this.remainingTime > 0) {
            this.remainingTime--;
          } else {
            this.handleRecordingDone();
          }
        }, 1e3);
      },
      resetRecording() {
        this.isRecording = false;
        this.isCanceling = false;
        this.remainingTime = 30;
        clearInterval(this.countdownInterval);
      },
      async gotoNextRound() {
        if (!this.isGoodReply) {
          this.retry();
          return;
        }
        const nextRound = await continueChat(this.chattingHistory);
        formatAppLog("log", "at pages/battlefield/battlefield-playground.vue:263", "next round data", nextRound);
        this.chattingHistory = this.chattingHistory.concat(nextRound.dialog);
        formatAppLog("log", "at pages/battlefield/battlefield-playground.vue:266", "after concat, chatting history:", this.chattingHistory);
        let someoneTalked = false;
        for (; this.displayedNpcChatIndex < this.chattingHistory.length; ++this.displayedNpcChatIndex) {
          let npcIndex = getNpcIndex(this.chattingHistory[this.displayedNpcChatIndex]);
          if (npcIndex >= 0) {
            this.talkingNpc = npcIndex;
            formatAppLog("log", "at pages/battlefield/battlefield-playground.vue:275", "someone talk:", this.talkingNpc);
            someoneTalked = true;
            break;
          }
        }
        if (!someoneTalked) {
          this.displayedNpcChatIndex--;
        }
        this.state = "NpcTalk";
      },
      retry() {
        this.state = "userTalk";
      },
      startRecording() {
        const options = {
          duration: 3e4,
          // 最大录音时长 30 秒
          sampleRate: 16e3,
          // 采样率，Azure 推荐16kHz
          numberOfChannels: 1,
          // 单声道
          encodeBitRate: 16e3,
          // 编码码率
          format: "wav"
          // 设置录音格式为 wav
        };
        recorderManager.start(options);
        formatAppLog("log", "at pages/battlefield/battlefield-playground.vue:300", "开始录音");
      },
      getNextState() {
        if (this.state === "NpcTalk" && this.chattingHistory.length === 0) {
          formatAppLog("log", "at pages/battlefield/battlefield-playground.vue:304", "Dismiss npc");
          this.state = "userTalk";
        }
      },
      handleTippingQuit() {
        formatAppLog("log", "at pages/battlefield/battlefield-playground.vue:311", "Clicked quit tipping");
        this.state = "userTalk";
      },
      help() {
        formatAppLog("log", "at pages/battlefield/battlefield-playground.vue:315", "Choose help card");
      },
      hint() {
        formatAppLog("log", "at pages/battlefield/battlefield-playground.vue:318", "Choose hint card");
      },
      clickHintButton() {
        this.state = "hint";
      },
      async uploadAndRecognizeSpeech(filePath) {
        try {
          const response = await uni.uploadFile({
            url: "https://eqmaster.azurewebsites.net/upload-audio/",
            // 替换为你的 FastAPI 服务地址
            filePath,
            // 录音的 WAV 文件路径
            name: "file",
            // 与 FastAPI 后端的字段名保持一致
            header: {
              "Content-Type": "multipart/form-data"
              // 确保使用 multipart/form-data 进行文件上传
            }
          });
          formatAppLog("log", "at pages/battlefield/battlefield-playground.vue:335", "文件上传成功:", response);
          const resData = JSON.parse(response.data);
          const transcript = resData.transcript;
          return transcript;
        } catch (error) {
          formatAppLog("error", "at pages/battlefield/battlefield-playground.vue:340", "文件上传失败:", error);
          throw error;
        }
      },
      async dismissNpcTalk() {
        let foundNpcMessage = false;
        const history = this.chattingHistory;
        for (let i = this.displayedNpcChatIndex + 1; i < history.length; i++) {
          if (history[i].role !== "user") {
            this.displayedNpcChatIndex = i;
            this.talkingNpc = this.getNpcIndexByName(history[i].role);
            this.npcDialog = history[i].content;
            foundNpcMessage = true;
            break;
          }
        }
        if (!foundNpcMessage) {
          formatAppLog("log", "at pages/battlefield/battlefield-playground.vue:360", "no more npc, now user turn.");
          this.state = "userTalk";
        }
      },
      // Helper method to get NPC index by name
      getNpcIndexByName(name) {
        return this.npcs.findIndex((npc) => npc.characterName === name);
      },
      async Pass() {
        const evaluationResult = await evalBattlefield(this.chattingHistory);
        formatAppLog("log", "at pages/battlefield/battlefield-playground.vue:371", "evaluation result:", evaluationResult);
        uni.setStorage({
          key: "evalResult",
          data: evaluationResult
        });
        setTimeout(() => {
          uni.navigateTo({
            url: "/pages/battlefield/battlefield-summary"
          });
        }, 500);
      },
      handleContainerClick() {
        if (this.state === "NpcTalk") {
          this.dismissNpcTalk();
        }
      },
      initRecorderManager() {
        recorderManager.onStart(() => {
          formatAppLog("log", "at pages/battlefield/battlefield-playground.vue:392", "Recorder start");
        });
        recorderManager.onStop(async (res) => {
          formatAppLog("log", "at pages/battlefield/battlefield-playground.vue:395", "Recorder stop", res);
          if (this.isCanceling) {
            formatAppLog("log", "at pages/battlefield/battlefield-playground.vue:399", "Recording was canceled, no further action taken.");
            this.resetRecording();
            return;
          }
          const path = res.tempFilePath;
          try {
            const transcript = await this.uploadAndRecognizeSpeech(path);
            if (transcript.length === 0) {
              this.isCanceling = true;
              formatAppLog("log", "at pages/battlefield/battlefield-playground.vue:409", "record is none, canceling...");
              this.resetRecording();
              uni.showToast({
                title: "好像没有听清哦～",
                icon: "none"
              });
              return;
            }
            this.chattingHistory.push({
              role: "user",
              content: transcript
            });
            const validChats = filterChatHistory(this.chattingHistory);
            const judgeResult = await reply(validChats);
            formatAppLog("log", "at pages/battlefield/battlefield-playground.vue:424", "get judge result: ", judgeResult);
            const totalScore = judgeResult.moods.reduce((acc, mood) => {
              return acc + parseInt(mood.mood, 10);
            }, 0);
            this.isGoodReply = totalScore > 0;
            this.judgeTitle = this.isGoodReply ? "做的好" : "继续努力";
            const done = await this.taskList.execute(judgeResult);
            formatAppLog("log", "at pages/battlefield/battlefield-playground.vue:433", "Done :", done);
            this.judgeContent = judgeResult.comments;
            this.state = "judge";
            formatAppLog("log", "at pages/battlefield/battlefield-playground.vue:436", "state has been changed");
            judgeResult.moods.forEach((item) => {
              if (item.role === "领导") {
                this.npcs[0].health = Math.min(this.npcs[0].health + (parseInt(item.mood, 10) > 0 ? 4 : -2), 20);
              } else if (item.role === "同事A") {
                this.npcs[1].health = Math.min(this.npcs[1].health + (parseInt(item.mood, 10) > 0 ? 4 : -2), 20);
              } else if (item.role === "同事B") {
                this.npcs[2].health = Math.min(this.npcs[2].health + (parseInt(item.mood, 10) > 0 ? 4 : -2), 20);
              }
            });
            const totalHealth = this.npcs.reduce((acc, npc) => acc + npc.health, 0);
            if (totalHealth >= 0 && totalHealth <= 20) {
              this.gemCount = 1;
            } else if (totalHealth >= 21 && totalHealth <= 40) {
              this.gemCount = 2;
            } else if (totalHealth >= 41 && totalHealth <= 60) {
              this.gemCount = 3;
            } else {
              this.gemCount = 0;
            }
            if (done) {
              await this.Pass();
            }
          } catch (error) {
            formatAppLog("error", "at pages/battlefield/battlefield-playground.vue:468", "在用户说话反馈过程中有错发生哦：", error);
          }
        });
      }
    },
    onLoad(option) {
      formatAppLog("log", "at pages/battlefield/battlefield-playground.vue:474", "loaded");
      uni.getStorage({
        key: "chats",
        success: (res) => {
          formatAppLog("log", "at pages/battlefield/battlefield-playground.vue:478", "chatting histories,", res.data);
          this.chattingHistory = res.data;
        }
      });
      this.initRecorderManager();
    },
    watch: {
      isCanceling(newValue) {
        formatAppLog("log", "at pages/battlefield/battlefield-playground.vue:487", "isCanceling : ", newValue);
        if (newValue) {
          formatAppLog("log", "at pages/battlefield/battlefield-playground.vue:489", "Doing canceling ");
          this.handleRecordingDone();
        }
      }
    },
    computed: {
      shouldShadow() {
        return this.state === "NpcTalk" || this.isRecording || this.showTippingCard;
      },
      displayedMessages() {
        const userChats = this.chattingHistory.filter((chat) => chat.role === "user");
        const npcChats = this.chattingHistory.filter((chat) => ["领导", "同事A", "同事B"].includes(chat.role));
        const latestUserChat = userChats.slice(-1);
        const latestNpcChats = npcChats.slice(-3);
        return [...latestNpcChats, ...latestUserChat];
      },
      displayedHistory() {
        const userChats = this.chattingHistory.filter((chat) => chat.role === "user");
        const npcChats = this.chattingHistory.filter((chat) => ["领导", "同事A", "同事B"].includes(chat.role));
        const latestUserChat = userChats.slice(-1);
        const latestNpcChats = npcChats.slice(-3);
        return [...latestNpcChats, ...latestUserChat];
      }
    }
  };
  function _sfc_render$h(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_reward_bar = vue.resolveComponent("reward-bar");
    const _component_npc_status = vue.resolveComponent("npc-status");
    const _component_self_chat_box = vue.resolveComponent("self-chat-box");
    const _component_npc_chat_box = vue.resolveComponent("npc-chat-box");
    const _component_tipping_chat_box = vue.resolveComponent("tipping-chat-box");
    const _component_large_avatar_bubble = vue.resolveComponent("large-avatar-bubble");
    const _component_tipping = vue.resolveComponent("tipping");
    const _component_judge = vue.resolveComponent("judge");
    return vue.openBlock(), vue.createElementBlock("view", {
      class: "container",
      onClick: _cache[7] || (_cache[7] = (...args) => $options.handleContainerClick && $options.handleContainerClick(...args))
    }, [
      vue.createElementVNode("image", {
        class: "background-image",
        src: _imports_0$e,
        mode: "aspectFill"
      }),
      vue.createElementVNode("view", { class: "overlay" }),
      vue.createElementVNode(
        "view",
        {
          class: vue.normalizeClass(["navbar", { shadowed: $options.shouldShadow }])
        },
        [
          vue.createElementVNode("image", {
            class: "back-button",
            src: _imports_0$c,
            onClick: _cache[0] || (_cache[0] = (...args) => $options.goToDashboard && $options.goToDashboard(...args))
          }),
          vue.createVNode(_component_reward_bar, { gemCount: $data.gemCount }, null, 8, ["gemCount"]),
          vue.createElementVNode("view", { class: "setting-group" }, [
            vue.createElementVNode("image", {
              class: "setting-item",
              src: _imports_2$2
            }),
            vue.createElementVNode("image", {
              class: "setting-item",
              src: _imports_3$2
            })
          ])
        ],
        2
        /* CLASS */
      ),
      vue.createElementVNode(
        "view",
        {
          class: vue.normalizeClass(["npc-group", { shadowed: $options.shouldShadow }])
        },
        [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.npcs, (npc) => {
              return vue.openBlock(), vue.createBlock(_component_npc_status, {
                key: npc.characterName,
                health: npc.health,
                avatar: npc.avatar,
                characterName: npc.characterName
              }, null, 8, ["health", "avatar", "characterName"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ],
        2
        /* CLASS */
      ),
      $data.state !== "NpcTalk" ? (vue.openBlock(), vue.createElementBlock(
        "view",
        {
          key: 0,
          class: vue.normalizeClass(["chat-history-container", { shadowed: $options.shouldShadow }])
        },
        [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($options.displayedMessages, (chat, index) => {
              return vue.openBlock(), vue.createElementBlock(
                vue.Fragment,
                null,
                [
                  chat.role === "user" ? (vue.openBlock(), vue.createBlock(_component_self_chat_box, {
                    key: index,
                    wording: chat.content
                  }, null, 8, ["wording"])) : ["领导", "同事A", "同事B"].includes(chat.role) ? (vue.openBlock(), vue.createBlock(_component_npc_chat_box, {
                    key: "npc-" + index,
                    avatar: $data.getBattlefieldAvatar(chat.role),
                    name: chat.role,
                    dialog: chat.content
                  }, null, 8, ["avatar", "name", "dialog"])) : chat.role === "tipping" ? (vue.openBlock(), vue.createBlock(_component_tipping_chat_box, {
                    key: "tipping" + index,
                    tip: chat.content
                  }, null, 8, ["tip"])) : vue.createCommentVNode("v-if", true)
                ],
                64
                /* STABLE_FRAGMENT */
              );
            }),
            256
            /* UNKEYED_FRAGMENT */
          ))
        ],
        2
        /* CLASS */
      )) : vue.createCommentVNode("v-if", true),
      $data.state === "NpcTalk" ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "npc-talk-container"
      }, [
        vue.createVNode(_component_large_avatar_bubble, {
          avatar: $data.npcs[$data.talkingNpc].avatar,
          character: $data.npcs[$data.talkingNpc].characterName,
          wording: $data.chattingHistory[$data.displayedNpcChatIndex].content
        }, null, 8, ["avatar", "character", "wording"])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 录音弹框 "),
      vue.createCommentVNode(" avoid opacity inheriting "),
      $data.isRecording ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 2,
        class: "recording-box"
      }, [
        vue.createElementVNode(
          "text",
          { class: "timer" },
          vue.toDisplayString($data.remainingTime) + "''",
          1
          /* TEXT */
        ),
        vue.createElementVNode("view", { class: "waveform" }, [
          vue.createCommentVNode(" 声波动画 "),
          vue.createElementVNode("view", { class: "wave" }),
          vue.createElementVNode("view", { class: "wave" }),
          vue.createElementVNode("view", { class: "wave" }),
          vue.createElementVNode("view", { class: "wave" }),
          vue.createElementVNode("view", { class: "wave" })
        ]),
        vue.createElementVNode("text", { class: "cancel-text" }, "松开发送，上滑取消")
      ])) : vue.createCommentVNode("v-if", true),
      vue.createElementVNode(
        "view",
        {
          class: vue.normalizeClass(["player-action-container", { shadowed: $options.shouldShadow }])
        },
        [
          !$data.isRecording ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "action-item",
            onClick: _cache[1] || (_cache[1] = ($event) => {
              $data.showInput = true;
              $data.focusInput = true;
            })
          }, [
            vue.createElementVNode("image", {
              class: "action-icon",
              src: _imports_4$2
            })
          ])) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode("view", { class: "middle-container" }, [
            vue.createElementVNode(
              "view",
              {
                class: "action-item action-item-middle",
                onTouchstart: _cache[2] || (_cache[2] = (...args) => $options.handleClickRecording && $options.handleClickRecording(...args)),
                onTouchend: _cache[3] || (_cache[3] = (...args) => $options.handleRecordingDone && $options.handleRecordingDone(...args)),
                onTouchmove: _cache[4] || (_cache[4] = (...args) => $options.handleTouchMove && $options.handleTouchMove(...args))
              },
              [
                vue.createElementVNode("image", {
                  class: "action-icon action-icon-middle",
                  src: _imports_5$2
                })
              ],
              32
              /* NEED_HYDRATION */
            )
          ]),
          !$data.isRecording ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "action-item"
          }, [
            vue.createElementVNode("image", {
              class: "action-icon-hint",
              src: _imports_6$1,
              onClick: _cache[5] || (_cache[5] = (...args) => $options.clickHintButton && $options.clickHintButton(...args))
            })
          ])) : vue.createCommentVNode("v-if", true)
        ],
        2
        /* CLASS */
      ),
      $data.showTippingCard ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 3,
        class: "tipping-card"
      }, [
        vue.createVNode(_component_tipping, {
          quit: $options.handleTippingQuit,
          hint: $options.hint,
          help: $options.help
        }, null, 8, ["quit", "hint", "help"])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createElementVNode("view", { class: "keyboard-container" }, [
        $data.showInput ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "input-container"
        }, [
          vue.createElementVNode("input", {
            type: "text",
            focus: $data.focusInput,
            placeholder: "请输入...",
            onBlur: _cache[6] || (_cache[6] = ($event) => $data.showInput = false)
          }, null, 40, ["focus"])
        ])) : vue.createCommentVNode("v-if", true)
      ]),
      $data.state === "judge" ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 4,
        class: "judge-container"
      }, [
        vue.createVNode(_component_judge, {
          title: $data.judgeTitle,
          wording: $data.judgeContent,
          onJudge: $options.gotoNextRound,
          "good-judge": $data.isGoodReply
        }, null, 8, ["title", "wording", "onJudge", "good-judge"])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesBattlefieldBattlefieldPlayground = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["render", _sfc_render$h], ["__scopeId", "data-v-520df1b5"], ["__file", "/Users/peipeiwang/wppDev/eqmaster_/test/pages/battlefield/battlefield-playground.vue"]]);
  const _sfc_main$h = {
    components: {
      ProgressBar
      // 注册组件
    },
    methods: {
      navigateToNextPage() {
        uni.navigateTo({
          url: "/pages/battlefield/battlefield-task"
          // Replace this with the actual path to your next page
        });
      }
    }
  };
  function _sfc_render$g(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_progress_bar = vue.resolveComponent("progress-bar");
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("view", { class: "overlay" }),
      vue.createElementVNode("view", { class: "navbar" }, [
        vue.createElementVNode("image", {
          class: "back-button",
          src: _imports_0$c
        }),
        vue.createElementVNode("view", { class: "progress-bar" }, [
          vue.createVNode(_component_progress_bar, { isActive: true }),
          vue.createVNode(_component_progress_bar, { isActive: false })
        ])
      ]),
      vue.createCommentVNode(" Content "),
      vue.createElementVNode("view", { class: "content" }, [
        vue.createElementVNode("text", { class: "title content-item" }, "第一关"),
        vue.createElementVNode("text", { class: "subtitle content-item" }, "老板肚子里的蛔虫"),
        vue.createElementVNode("text", { class: "time-info content-item" }, "3-4分钟"),
        vue.createElementVNode("text", { class: "description content-item" }, " 在一个精致的会所包厢里，你与一位高层领导和两名同事共进晚餐。看似轻松的聚会，实际上领导在暗中观察你们，准备决定谁将参与重要项目。你必须讨好领导，同时平衡同事关系，因为一个小小的失误可能改变你的未来。 ")
      ]),
      vue.createElementVNode("view", { class: "continue-button-container" }, [
        vue.createElementVNode("button", {
          class: "continue-btn",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.navigateToNextPage && $options.navigateToNextPage(...args))
        }, "继续")
      ])
    ]);
  }
  const PagesBattlefieldBattlefieldIntro = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["render", _sfc_render$g], ["__scopeId", "data-v-29c1a59c"], ["__file", "/Users/peipeiwang/wppDev/eqmaster_/test/pages/battlefield/battlefield-intro.vue"]]);
  const _imports_0$7 = "/static/cta.png";
  const _sfc_main$g = {
    data() {
      return {
        score: 28,
        // 示例分数，可根据需要动态更改
        maxScore: 100,
        // 假设最大分数为100
        userId: "",
        username: "",
        gender: "",
        birthday: null,
        selectedOptions: [],
        jobId: null,
        num: null,
        homepageData: {
          response: {
            personal_info: {
              name: "",
              tag: "",
              tag_description: "",
              job_id: ""
            },
            eq_scores: {
              score: 0,
              dimension1_score: 0,
              dimension1_detail: "",
              dimension2_score: 0,
              dimension2_detail: "",
              dimension3_score: 0,
              dimension3_detail: "",
              dimension4_score: 0,
              dimension4_detail: "",
              dimension5_score: 0,
              dimension5_detail: "",
              summary: "",
              detail: "",
              overall_suggestion: "",
              detail_summary: ""
            },
            contacts: []
          }
        },
        intervalId: null,
        progress: 0,
        progressInterval: null,
        // 新增的闪屏相关数据
        splashImageLeft1: 0,
        splashImageLeft2: 2e3,
        imageWidth: 2e3,
        interval: null,
        isExpanded: false,
        // 默认收起状态
        timeoutInterval: null
      };
    },
    computed: {
      formattedBirthday() {
        if (this.birthday) {
          const date = new Date(this.birthday.year, this.birthday.month - 1, this.birthday.day);
          return date.toLocaleDateString();
        }
        return "未设置";
      }
    },
    onLoad(option) {
      try {
        this.userId = option.userId || "";
        this.username = decodeURIComponent(option.username || "");
        this.gender = option.gender || "";
        this.jobId = option.jobId || "";
        this.num = option.num || "";
        if (option.options) {
          try {
            this.selectedOptions = JSON.parse(decodeURIComponent(option.options));
          } catch (e) {
            formatAppLog("error", "at pages/result/loading.vue:96", "Error parsing options:", e);
            this.selectedOptions = [];
          }
        }
        if (option.birthday) {
          try {
            this.birthday = JSON.parse(decodeURIComponent(option.birthday));
          } catch (e) {
            formatAppLog("error", "at pages/result/loading.vue:105", "Error parsing birthday:", e);
            this.birthday = null;
          }
        }
        formatAppLog("log", "at pages/result/loading.vue:110", "Parsed data:", {
          userId: this.userId,
          username: this.username,
          gender: this.gender,
          selectedOptions: this.selectedOptions,
          birthday: this.birthday,
          jobId: this.jobId,
          num: this.num
        });
      } catch (e) {
        formatAppLog("log", "at pages/result/loading.vue:120", "something error happend", e);
      }
      this.getHomepageData();
    },
    onUnload() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
      if (this.progressInterval) {
        clearInterval(this.progressInterval);
      }
      if (this.interval) {
        clearInterval(this.interval);
      }
    },
    methods: {
      progressWidth(value) {
        const percentage = value / this.maxScore * 100;
        return `${percentage}%`;
      },
      circleLeftPosition(value) {
        const percentage1 = value / this.maxScore * 100;
        const progressBarWidth = uni.getSystemInfoSync().windowWidth * 0.8;
        formatAppLog("log", "at pages/result/loading.vue:148", percentage1);
        return percentage1 / 100 * progressBarWidth;
      },
      getHomepageData() {
        const that = this;
        uni.request({
          url: `https://eqmaster.azurewebsites.net/get_homepage/${this.jobId}`,
          method: "POST",
          success(response) {
            let result = {};
            if (response.statusCode === 200) {
              result = response.data;
              formatAppLog("log", "at pages/result/loading.vue:160", "Homepage data received:", result);
            } else {
              let mock = {
                "response": {
                  "personal_info": {
                    "name": "John Doe",
                    "tag": "Engineer",
                    "tag_description": "A detail-oriented engineer with a passion for problem-solving.",
                    "job_id": "12345"
                  },
                  "eq_scores": {
                    "score": 46,
                    "dimension1_score": 54,
                    "dimension1_detail": "Shows excellent emotional regulation in stressful situations.",
                    "dimension2_score": 26,
                    "dimension2_detail": "Displays strong empathy towards others' feelings.",
                    "dimension3_score": 42,
                    "dimension3_detail": "Able to make decisions without letting emotions interfere.",
                    "dimension4_score": 50,
                    "dimension4_detail": "Communicates emotions clearly and effectively.",
                    "dimension5_score": 44,
                    "dimension5_detail": "Manages interpersonal relationships with ease.",
                    "summary": "Overall, emotionally intelligent and adaptive.",
                    "detail": "John demonstrates balanced emotional intelligence across all areas.",
                    "overall_suggestion": "Continue to enhance emotional regulation and interpersonal communication.",
                    "detail_summary": "A well-rounded emotional intelligence profile with strong interpersonal skills."
                  }
                }
              };
              result = mock;
              formatAppLog("error", "at pages/result/loading.vue:191", "Failed to fetch homepage data:", response.statusCode);
            }
            if (that.interval) {
              clearInterval(that.interval);
              that.interval = null;
            }
            if (that.progressInterval) {
              clearInterval(that.progressInterval);
              that.interval = null;
            }
            if (that.timeoutInterval) {
              clearInterval(that.timeoutInterval);
              that.timeoutInterval = null;
            }
            const nextPageUrl = `/pages/result/result?jobId=${this.jobId}&userId=${this.userId}&username=${encodeURIComponent(this.username)}&gender=${this.gender}&birthday=${encodeURIComponent(JSON.stringify(this.birthday))}&options=${encodeURIComponent(JSON.stringify(this.selectedOptions))}&num=${this.num}`;
            uni.setStorage({
              key: "response",
              data: result
            });
            formatAppLog("log", "at pages/result/loading.vue:214", "begin to navigate");
            uni.navigateTo({
              url: nextPageUrl,
              fail: (err) => {
                formatAppLog("error", "at pages/result/loading.vue:218", "Navigation failed:", err);
                uni.showToast({
                  title: "页面跳转失败",
                  icon: "none"
                });
              }
            });
          },
          fail(error) {
            formatAppLog("error", "at pages/result/loading.vue:227", "Error fetching homepage data:", error);
          }
        });
      },
      startProgress() {
        const totalDuration = 3e4;
        const intervalDuration = totalDuration / 100;
        this.progressInterval = setInterval(() => {
          if (this.progress < 100) {
            this.progress += 1;
          } else {
            clearInterval(this.progressInterval);
          }
        }, intervalDuration);
      },
      animateImage() {
        this.interval = setInterval(() => {
          this.splashImageLeft1 -= 10;
          this.splashImageLeft2 -= 10;
          if (this.splashImageLeft1 <= -this.imageWidth) {
            this.splashImageLeft1 = this.splashImageLeft2 + this.imageWidth;
          }
          if (this.splashImageLeft2 <= -this.imageWidth) {
            this.splashImageLeft2 = this.splashImageLeft1 + this.imageWidth;
          }
        }, 30);
      },
      expand() {
        this.isExpanded = true;
      }
    },
    mounted() {
      this.startProgress();
      this.animateImage();
      this.timeoutInterval = setTimeout(() => {
        if (this.interval) {
          formatAppLog("log", "at pages/result/loading.vue:271", "cancel splash by timeout.");
          clearInterval(this.interval);
        }
      }, 3e4);
    },
    beforeDestroy() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
      if (this.progressInterval) {
        clearInterval(this.progressInterval);
        this.progressInterval = null;
      }
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
    }
  };
  function _sfc_render$f(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("view", { class: "splash-screen" }, [
        vue.createElementVNode("text", { class: "splash-text" }, "接下来，\\n一起来看看你的职场人格类型吧！"),
        vue.createElementVNode(
          "image",
          {
            class: "splash-image",
            src: _imports_0$7,
            mode: "widthFix",
            style: vue.normalizeStyle({ left: $data.splashImageLeft1 + "rpx" })
          },
          null,
          4
          /* STYLE */
        ),
        vue.createElementVNode(
          "image",
          {
            class: "splash-image",
            src: _imports_0$7,
            mode: "widthFix",
            style: vue.normalizeStyle({ left: $data.splashImageLeft2 + "rpx" })
          },
          null,
          4
          /* STYLE */
        ),
        vue.createElementVNode(
          "text",
          { class: "splash-progress-text" },
          vue.toDisplayString($data.progress) + "%",
          1
          /* TEXT */
        ),
        vue.createElementVNode("view", { class: "splash-progress-bar" }, [
          vue.createElementVNode(
            "view",
            {
              class: "splash-progress-fill",
              style: vue.normalizeStyle({ width: $data.progress + "%" })
            },
            null,
            4
            /* STYLE */
          )
        ]),
        vue.createElementVNode("text", { class: "status-text" }, "努力分析中...")
      ])
    ]);
  }
  const PagesResultLoading = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["render", _sfc_render$f], ["__scopeId", "data-v-af79a7c4"], ["__file", "/Users/peipeiwang/wppDev/eqmaster_/test/pages/result/loading.vue"]]);
  function drawRadar(canvasId, data) {
    formatAppLog("log", "at scripts/draw_radar.js:22", "started to draw radar chart");
    formatAppLog("log", "at scripts/draw_radar.js:23", "data", data);
    try {
      var ctx = uni.createCanvasContext(canvasId);
      ctx.width = 300;
      ctx.height = 300;
      const center = {
        x: ctx.width / 2,
        y: ctx.height / 2 + 40
      };
      const radius = Math.min(ctx.width, ctx.height) / 2 - 35;
      ctx.clearRect(0, 0, ctx.width, ctx.height);
      formatAppLog("log", "at scripts/draw_radar.js:35", "width:height", ctx.width, ctx.height);
      const numSides = data.length;
      const angleSlice = Math.PI * 2 / numSides;
      const startAngle = -Math.PI / 2;
      ctx.setStrokeStyle("#aaa8ac");
      ctx.setLineWidth(1);
      for (let i = 1; i <= 2; i++) {
        ctx.beginPath();
        for (let j = 0; j <= numSides; j++) {
          const angle = startAngle + j * angleSlice;
          const x = center.x + radius * (i / 2) * Math.cos(angle);
          const y = center.y + radius * (i / 2) * Math.sin(angle);
          if (j === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.stroke();
      }
      for (let i = 0; i < numSides; i++) {
        const angle = startAngle + i * angleSlice;
        const x = center.x + radius * Math.cos(angle);
        const y = center.y + radius * Math.sin(angle);
        ctx.beginPath();
        ctx.moveTo(center.x, center.y);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.setFillStyle("rgba(164, 163, 171, 0.3)");
      ctx.setStrokeStyle("rgba(158, 228, 77, 0.8)");
      ctx.setLineWidth(4);
      for (let i = 0; i <= numSides; i++) {
        const angle = startAngle + i * angleSlice;
        const value = data[i % numSides].A / data[i % numSides].fullMark;
        const x = center.x + radius * value * Math.cos(angle);
        const y = center.y + radius * value * Math.sin(angle);
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.setFillStyle("rgba(158, 228, 77, 0.8)");
      for (let i = 0; i < numSides; i++) {
        const angle = startAngle + i * angleSlice;
        const value = data[i].A / data[i].fullMark;
        const x = center.x + radius * value * Math.cos(angle);
        const y = center.y + radius * value * Math.sin(angle);
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.draw();
    } catch (e) {
      formatAppLog("log", "at scripts/draw_radar.js:108", e);
    }
  }
  const _imports_0$6 = "/static/back.png";
  const _imports_1$3 = "/static/battlefield/share.png";
  const _imports_2$1 = "/static/green.png";
  const _imports_3$1 = "/static/star.png";
  const _imports_4$1 = "/static/up.png";
  const _imports_5$1 = "/static/up3.png";
  const _sfc_main$f = {
    data() {
      return {
        score: 28,
        // 示例分数，可根据需要动态更改
        maxScore: 100,
        // 假设最大分数为100
        userId: "",
        username: "",
        gender: "",
        birthday: null,
        homepageData: {
          response: {
            personal_info: {
              name: "",
              tag: "",
              tag_description: "",
              job_id: ""
            },
            eq_scores: {
              score: 0,
              dimension1_score: 0,
              dimension1_detail: "",
              dimension2_score: 0,
              dimension2_detail: "",
              dimension3_score: 0,
              dimension3_detail: "",
              dimension4_score: 0,
              dimension4_detail: "",
              dimension5_score: 0,
              dimension5_detail: "",
              summary: "",
              detail: "",
              overall_suggestion: "",
              detail_summary: ""
            },
            contacts: []
          }
        },
        progress: 0,
        imageWidth: 2e3,
        isExpanded: false
        // 默认收起状态
      };
    },
    computed: {
      formattedBirthday() {
        if (this.birthday) {
          const date = new Date(this.birthday.year, this.birthday.month - 1, this.birthday.day);
          return date.toLocaleDateString();
        }
        return "未设置";
      },
      illustrationSrc() {
        const scores = this.homepageData.response.eq_scores;
        formatAppLog("log", "at pages/result/result.vue:223", "results for backgrounds:", scores);
        const minScore = Math.min(scores.dimension1_score, scores.dimension2_score, scores.dimension3_score, scores.dimension4_score, scores.dimension5_score);
        if (minScore === scores.dimension1_score) {
          formatAppLog("log", "at pages/result/result.vue:229", "illustration src:", "1");
          return "/static/aniimals/kapibala.png";
        } else if (minScore === scores.dimension2_score) {
          formatAppLog("log", "at pages/result/result.vue:232", "illustration src:", "2");
          return "/static/aniimals/houzi.png";
        } else if (minScore === scores.dimension3_score) {
          formatAppLog("log", "at pages/result/result.vue:235", "illustration src:", "3");
          return "/static/aniimals/ciwei.png";
        } else if (minScore === scores.dimension4_score) {
          formatAppLog("log", "at pages/result/result.vue:238", "illustration src:", "4");
          return "/static/aniimals/tuoniao.png";
        } else if (minScore === scores.dimension5_score) {
          formatAppLog("log", "at pages/result/result.vue:241", "illustration src:", "5");
          return "/static/aniimals/lang.png";
        }
      }
    },
    onLoad(option) {
      formatAppLog("log", "at pages/result/result.vue:247", "option", option);
      this.userId = option.userId || "";
      this.username = decodeURIComponent(option.username || "");
      try {
        uni.getStorage({
          key: "response",
          success: (res) => {
            formatAppLog("log", "at pages/result/result.vue:255", "########successfully retrieved data", res);
            this.homepageData = res.data;
            formatAppLog("log", "at pages/result/result.vue:257", "begin to draw radar");
            this.drawRadar();
          }
        });
      } catch (e) {
        formatAppLog("log", "at pages/result/result.vue:262", "something error happened", e);
      }
    },
    onUnload() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
      if (this.progressInterval) {
        clearInterval(this.progressInterval);
      }
      if (this.interval) {
        clearInterval(this.interval);
      }
    },
    onReady() {
      if (!this.username) {
        uni.getStorage({
          key: "username",
          success: (res) => {
            this.username = res.data;
            formatAppLog("log", "at pages/result/result.vue:284", "Username from storage:", this.username);
          },
          fail: () => {
            formatAppLog("error", "at pages/result/result.vue:287", "Failed to get username from storage");
          }
        });
      }
    },
    methods: {
      progressWidth(value) {
        const percentage = value / this.maxScore * 100;
        return `${percentage}%`;
      },
      circleLeftPosition(value) {
        const percentage1 = value / this.maxScore * 100;
        const progressBarWidth = uni.getSystemInfoSync().windowWidth * 0.8;
        formatAppLog("log", "at pages/result/result.vue:303", percentage1);
        return percentage1 / 100 * progressBarWidth;
      },
      drawRadar() {
        formatAppLog("log", "at pages/result/result.vue:308", "======begin to draw radar chart, data:", this.homepageData.response);
        const data = [
          {
            subject: "维度1",
            A: this.homepageData.response.eq_scores.dimension1_score || 0,
            fullMark: 100
          },
          {
            subject: "维度2",
            A: this.homepageData.response.eq_scores.dimension2_score || 0,
            fullMark: 100
          },
          {
            subject: "维度3",
            A: this.homepageData.response.eq_scores.dimension3_score || 0,
            fullMark: 100
          },
          {
            subject: "维度4",
            A: this.homepageData.response.eq_scores.dimension4_score || 0,
            fullMark: 100
          },
          {
            subject: "维度5",
            A: this.homepageData.response.eq_scores.dimension5_score || 0,
            fullMark: 100
          }
        ];
        formatAppLog("log", "at pages/result/result.vue:335", "Draw radar started");
        drawRadar("radarCanvas", data);
        formatAppLog("log", "at pages/result/result.vue:337", "Draw radar stopped");
      },
      navigateToGuide() {
        formatAppLog("log", "at pages/result/result.vue:340", "Navigating to guide with data:", {
          userId: this.userId,
          username: this.username,
          jobId: this.homepageData.response.personal_info.job_id
        });
        uni.navigateTo({
          url: `/pages/dashboard/dashboard?userId=${this.userId}&username=${encodeURIComponent(this.username)}&jobId=${this.homepageData.response.personal_info.job_id}`
        });
      },
      expand() {
        this.isExpanded = true;
      }
    }
  };
  function _sfc_render$e(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_vew = vue.resolveComponent("vew");
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("scroll-view", {
        "scroll-y": "",
        style: { "height": "100%" }
      }, [
        vue.createElementVNode("view", { class: "content" }, [
          vue.createCommentVNode(' <view class="debug-info"> '),
          vue.createCommentVNode(" 如需调试信息，可取消注释以下行 "),
          vue.createCommentVNode(" <text>homepageData: {{ JSON.stringify(homepageData) }}</text> "),
          vue.createCommentVNode(" </view> "),
          vue.createElementVNode("view", { class: "header" }, [
            vue.createElementVNode("image", {
              class: "header-icon",
              src: _imports_0$6
            }),
            vue.createElementVNode(
              "text",
              { class: "score-title-head" },
              vue.toDisplayString($data.homepageData.response.personal_info.name) + "我的检测结果",
              1
              /* TEXT */
            ),
            vue.createElementVNode("image", {
              class: "header-icon",
              src: _imports_1$3
            })
          ]),
          vue.createElementVNode("view", { class: "background-curve" }),
          vue.createElementVNode("image", {
            class: "illustration1",
            src: $options.illustrationSrc,
            mode: "widthFix"
          }, null, 8, ["src"]),
          vue.createElementVNode("view", { class: "card" }, [
            vue.createElementVNode("view", { class: "average-score-container" }, [
              vue.createElementVNode(
                "text",
                { class: "score-title" },
                "情商得分: " + vue.toDisplayString($data.homepageData.response.eq_scores.score),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("canvas", {
              id: "radarCanvas",
              "canvas-id": "radarCanvas",
              class: "radar-canvas",
              width: "400",
              height: "400"
            }),
            vue.createElementVNode("view", { class: "emotion-detection-box1" }, [
              vue.createElementVNode("text", { class: "emotion-detection-title" }, "情绪侦查力")
            ]),
            vue.createElementVNode("view", { class: "emotion-detection-box2" }, [
              vue.createElementVNode("text", { class: "emotion-detection-title" }, "社交得体度")
            ]),
            vue.createElementVNode("view", { class: "emotion-detection-box3" }, [
              vue.createElementVNode("text", { class: "emotion-detection-title" }, "沟通表达力")
            ]),
            vue.createElementVNode("view", { class: "emotion-detection-box4" }, [
              vue.createElementVNode("text", { class: "emotion-detection-title" }, "情绪掌控力")
            ]),
            vue.createElementVNode("view", { class: "emotion-detection-box5" }, [
              vue.createElementVNode("text", { class: "emotion-detection-title" }, "人际平衡力")
            ]),
            vue.createElementVNode("view", { class: "subtitle-container" }, [
              vue.createElementVNode("text", { class: "subtitle" }, "问题诊断"),
              vue.createElementVNode("image", {
                class: "title-sub-line",
                src: _imports_2$1,
                mode: "scaleToFill"
              })
            ]),
            vue.createElementVNode("view", { class: "card-text-container" }, [
              vue.createElementVNode(
                "text",
                { class: "card-title" },
                vue.toDisplayString($data.homepageData.response.eq_scores.summary),
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "text",
                { class: "card-description" },
                vue.toDisplayString($data.homepageData.response.eq_scores.overall_suggestion),
                1
                /* TEXT */
              )
            ])
          ]),
          vue.createElementVNode("view", { class: "card" }, [
            vue.createElementVNode("view", { class: "subtitle-container" }, [
              vue.createElementVNode("text", { class: "subtitle" }, "提升指南"),
              vue.createElementVNode("image", {
                class: "title-sub-line",
                src: _imports_2$1,
                mode: "scaleToFill"
              })
            ]),
            vue.createElementVNode("image", {
              class: "illustration4",
              src: _imports_3$1,
              mode: "widthFix"
            }),
            vue.createElementVNode("image", {
              class: "illustration5",
              src: _imports_4$1,
              mode: "widthFix"
            }),
            vue.createElementVNode("image", {
              class: "illustration6",
              src: _imports_5$1,
              mode: "widthFix"
            }),
            vue.createElementVNode("view", { class: "card-text-container" }, [
              vue.createElementVNode(
                "text",
                { class: "card-title" },
                vue.toDisplayString($data.homepageData.response.eq_scores.detail_summary),
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "text",
                { class: "card-description" },
                vue.toDisplayString($data.homepageData.response.eq_scores.detail),
                1
                /* TEXT */
              )
            ])
          ]),
          vue.createCommentVNode(" 添加白色卡片2 "),
          vue.createElementVNode("view", { class: "card" }, [
            vue.createElementVNode("view", { class: "subtitle-container" }, [
              vue.createElementVNode("text", { class: "subtitle" }, "详细报告"),
              vue.createElementVNode("image", {
                class: "title-sub-line",
                src: _imports_2$1,
                mode: "scaleToFill"
              })
            ]),
            vue.createCommentVNode(" 维度一 "),
            vue.createElementVNode("view", { class: "score-container1" }, [
              vue.createElementVNode("text", { class: "score-title1" }, "情绪侦查力"),
              vue.createElementVNode("view", { class: "progress-container" }, [
                vue.createElementVNode("view", { class: "progress-bar1" }, [
                  vue.createElementVNode(
                    "view",
                    {
                      class: "progress",
                      style: vue.normalizeStyle({ width: $options.progressWidth($data.homepageData.response.eq_scores.dimension1_score) })
                    },
                    null,
                    4
                    /* STYLE */
                  )
                ]),
                vue.createElementVNode(
                  "text",
                  { class: "score-title2" },
                  vue.toDisplayString($data.homepageData.response.eq_scores.dimension1_score) + "%",
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode(
                "text",
                { class: "card-description" },
                vue.toDisplayString($data.homepageData.response.eq_scores.dimension1_detail),
                1
                /* TEXT */
              )
            ]),
            vue.createCommentVNode(" 维度二 "),
            vue.createElementVNode("view", { class: "score-container1" }, [
              vue.createElementVNode("text", { class: "score-title1" }, "社交得体度"),
              vue.createCommentVNode(" 进度条 "),
              vue.createElementVNode("view", { class: "progress-container" }, [
                vue.createElementVNode("view", { class: "progress-bar1" }, [
                  vue.createElementVNode(
                    "view",
                    {
                      class: "progress",
                      style: vue.normalizeStyle({ width: $options.progressWidth($data.homepageData.response.eq_scores.dimension2_score) })
                    },
                    null,
                    4
                    /* STYLE */
                  )
                ]),
                vue.createElementVNode(
                  "text",
                  { class: "score-title2" },
                  vue.toDisplayString($data.homepageData.response.eq_scores.dimension2_score) + "%",
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode(
                "text",
                { class: "card-description" },
                vue.toDisplayString($data.homepageData.response.eq_scores.dimension2_detail),
                1
                /* TEXT */
              )
            ]),
            !$data.isExpanded ? (vue.openBlock(), vue.createElementBlock("image", {
              key: 0,
              onClick: _cache[0] || (_cache[0] = (...args) => $options.expand && $options.expand(...args)),
              src: _imports_6$2,
              class: "expand-image"
            })) : vue.createCommentVNode("v-if", true),
            !$data.isExpanded ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "bottom"
            }, [
              vue.createElementVNode("text", { class: "bottom-text" }, "-到底啦-")
            ])) : vue.createCommentVNode("v-if", true),
            $data.isExpanded ? (vue.openBlock(), vue.createElementBlock(
              vue.Fragment,
              { key: 2 },
              [
                vue.createElementVNode("view", { class: "score-container1" }, [
                  vue.createElementVNode("text", { class: "score-title1" }, "情绪掌控力"),
                  vue.createCommentVNode(" 进度条 "),
                  vue.createElementVNode("view", { class: "progress-container" }, [
                    vue.createElementVNode("view", { class: "progress-bar1" }, [
                      vue.createElementVNode(
                        "view",
                        {
                          class: "progress",
                          style: vue.normalizeStyle({ width: $options.progressWidth($data.homepageData.response.eq_scores.dimension3_score) })
                        },
                        null,
                        4
                        /* STYLE */
                      )
                    ]),
                    vue.createElementVNode(
                      "text",
                      { class: "score-title2" },
                      vue.toDisplayString($data.homepageData.response.eq_scores.dimension3_score) + "%",
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode(
                    "text",
                    { class: "card-description" },
                    vue.toDisplayString($data.homepageData.response.eq_scores.dimension3_detail),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "score-container1" }, [
                  vue.createElementVNode("text", { class: "score-title1" }, "沟通表达力"),
                  vue.createCommentVNode(" 进度条 "),
                  vue.createElementVNode("view", { class: "progress-container" }, [
                    vue.createElementVNode("view", { class: "progress-bar1" }, [
                      vue.createElementVNode(
                        "view",
                        {
                          class: "progress",
                          style: vue.normalizeStyle({ width: $options.progressWidth($data.homepageData.response.eq_scores.dimension4_score) })
                        },
                        null,
                        4
                        /* STYLE */
                      )
                    ]),
                    vue.createElementVNode(
                      "text",
                      { class: "score-title2" },
                      vue.toDisplayString($data.homepageData.response.eq_scores.dimension4_score) + "%",
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode(
                    "text",
                    { class: "card-description" },
                    vue.toDisplayString($data.homepageData.response.eq_scores.dimension4_detail),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "score-container1" }, [
                  vue.createElementVNode("text", { class: "score-title1" }, "人际平衡力"),
                  vue.createCommentVNode(" 进度条 "),
                  vue.createElementVNode("view", { class: "progress-container" }, [
                    vue.createElementVNode("view", { class: "progress-bar1" }, [
                      vue.createElementVNode(
                        "view",
                        {
                          class: "progress",
                          style: vue.normalizeStyle({ width: $options.progressWidth($data.homepageData.response.eq_scores.dimension5_score) })
                        },
                        null,
                        4
                        /* STYLE */
                      )
                    ]),
                    vue.createElementVNode(
                      "text",
                      { class: "score-title2" },
                      vue.toDisplayString($data.homepageData.response.eq_scores.dimension5_score) + "%",
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode(
                    "text",
                    { class: "card-description" },
                    vue.toDisplayString($data.homepageData.response.eq_scores.dimension5_detail),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createVNode(_component_vew, { class: "place-holder" })
              ],
              64
              /* STABLE_FRAGMENT */
            )) : vue.createCommentVNode("v-if", true)
          ]),
          vue.createElementVNode("button", {
            class: "guide-button",
            onClick: _cache[1] || (_cache[1] = (...args) => $options.navigateToGuide && $options.navigateToGuide(...args))
          }, "开启高情商之旅")
        ])
      ])
    ]);
  }
  const PagesResultResult = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", _sfc_render$e], ["__scopeId", "data-v-b615976f"], ["__file", "/Users/peipeiwang/wppDev/eqmaster_/test/pages/result/result.vue"]]);
  const _imports_0$5 = "/static/bg1.png";
  const _sfc_main$e = {
    data() {
      return {
        userInfoStyle: {
          bottom: "180px",
          left: "50%",
          marginLeft: "-65px"
          // 替换 transform
        },
        userId: "",
        username: "",
        gender: "",
        selectedOptions: [],
        birthday: null,
        scenarioData: null,
        background: "",
        description: "",
        selectedOptionIndex: null,
        num: null,
        jobId: null,
        baseURL: "https://eqmaster.azurewebsites.net"
        // 请替换为您的实际后端地址
      };
    },
    onLoad(option) {
      formatAppLog("log", "at pages/test/test5.vue:46", "Received options:", option);
      this.userId = option.userId || "";
      this.username = decodeURIComponent(option.username || "");
      this.gender = option.gender || "";
      this.jobId = option.jobId || "";
      if (option.options) {
        try {
          this.selectedOptions = JSON.parse(decodeURIComponent(option.options));
        } catch (e) {
          formatAppLog("error", "at pages/test/test5.vue:58", "Error parsing options:", e);
          this.selectedOptions = [];
        }
      }
      if (option.birthday) {
        try {
          this.birthday = JSON.parse(decodeURIComponent(option.birthday));
        } catch (e) {
          formatAppLog("error", "at pages/test/test5.vue:67", "Error parsing birthday:", e);
          this.birthday = null;
        }
      }
      formatAppLog("log", "at pages/test/test5.vue:72", "Parsed data:", {
        userId: this.userId,
        username: this.username,
        gender: this.gender,
        selectedOptions: this.selectedOptions,
        birthday: this.birthday,
        jobId: this.jobId
      });
      this.getScenarioData();
    },
    methods: {
      updateUserInfoPosition(x, y) {
        this.userInfoStyle.left = `${x}px`;
        this.userInfoStyle.bottom = `${y}px`;
        this.userInfoStyle.marginLeft = "0px";
      },
      selectOption(index) {
        this.selectedOptionIndex = index;
        this.num = index + 1;
        formatAppLog("log", "at pages/test/test5.vue:94", "Selected option:", this.num, this.scenarioData.options[index].text);
        this.scenarioData.options.forEach((option, i) => {
          option.textColor = i === index ? "black" : "white";
        });
      },
      navigateToTest1() {
        const testPageUrl = `/pages/test/test3?jobId=${this.jobId}&userId=${this.userId}&username=${encodeURIComponent(this.username)}&gender=${this.gender}&birthday=${encodeURIComponent(JSON.stringify(this.birthday))}&options=${encodeURIComponent(JSON.stringify(this.selectedOptions))}&num=${this.num}`;
        uni.navigateTo({
          url: testPageUrl
        });
      },
      nextPage() {
        if (this.num === null) {
          uni.showToast({
            title: "请选择一个选项",
            icon: "none"
          });
          return;
        }
        formatAppLog("log", "at pages/test/test5.vue:118", "Sending data to backend:", {
          choice: this.num,
          job_id: this.jobId
        });
        uni.request({
          url: `${this.baseURL}/choose_scenario`,
          method: "POST",
          data: {
            choice: this.num,
            job_id: this.jobId
          },
          success: (response) => {
            formatAppLog("log", "at pages/test/test5.vue:131", "Full response:", response);
            if (response.statusCode === 200) {
              const result = response.data;
              formatAppLog("log", "at pages/test/test5.vue:135", "Response data:", result);
              let nextPageUrl;
              if (result.message === "Final choice made. Processing data in background.") {
                nextPageUrl = `/pages/result/loading?jobId=${this.jobId}&userId=${this.userId}&username=${encodeURIComponent(this.username)}&gender=${this.gender}&birthday=${encodeURIComponent(JSON.stringify(this.birthday))}&options=${encodeURIComponent(JSON.stringify(this.selectedOptions))}&num=${this.num}`;
              } else {
                nextPageUrl = `/pages/test/test3?jobId=${this.jobId}&userId=${this.userId}&username=${encodeURIComponent(this.username)}&gender=${this.gender}&birthday=${encodeURIComponent(JSON.stringify(this.birthday))}&options=${encodeURIComponent(JSON.stringify(this.selectedOptions))}&num=${this.num}`;
              }
              formatAppLog("log", "at pages/test/test5.vue:146", "Navigating to:", nextPageUrl);
              uni.navigateTo({
                url: nextPageUrl,
                fail: (err) => {
                  formatAppLog("error", "at pages/test/test5.vue:151", "Navigation failed:", err);
                  uni.showToast({
                    title: "页面跳转失败",
                    icon: "none"
                  });
                }
              });
            } else {
              uni.showToast({
                title: `请求失败，状态码：${response.statusCode}`,
                icon: "none"
              });
            }
          },
          fail: (error) => {
            formatAppLog("error", "at pages/test/test5.vue:166", "Detailed error:", error);
            uni.showToast({
              title: `发生错误：${error.errMsg}`,
              icon: "none"
            });
          }
        });
      },
      getScenarioData() {
        uni.request({
          url: `${this.baseURL}/get_current_scenario/${this.jobId}`,
          method: "POST",
          success: (res) => {
            formatAppLog("log", "at pages/test/test5.vue:179", "Scenario data:", res.data);
            this.scenarioData = res.data.scenes || res.data;
            this.handleScenarioData();
          },
          fail: (err) => {
            formatAppLog("error", "at pages/test/test5.vue:198", "Error getting scenario data:", err);
          }
        });
      },
      handleScenarioData() {
        if (this.scenarioData) {
          this.description = this.scenarioData.description || "无法获取背景信息";
        } else {
          formatAppLog("warn", "at pages/test/test5.vue:206", "Background information not found in scenario data");
          this.description = "无法获取背景信息";
        }
      }
    }
  };
  function _sfc_render$d(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("image", {
        class: "background-image",
        src: _imports_0$5,
        mode: "aspectFill"
      }),
      vue.createCommentVNode(" 包裹选项列表的容器 "),
      vue.createElementVNode("view", { class: "options-container" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.scenarioData && $data.scenarioData.options ? $data.scenarioData.options : [], (option, index) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              key: index,
              class: vue.normalizeClass(["text-box", { "selected": $data.selectedOptionIndex === index }]),
              onClick: ($event) => $options.selectOption(index)
            }, [
              vue.createElementVNode(
                "text",
                {
                  class: "text-content",
                  style: vue.normalizeStyle({ color: option.textColor || "white" })
                },
                vue.toDisplayString(option.text),
                5
                /* TEXT, STYLE */
              )
            ], 10, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ]),
      vue.createElementVNode("view", { class: "button-container" }, [
        vue.createElementVNode("view", {
          class: "continue-button",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.nextPage && $options.nextPage(...args))
        }, [
          vue.createElementVNode("text", { class: "arrow" }, "→")
        ])
      ])
    ]);
  }
  const PagesTestTest5 = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$d], ["__scopeId", "data-v-f87db42d"], ["__file", "/Users/peipeiwang/wppDev/eqmaster_/test/pages/test/test5.vue"]]);
  const _imports_0$4 = "/static/rec-right.png";
  const _imports_2 = "/static/icon3.png";
  const _sfc_main$d = {
    props: {
      userName: {
        type: String,
        required: true
      },
      avatar: {
        type: String,
        required: true
      },
      dismiss: {
        type: Function,
        required: true
      },
      description: {
        type: String,
        default: "这里是描述信息"
      }
    }
  };
  function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "bubble-container" }, [
      vue.createElementVNode("view", { class: "text-box" }, [
        vue.createElementVNode("view", { class: "user-info" }, [
          vue.createElementVNode("image", {
            class: "user-avatar",
            src: $props.avatar,
            mode: "aspectFill"
          }, null, 8, ["src"]),
          vue.createElementVNode(
            "text",
            { class: "user-name" },
            vue.toDisplayString($props.userName),
            1
            /* TEXT */
          ),
          vue.createElementVNode("image", {
            class: "name-background",
            src: _imports_0$4,
            mode: "aspectFill"
          })
        ]),
        vue.createElementVNode(
          "text",
          { class: "text-content" },
          vue.toDisplayString($props.description),
          1
          /* TEXT */
        ),
        vue.createElementVNode("view", {
          class: "expand-icon",
          onClick: _cache[0] || (_cache[0] = (...args) => $props.dismiss && $props.dismiss(...args))
        }, [
          vue.createElementVNode("image", {
            class: "icon-image",
            src: _imports_2,
            mode: "aspectFit"
          })
        ])
      ])
    ]);
  }
  const OnboardingChatBubble = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$c], ["__scopeId", "data-v-9e1372ab"], ["__file", "/Users/peipeiwang/wppDev/eqmaster_/test/components/OnboardingChatBubble.vue"]]);
  const _sfc_main$c = {
    components: {
      OnboardingChatBubble
      // 注册组件
    },
    data() {
      return {
        userId: "",
        username: "",
        gender: "",
        selectedOptions: [],
        npcName: "",
        npcAvatar: "",
        birthday: null,
        scenarioData: null,
        background: "",
        description: "",
        jobId: "",
        firstScene: false,
        baseURL: "https://eqmaster.azurewebsites.net"
        // 请替换为您的实际后端地址
      };
    },
    onLoad(option) {
      formatAppLog("log", "at pages/test/test1.vue:43", "Received options:", option);
      this.userId = option.userId || "";
      this.username = decodeURIComponent(option.username || "");
      this.gender = option.gender || "";
      this.jobId = option.jobId || "";
      this.background = option.background || "";
      this.firstScene = option.firstScene || false;
      formatAppLog("log", "at pages/test/test1.vue:53", "first scene?", option.firstScene || false);
      if (option.background) {
        formatAppLog("log", "at pages/test/test1.vue:56", "analysing background:");
        this.npcName = findLastName(option.background);
        this.npcAvatar = getAvatar(this.npcName);
      } else {
        formatAppLog("error", "at pages/test/test1.vue:60", "not passing background");
      }
      if (option.options) {
        try {
          this.selectedOptions = JSON.parse(decodeURIComponent(option.options));
        } catch (e) {
          formatAppLog("error", "at pages/test/test1.vue:67", "Error parsing options:", e);
          this.selectedOptions = [];
        }
      }
      if (option.birthday) {
        try {
          this.birthday = JSON.parse(decodeURIComponent(option.birthday));
        } catch (e) {
          formatAppLog("error", "at pages/test/test1.vue:76", "Error parsing birthday:", e);
          this.birthday = null;
        }
      }
      formatAppLog("log", "at pages/test/test1.vue:81", "Parsed data:", {
        userId: this.userId,
        username: this.username,
        gender: this.gender,
        selectedOptions: this.selectedOptions,
        birthday: this.birthday
      });
      this.getScenarioData();
    },
    methods: {
      navigateToTest1() {
        formatAppLog("log", "at pages/test/test1.vue:93", "clicked dismiss");
        const testPageUrl = `/pages/test/test2?jobId=${this.jobId}&userId=${this.userId}&username=${encodeURIComponent(this.username)}&gender=${this.gender}&birthday=${encodeURIComponent(JSON.stringify(this.birthday))}&options=${encodeURIComponent(JSON.stringify(this.selectedOptions))}`;
        uni.navigateTo({
          url: testPageUrl
        });
      },
      getScenarioData() {
        const requestUrl = this.firstScene ? `${this.baseURL}/start_scenario/${this.jobId}` : `${this.baseURL}/get_current_scenario/${this.jobId}`;
        uni.request({
          url: requestUrl,
          method: "POST",
          success: (res) => {
            formatAppLog("log", "at pages/test/test1.vue:109", "Scenario data:", res.data);
            this.scenarioData = res.data;
            this.handleScenarioData();
          },
          fail: (err) => {
            formatAppLog("error", "at pages/test/test1.vue:114", "Error getting scenario data:", err);
          }
        });
      },
      handleScenarioData() {
        if (this.scenarioData) {
          this.description = this.scenarioData.scenes.description || "无法获取背景信息";
        } else {
          formatAppLog("warn", "at pages/test/test1.vue:122", "Background information not found in scenario data");
          this.description = "无法获取背景信息";
        }
      }
    }
  };
  function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_onboarding_chat_bubble = vue.resolveComponent("onboarding-chat-bubble");
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("image", {
        class: "background-image",
        src: _imports_0$5,
        mode: "aspectFill"
      }),
      vue.createCommentVNode(' <view class="banner-container"> '),
      vue.createCommentVNode(' <image class="logo" src="/static/signa.png" mode="aspectFit" /> '),
      vue.createCommentVNode(' <text class="room-text">三楼电梯间</text> '),
      vue.createCommentVNode(" </view> "),
      vue.createVNode(_component_onboarding_chat_bubble, {
        userName: $data.npcName,
        avatar: $data.npcAvatar,
        dismiss: $options.navigateToTest1,
        description: $data.description
      }, null, 8, ["userName", "avatar", "dismiss", "description"])
    ]);
  }
  const PagesTestTest1 = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$b], ["__scopeId", "data-v-f400b819"], ["__file", "/Users/peipeiwang/wppDev/eqmaster_/test/pages/test/test1.vue"]]);
  const _imports_1$2 = "/static/signa.png";
  const _sfc_main$b = {
    data() {
      return {
        userId: "",
        username: "",
        gender: "",
        selectedOptions: [],
        birthday: null,
        scenarioData: null,
        background: "请点击下方箭头继续",
        jobId: ""
      };
    },
    onLoad(option) {
      formatAppLog("log", "at pages/test/test.vue:31", "Received options:", option);
      this.userId = option.userId || "";
      this.username = decodeURIComponent(option.username || "");
      this.gender = option.gender || "";
      if (option.options) {
        try {
          this.selectedOptions = JSON.parse(decodeURIComponent(option.options));
        } catch (e) {
          formatAppLog("error", "at pages/test/test.vue:42", "Error parsing options:", e);
          this.selectedOptions = [];
        }
      }
      if (option.birthday) {
        try {
          this.birthday = JSON.parse(decodeURIComponent(option.birthday));
        } catch (e) {
          formatAppLog("error", "at pages/test/test.vue:51", "Error parsing birthday:", e);
          this.birthday = null;
        }
      }
      formatAppLog("log", "at pages/test/test.vue:56", "Parsed data:", {
        userId: this.userId,
        username: this.username,
        gender: this.gender,
        selectedOptions: this.selectedOptions,
        birthday: this.birthday
      });
      this.sendDataToBackend();
    },
    methods: {
      navigateToTest1() {
        const testPageUrl = `/pages/test/test1?firstScene=true&jobId=${this.jobId}&userId=${this.userId}&username=${encodeURIComponent(this.username)}&gender=${this.gender}&birthday=${encodeURIComponent(JSON.stringify(this.birthday))}&options=${encodeURIComponent(JSON.stringify(this.selectedOptions))}&background=${this.background}`;
        uni.navigateTo({
          url: testPageUrl
        });
      },
      sendDataToBackend() {
        uni.request({
          url: "https://eqmaster.azurewebsites.net/create_profile",
          // 替换为您的后端服务地址
          method: "POST",
          data: {
            name: this.username,
            job_level: this.jobLevel || "",
            gender: this.gender,
            concerns: this.selectedOptions
          },
          success: (res) => {
            formatAppLog("log", "at pages/test/test.vue:88", "Backend response:", res.data);
            this.jobId = res.data.job_id;
            this.getScenarioData();
          },
          fail: (err) => {
            formatAppLog("error", "at pages/test/test.vue:95", "Error sending data to backend:", err);
          }
        });
      },
      getScenarioData() {
        uni.request({
          url: `https://eqmaster.azurewebsites.net/start_scenario/${this.jobId}`,
          // 替换为您的后端服务地址
          method: "POST",
          success: (res) => {
            try {
              const data = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
              formatAppLog("log", "at pages/test/test.vue:106", "Scenario data:", data);
              this.scenarioData = data.scenes || null;
              this.handleScenarioData();
            } catch (error) {
              formatAppLog("error", "at pages/test/test.vue:110", "Error parsing scenario data:", error);
              this.background = "获取场景数据时出错。";
            }
          },
          fail: (err) => {
            formatAppLog("error", "at pages/test/test.vue:115", "Error getting scenario data:", err);
            this.background = "无法获取场景数据。";
          }
        });
      },
      handleScenarioData() {
        if (this.scenarioData) {
          this.background = this.scenarioData.background || "请点击下方箭头继续";
        } else {
          this.background = "请点击下方箭头继续";
        }
      }
    }
  };
  function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("image", {
        class: "background-image",
        src: _imports_0$5,
        mode: "aspectFill"
      }),
      vue.createElementVNode("view", { class: "banner-container" }, [
        vue.createElementVNode("image", {
          class: "logo",
          src: _imports_1$2,
          mode: "aspectFit"
        }),
        vue.createElementVNode(
          "text",
          { class: "room-text" },
          vue.toDisplayString(this.scenarioData.location),
          1
          /* TEXT */
        )
      ]),
      vue.createElementVNode("view", { class: "text-box" }, [
        vue.createElementVNode(
          "text",
          { class: "text-content" },
          vue.toDisplayString($data.background),
          1
          /* TEXT */
        ),
        vue.createElementVNode("view", {
          class: "expand-icon",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.navigateToTest1 && $options.navigateToTest1(...args))
        }, [
          vue.createElementVNode("image", {
            class: "icon-image",
            src: _imports_2,
            mode: "aspectFit"
          })
        ])
      ])
    ]);
  }
  const PagesTestTest = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$a], ["__scopeId", "data-v-727d09f0"], ["__file", "/Users/peipeiwang/wppDev/eqmaster_/test/pages/test/test.vue"]]);
  const _imports_0$3 = "/static/jobicon.png";
  const _imports_1$1 = "/static/relationshipicon.png";
  const _imports_0$2 = "/static/arrowright.png";
  const _sfc_main$a = {
    data() {
      return {
        jobOptions: ["难以融入新环境", "棘手的同事关系", "与上级维持良好关系", "难回的消息", "尴尬的饭局等社交场合", "困难的工作沟通"],
        relationshipOptions: ["难以维持长期关系", "感情平淡期", "得不到回应的喜欢", "感情受到伤害"],
        selectedOptions: [],
        userId: "",
        username: "",
        gender: "",
        birthday: null
      };
    },
    onLoad(options) {
      this.userId = options.userId;
      this.username = decodeURIComponent(options.username);
      this.gender = options.gender;
      const defaultBirthday = {
        year: 2e3,
        month: 1,
        day: 1
      };
      if (options.birthday) {
        try {
          this.birthday = JSON.parse(decodeURIComponent(options.birthday));
        } catch (e) {
          formatAppLog("error", "at pages/preference/preference2.vue:70", "JSON 解析错误:", e);
          this.birthday = defaultBirthday;
        }
      } else {
        this.birthday = defaultBirthday;
      }
      formatAppLog("log", "at pages/preference/preference2.vue:76", "Received data:", {
        userId: this.userId,
        username: this.username,
        gender: this.gender,
        birthday: this.birthday
      });
    },
    methods: {
      toggleOption(option) {
        const index = this.selectedOptions.indexOf(option);
        if (index > -1) {
          this.selectedOptions.splice(index, 1);
        } else {
          this.selectedOptions.push(option);
        }
        formatAppLog("log", "at pages/preference/preference2.vue:91", "Selected options:", this.selectedOptions);
      },
      goToNextPage() {
        if (this.selectedOptions.length > 0) {
          const url = `/pages/preference/preference3?userId=${this.userId}&username=${encodeURIComponent(this.username)}&gender=${this.gender}&birthday=${encodeURIComponent(JSON.stringify(this.birthday))}&options=${encodeURIComponent(JSON.stringify(this.selectedOptions))}`;
          formatAppLog("log", "at pages/preference/preference2.vue:99", "Navigating to:", url);
          uni.navigateTo({
            url,
            fail: (err) => {
              formatAppLog("error", "at pages/preference/preference2.vue:103", "Navigation failed:", err);
              uni.showToast({
                title: "页面跳转失败",
                icon: "none"
              });
            }
          });
        } else {
          formatAppLog("log", "at pages/preference/preference2.vue:111", "No options selected");
          uni.showToast({
            title: "请至少选择一个选项",
            icon: "none"
          });
        }
      }
    }
  };
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("view", { class: "text-content" }, [
        vue.createElementVNode("text", { class: "question" }, "🤔 你希望提升哪些方面的高情商应对能力呢？"),
        vue.createCommentVNode(' <text class="question1">个性化偏好</text> ')
      ]),
      vue.createElementVNode("view", { class: "options-container" }, [
        vue.createElementVNode("view", { class: "option-group" }, [
          vue.createElementVNode("view", { class: "group-icon" }, [
            vue.createElementVNode("image", {
              class: "icon",
              src: _imports_0$3,
              mode: "scaleToFill"
            })
          ]),
          vue.createElementVNode("view", { class: "option-buttons" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.jobOptions, (option, index) => {
                return vue.openBlock(), vue.createElementBlock("button", {
                  key: index,
                  class: vue.normalizeClass(["option-button", `button-${index + 1}`, { active: $data.selectedOptions.includes(option) }]),
                  onClick: ($event) => $options.toggleOption(option)
                }, vue.toDisplayString(option), 11, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])
        ]),
        vue.createElementVNode("view", { class: "option-group" }, [
          vue.createElementVNode("view", { class: "group-icon" }, [
            vue.createElementVNode("image", {
              class: "icon",
              src: _imports_1$1,
              mode: "scaleToFill"
            })
          ]),
          vue.createElementVNode("view", { class: "option-buttons" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.relationshipOptions, (option, index) => {
                return vue.openBlock(), vue.createElementBlock("button", {
                  key: index,
                  class: vue.normalizeClass(["option-button", `button-${index + 1}`, { active: $data.selectedOptions.includes(option) }]),
                  onClick: ($event) => $options.toggleOption(option)
                }, vue.toDisplayString(option), 11, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])
        ])
      ]),
      vue.createElementVNode("view", { class: "button-container" }, [
        vue.createElementVNode("image", {
          class: "continue-button",
          src: _imports_0$2,
          mode: "aspectFit",
          onClick: _cache[0] || (_cache[0] = ($event) => $options.goToNextPage())
        })
      ])
    ]);
  }
  const PagesPreferencePreference2 = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$9], ["__scopeId", "data-v-50f1e56a"], ["__file", "/Users/peipeiwang/wppDev/eqmaster_/test/pages/preference/preference2.vue"]]);
  const _sfc_main$9 = {
    data() {
      const date = /* @__PURE__ */ new Date();
      const _years = [];
      const _year = date.getFullYear();
      const _months = [];
      const _month = date.getMonth() + 1;
      const _days = [];
      const _day = date.getDate();
      for (let i = 1950; i <= _year; i++) {
        _years.push(i);
      }
      for (let i = 1; i <= 12; i++) {
        _months.push(i);
      }
      for (let i = 1; i <= 31; i++) {
        _days.push(i);
      }
      return {
        title: "picker-view",
        years: _years,
        year: _year,
        months: _months,
        month: _month,
        days: _days,
        day: _day,
        value: [2e3, _month - 1, _day - 1],
        result: [],
        indicatorStyle: "height: 50px;",
        userId: "",
        username: "",
        gender: ""
      };
    },
    created() {
      formatAppLog("log", "at components/DatePicker.vue:61", "初始化月份:", this.months);
      formatAppLog("log", "at components/DatePicker.vue:62", "初始化日期:", this.days);
      formatAppLog("log", "at components/DatePicker.vue:63", "初始化年份:", this.years);
      this.$emit("dateChanged", {
        year: this.year,
        month: this.month,
        day: this.day
      });
    },
    methods: {
      bindChange(e) {
        const val = e.detail.value;
        this.result = val;
        this.year = this.years[val[0]];
        this.month = this.months[val[1]];
        this.day = this.days[val[2]];
        formatAppLog("log", "at components/DatePicker.vue:77", this.year, this.month, this.day);
        this.$emit("dateChanged", {
          year: this.year,
          month: this.month,
          day: this.day
        });
      }
    }
  };
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "date-picker-container" }, [
      vue.createElementVNode("view", { class: "mask top" }),
      vue.createElementVNode("picker-view", {
        class: "picker-view",
        "indicator-style": $data.indicatorStyle,
        value: $data.value,
        onChange: _cache[0] || (_cache[0] = (...args) => $options.bindChange && $options.bindChange(...args))
      }, [
        vue.createElementVNode("picker-view-column", { class: "picker-view-column" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.years, (item, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                class: "item",
                key: index
              }, [
                vue.createElementVNode(
                  "text",
                  { class: "text" },
                  vue.toDisplayString(item) + "年",
                  1
                  /* TEXT */
                )
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ]),
        vue.createElementVNode("picker-view-column", { class: "picker-view-column" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.months, (item, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                class: "item",
                key: index
              }, [
                vue.createElementVNode(
                  "text",
                  { class: "text" },
                  vue.toDisplayString(item) + "月",
                  1
                  /* TEXT */
                )
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ]),
        vue.createElementVNode("picker-view-column", { class: "picker-view-column" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.days, (item, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                class: "item",
                key: index
              }, [
                vue.createElementVNode(
                  "text",
                  { class: "text" },
                  vue.toDisplayString(item) + "日",
                  1
                  /* TEXT */
                )
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ], 40, ["indicator-style", "value"]),
      vue.createElementVNode("view", { class: "mask bottom" })
    ]);
  }
  const DatePicker = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$8], ["__scopeId", "data-v-9f4f5132"], ["__file", "/Users/peipeiwang/wppDev/eqmaster_/test/components/DatePicker.vue"]]);
  const _sfc_main$8 = {
    components: {
      DatePicker
    },
    data() {
      return {
        year: "",
        month: "",
        day: "",
        title: "picker-view",
        result: [],
        indicatorStyle: "height: 50px;",
        userId: "",
        username: "",
        gender: ""
      };
    },
    onLoad(options) {
      this.userId = options.userId;
      this.username = decodeURIComponent(options.username);
      this.gender = options.gender;
      formatAppLog("log", "at pages/preference/preference1.vue:46", "preference initiated.");
    },
    methods: {
      goToNextPage() {
        const selectedDate = {
          year: this.year,
          month: this.month,
          day: this.day
        };
        const nextPageUrl = `/pages/preference/preference2?userId=${this.userId}&username=${encodeURIComponent(this.username)}&gender=${this.gender}&birthday=${encodeURIComponent(JSON.stringify(selectedDate))}`;
        uni.navigateTo({
          url: nextPageUrl
        });
      },
      onDateChanged(newDate) {
        formatAppLog("log", "at pages/preference/preference1.vue:64", "接收到的日期:", newDate);
        this.year = newDate.year;
        this.month = newDate.month;
        this.day = newDate.day;
      }
    }
  };
  const _imports_0$1 = "/static/picture1.png";
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_date_picker = vue.resolveComponent("date-picker");
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createElementVNode("view", { class: "container" }, [
          vue.createElementVNode("image", {
            class: "background-image",
            src: _imports_0$1,
            mode: "widthFix"
          }),
          vue.createElementVNode("view", { class: "text-content" }, [
            vue.createElementVNode("text", { class: "question" }, "🎂 你的生日是什么时候？"),
            vue.createCommentVNode(' <text class="question1">完善个人信息</text> ')
          ]),
          vue.createElementVNode("view", { class: "date-picker-parent" }, [
            vue.createVNode(_component_date_picker, { onDateChanged: $options.onDateChanged }, null, 8, ["onDateChanged"]),
            vue.createTextVNode("> ")
          ])
        ]),
        vue.createElementVNode("view", { class: "button-container" }, [
          vue.createElementVNode("image", {
            class: "continue-button",
            src: _imports_0$2,
            mode: "aspectFit",
            onClick: _cache[0] || (_cache[0] = ($event) => $options.goToNextPage())
          })
        ])
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const PagesPreferencePreference1 = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$7], ["__file", "/Users/peipeiwang/wppDev/eqmaster_/test/pages/preference/preference1.vue"]]);
  const _sfc_main$7 = {
    data() {
      return {
        selectedGender: null,
        userId: "",
        username: "",
        backgroundImage: "/static/picture1.png",
        // 确保背景图片路径正确
        genderIcons: {
          female: {
            default: "/static/2.png",
            selected: "/static/2-selected.png"
          },
          male: {
            default: "/static/3.png",
            selected: "/static/3-selected.png"
          },
          other: {
            default: "/static/4.png",
            selected: "/static/4-selected.png"
          }
        }
      };
    },
    onLoad(options) {
      this.userId = options.userId;
      this.username = decodeURIComponent(options.username);
      formatAppLog("log", "at pages/preference/preference.vue:63", "User ID:", this.userId);
      formatAppLog("log", "at pages/preference/preference.vue:64", "Username:", this.username);
    },
    methods: {
      selectGender(gender) {
        this.selectedGender = gender;
      },
      nextStep() {
        if (this.selectedGender) {
          uni.setStorageSync("gender", this.selectedGender);
          uni.navigateTo({
            url: `/pages/preference/preference1?userId=${this.userId}&username=${encodeURIComponent(this.username)}&gender=${this.selectedGender}`
          });
        } else {
          uni.showToast({
            title: "请选择性别",
            icon: "none"
          });
        }
      }
    },
    computed: {
      femaleIcon() {
        return this.selectedGender === "female" ? this.genderIcons.female.selected : this.genderIcons.female.default;
      },
      maleIcon() {
        return this.selectedGender === "male" ? this.genderIcons.male.selected : this.genderIcons.male.default;
      },
      otherIcon() {
        return this.selectedGender === "other" ? this.genderIcons.other.selected : this.genderIcons.other.default;
      }
    }
  };
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createElementVNode("view", { class: "container" }, [
          vue.createElementVNode("image", {
            class: "background-image",
            src: $data.backgroundImage,
            mode: "widthFix"
          }, null, 8, ["src"]),
          vue.createElementVNode("view", { class: "text-content" }, [
            vue.createElementVNode("text", { class: "question" }, "你的性别是？"),
            vue.createCommentVNode(' <text class="question1">完善个人信息</text> ')
          ]),
          vue.createElementVNode("view", { class: "gender-options" }, [
            vue.createElementVNode("view", { class: "gender-option" }, [
              vue.createElementVNode("image", {
                class: "gender-icon",
                src: $options.femaleIcon,
                onClick: _cache[0] || (_cache[0] = ($event) => $options.selectGender("female"))
              }, null, 8, ["src"]),
              vue.createElementVNode("text", { class: "gender-label" }, "女生")
            ]),
            vue.createElementVNode("view", { class: "gender-option" }, [
              vue.createElementVNode("image", {
                class: "gender-icon",
                src: $options.maleIcon,
                onClick: _cache[1] || (_cache[1] = ($event) => $options.selectGender("male"))
              }, null, 8, ["src"]),
              vue.createElementVNode("text", { class: "gender-label" }, "男生")
            ]),
            vue.createElementVNode("view", { class: "gender-option" }, [
              vue.createElementVNode("image", {
                class: "gender-icon",
                src: $options.otherIcon,
                onClick: _cache[2] || (_cache[2] = ($event) => $options.selectGender("other"))
              }, null, 8, ["src"]),
              vue.createElementVNode("text", { class: "gender-label" }, "开放性别")
            ])
          ])
        ]),
        vue.createElementVNode("view", { class: "button-container" }, [
          vue.createElementVNode("image", {
            class: "continue-button",
            src: _imports_0$2,
            mode: "aspectFit",
            onClick: _cache[3] || (_cache[3] = (...args) => $options.nextStep && $options.nextStep(...args))
          })
        ])
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const PagesPreferencePreference = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$6], ["__scopeId", "data-v-7539d408"], ["__file", "/Users/peipeiwang/wppDev/eqmaster_/test/pages/preference/preference.vue"]]);
  const _sfc_main$6 = {
    data() {
      return {
        userInfoStyle: {
          bottom: "180px",
          left: "50%",
          marginLeft: "-65px"
          // 替换 transform
        },
        npcName: "小李",
        npcAvatar: "/static/npc1.png",
        userId: "",
        username: "",
        gender: "",
        selectedOptions: [],
        birthday: null,
        scenarioData: null,
        description: "",
        selectedOptionIndex: null,
        num: null,
        jobId: null,
        background: "",
        baseURL: "https://eqmaster.azurewebsites.net"
        // 请替换为您的实际后端地址
      };
    },
    onLoad(option) {
      this.userId = option.userId || "";
      this.username = decodeURIComponent(option.username || "");
      this.gender = option.gender || "";
      this.jobId = option.jobId || "";
      if (option.options) {
        try {
          this.selectedOptions = JSON.parse(decodeURIComponent(option.options));
        } catch (e) {
          formatAppLog("error", "at pages/test/test2.vue:58", "Error parsing options:", e);
          this.selectedOptions = [];
        }
      }
      if (option.birthday) {
        try {
          this.birthday = JSON.parse(decodeURIComponent(option.birthday));
        } catch (e) {
          formatAppLog("error", "at pages/test/test2.vue:67", "Error parsing birthday:", e);
          this.birthday = null;
        }
      }
      formatAppLog("log", "at pages/test/test2.vue:72", "Parsed data:", {
        userId: this.userId,
        username: this.username,
        gender: this.gender,
        selectedOptions: this.selectedOptions,
        birthday: this.birthday,
        jobId: this.jobId
      });
      this.getScenarioData();
    },
    methods: {
      updateUserInfoPosition(x, y) {
        this.userInfoStyle.left = `${x}px`;
        this.userInfoStyle.bottom = `${y}px`;
        this.userInfoStyle.marginLeft = "0px";
      },
      selectOption(index) {
        this.selectedOptionIndex = index;
        this.num = index + 1;
        formatAppLog("log", "at pages/test/test2.vue:93", "Selected option:", this.num, this.scenarioData.options[index].text);
        this.scenarioData.options.forEach((option, i) => {
          option.textColor = i === index ? "black" : "white";
        });
      },
      nextPage() {
        if (this.num === null) {
          uni.showToast({
            title: "请选择一个选项",
            icon: "none"
          });
          return;
        }
        formatAppLog("log", "at pages/test/test2.vue:109", "Sending data to backend:", {
          choice: this.num,
          job_id: this.jobId
        });
        uni.request({
          url: `${this.baseURL}/choose_scenario`,
          method: "POST",
          data: {
            choice: this.num,
            job_id: this.jobId
          },
          success: (response) => {
            formatAppLog("log", "at pages/test/test2.vue:122", "Full response:", response);
            if (response.statusCode === 200) {
              const result = response.data;
              formatAppLog("log", "at pages/test/test2.vue:126", "Response data:", result);
              let nextPageUrl;
              if (result.message === "Final choice made. Processing data in background.") {
                nextPageUrl = `/pages/result/loading?jobId=${this.jobId}&userId=${this.userId}&username=${encodeURIComponent(this.username)}&gender=${this.gender}&birthday=${encodeURIComponent(JSON.stringify(this.birthday))}&options=${encodeURIComponent(JSON.stringify(this.selectedOptions))}&num=${this.num}`;
              } else {
                nextPageUrl = `/pages/test/test3?jobId=${this.jobId}&userId=${this.userId}&username=${encodeURIComponent(this.username)}&gender=${this.gender}&birthday=${encodeURIComponent(JSON.stringify(this.birthday))}&options=${encodeURIComponent(JSON.stringify(this.selectedOptions))}&num=${this.num}`;
              }
              formatAppLog("log", "at pages/test/test2.vue:137", "Navigating to:", nextPageUrl);
              uni.navigateTo({
                url: nextPageUrl,
                fail: (err) => {
                  formatAppLog("error", "at pages/test/test2.vue:142", "Navigation failed:", err);
                  uni.showToast({
                    title: "页面跳转失败",
                    icon: "none"
                  });
                }
              });
            } else {
              uni.showToast({
                title: `请求失败，状态码：${response.statusCode}`,
                icon: "none"
              });
            }
          },
          fail: (error) => {
            formatAppLog("error", "at pages/test/test2.vue:157", "Detailed error:", error);
            uni.showToast({
              title: `发生错误：${error.errMsg}`,
              icon: "none"
            });
          }
        });
      },
      getScenarioData() {
        uni.request({
          url: `${this.baseURL}/get_current_scenario/${this.jobId}`,
          method: "POST",
          success: (res) => {
            formatAppLog("log", "at pages/test/test2.vue:170", "Scenario data:", res.data);
            this.scenarioData = res.data.scenes || res.data;
            this.handleScenarioData();
          },
          fail: (err) => {
            formatAppLog("error", "at pages/test/test2.vue:176", "Error getting scenario data:", err);
          }
        });
      },
      handleScenarioData() {
        if (this.scenarioData) {
          this.description = this.scenarioData.description || "无法获取背景信息";
        } else {
          formatAppLog("warn", "at pages/test/test2.vue:184", "Background information not found in scenario data");
          this.description = "无法获取背景信息";
        }
      }
    }
  };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("image", {
        class: "background-image",
        src: _imports_0$5,
        mode: "aspectFill"
      }),
      vue.createElementVNode("view", { class: "options-container" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.scenarioData && $data.scenarioData.options ? $data.scenarioData.options : [], (option, index) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              key: index,
              class: vue.normalizeClass(["text-box", { "selected": $data.selectedOptionIndex === index }]),
              onClick: ($event) => $options.selectOption(index)
            }, [
              vue.createElementVNode(
                "text",
                {
                  class: "text-content",
                  style: vue.normalizeStyle({ color: option.textColor || "white" })
                },
                vue.toDisplayString(option.text),
                5
                /* TEXT, STYLE */
              )
            ], 10, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ]),
      vue.createElementVNode("view", { class: "button-container" }, [
        vue.createElementVNode("view", {
          class: "continue-button",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.nextPage && $options.nextPage(...args))
        }, [
          vue.createElementVNode("text", { class: "arrow" }, "→")
        ])
      ])
    ]);
  }
  const PagesTestTest2 = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__scopeId", "data-v-51a7cd0a"], ["__file", "/Users/peipeiwang/wppDev/eqmaster_/test/pages/test/test2.vue"]]);
  const _sfc_main$5 = vue.defineComponent({
    data() {
      return {
        scenarioText: "",
        userId: "",
        username: "",
        gender: "",
        // 显式指定 `birthday` 的类型
        birthday: null,
        // 显式指定 `selectedOptions` 为字符串数组
        selectedOptions: []
      };
    },
    onLoad(options) {
      formatAppLog("log", "at pages/preference/preference3.vue:33", "Raw options received in preference3:", options);
      this.userId = options.userId || "";
      this.username = decodeURIComponent(options.username || "");
      this.gender = options.gender || "";
      formatAppLog("log", "at pages/preference/preference3.vue:39", "Parsed basic data in preference3:", {
        userId: this.userId,
        username: this.username,
        gender: this.gender
      });
      try {
        this.birthday = options.birthday ? JSON.parse(decodeURIComponent(options.birthday)) : null;
        formatAppLog("log", "at pages/preference/preference3.vue:48", "Parsed birthday in preference3:", this.birthday);
      } catch (e) {
        formatAppLog("error", "at pages/preference/preference3.vue:50", "Error parsing birthday in preference3:", e);
        formatAppLog("log", "at pages/preference/preference3.vue:51", "Raw birthday data in preference3:", options.birthday);
        this.birthday = null;
      }
      try {
        const parsedOptions = options.options ? JSON.parse(decodeURIComponent(options.options)) : [];
        formatAppLog("log", "at pages/preference/preference3.vue:58", "Parsed options:", parsedOptions);
        this.selectedOptions = Array.isArray(parsedOptions) ? parsedOptions : [];
        formatAppLog("log", "at pages/preference/preference3.vue:63", "Assigned selectedOptions:", this.selectedOptions);
        formatAppLog("log", "at pages/preference/preference3.vue:64", "selectedOptions length:", this.selectedOptions.length);
        formatAppLog("log", "at pages/preference/preference3.vue:65", "selectedOptions contents:", JSON.stringify(this.selectedOptions));
      } catch (e) {
        formatAppLog("error", "at pages/preference/preference3.vue:67", "Error parsing selectedOptions in preference3:", e);
        formatAppLog("log", "at pages/preference/preference3.vue:68", "Raw options data in preference3:", options.options);
        this.selectedOptions = [];
      }
      if (!this.userId || !this.username || !this.gender || !this.birthday || this.selectedOptions.length === 0) {
        formatAppLog("error", "at pages/preference/preference3.vue:82", "Some required data is missing or invalid in preference3");
      }
    },
    methods: {
      startTest() {
        formatAppLog("log", "at pages/preference/preference3.vue:87", "Start test button clicked");
        this.navigateToNextPage();
      },
      navigateToNextPage() {
        const testPageUrl = `/pages/test/test?userId=${this.userId}&username=${encodeURIComponent(this.username)}&gender=${this.gender}&birthday=${encodeURIComponent(JSON.stringify(this.birthday))}&options=${encodeURIComponent(JSON.stringify(this.selectedOptions))}`;
        formatAppLog("log", "at pages/preference/preference3.vue:93", "Navigating to:", testPageUrl);
        uni.navigateTo({
          url: testPageUrl,
          success: () => {
            formatAppLog("log", "at pages/preference/preference3.vue:98", "Navigation to test page successful");
          },
          fail: (err) => {
            formatAppLog("error", "at pages/preference/preference3.vue:101", "Navigation to test page failed:", err);
            uni.showToast({
              title: "页面跳转失败",
              icon: "none"
            });
          }
        });
      }
    }
  });
  const _imports_0 = "/static/Group 3.png";
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("view", { class: "text-content" }, [
        vue.createElementVNode(
          "text",
          { class: "question" },
          vue.toDisplayString(_ctx.scenarioText || "让我们看看你现在适合什么情商段位"),
          1
          /* TEXT */
        ),
        vue.createCommentVNode(' <text class="question1">个性化偏好</text> ')
      ]),
      vue.createElementVNode("view", { class: "card" }, [
        vue.createElementVNode("image", {
          class: "card-image",
          src: _imports_0,
          mode: "aspectFit"
        }),
        vue.createElementVNode("button", {
          class: "start-button",
          onClick: _cache[0] || (_cache[0] = (...args) => _ctx.startTest && _ctx.startTest(...args))
        }, [
          vue.createElementVNode("text", { class: "arrow" }, "开始测试 ↗")
        ])
      ])
    ]);
  }
  const PagesPreferencePreference3 = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__scopeId", "data-v-95eb0c6e"], ["__file", "/Users/peipeiwang/wppDev/eqmaster_/test/pages/preference/preference3.vue"]]);
  const _sfc_main$4 = {
    data() {
      return {
        userInfoStyle: {
          bottom: "180px",
          left: "50%",
          marginLeft: "-65px"
          // 替换 transform
        },
        userId: "",
        username: "",
        gender: "",
        selectedOptions: [],
        birthday: null,
        scenarioData: null,
        background: "",
        jobId: "",
        roundCount: 0,
        num: null,
        baseURL: "https://eqmaster.azurewebsites.net"
        // 请替换为您的实际后端地址
      };
    },
    onLoad(option) {
      formatAppLog("log", "at pages/test/test3.vue:43", "Received options:", option);
      this.userId = option.userId || "";
      this.username = decodeURIComponent(option.username || "");
      this.gender = option.gender || "";
      this.jobId = option.jobId || "";
      if (option.options) {
        try {
          this.selectedOptions = JSON.parse(decodeURIComponent(option.options));
        } catch (e) {
          formatAppLog("error", "at pages/test/test3.vue:55", "Error parsing options:", e);
          this.selectedOptions = [];
        }
      }
      if (option.birthday) {
        try {
          this.birthday = JSON.parse(decodeURIComponent(option.birthday));
        } catch (e) {
          formatAppLog("error", "at pages/test/test3.vue:64", "Error parsing birthday:", e);
          this.birthday = null;
        }
      }
      if (option.roundCount) {
        this.roundCount = parseInt(option.roundCount, 10);
      }
      if (option.num) {
        this.num = parseInt(option.num, 10);
      }
      formatAppLog("log", "at pages/test/test3.vue:77", "Parsed data:", {
        userId: this.userId,
        username: this.username,
        gender: this.gender,
        selectedOptions: this.selectedOptions,
        birthday: this.birthday,
        roundCount: this.roundCount,
        num: this.num,
        jobId: this.jobId
      });
      this.getScenarioData();
    },
    methods: {
      navigateToTest1() {
        const testPageUrl = `/pages/test/test1?background=${this.background}&jobId=${this.jobId}&userId=${this.userId}&username=${encodeURIComponent(this.username)}&gender=${this.gender}&birthday=${encodeURIComponent(JSON.stringify(this.birthday))}&options=${encodeURIComponent(JSON.stringify(this.selectedOptions))}&roundCount=${this.roundCount}&num=${this.num}`;
        uni.navigateTo({
          url: testPageUrl
        });
      },
      getScenarioData() {
        uni.request({
          url: `${this.baseURL}/get_current_scenario/${this.jobId}`,
          method: "POST",
          success: (res) => {
            formatAppLog("log", "at pages/test/test3.vue:105", "Scenario data:", res.data);
            this.scenarioData = res.data;
            this.handleScenarioData();
          },
          fail: (err) => {
            formatAppLog("error", "at pages/test/test3.vue:111", "Error getting scenario data:", err);
          }
        });
      },
      handleScenarioData() {
        if (this.scenarioData) {
          this.background = this.scenarioData.scenes.background || "请点击下方箭头继续";
        } else {
          this.background = "请点击下方箭头继续";
        }
      }
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("image", {
        class: "background-image",
        src: _imports_0$5,
        mode: "aspectFill"
      }),
      vue.createElementVNode("view", { class: "banner-container" }, [
        vue.createElementVNode("image", {
          class: "logo",
          src: _imports_1$2,
          mode: "aspectFit"
        }),
        vue.createElementVNode(
          "text",
          { class: "room-text" },
          vue.toDisplayString(this.scenarioData.location),
          1
          /* TEXT */
        )
      ]),
      vue.createElementVNode("view", { class: "text-box" }, [
        vue.createElementVNode(
          "text",
          { class: "text-content" },
          vue.toDisplayString($data.background),
          1
          /* TEXT */
        ),
        vue.createElementVNode("view", {
          class: "expand-icon",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.navigateToTest1 && $options.navigateToTest1(...args)),
          style: { "margin-left": "auto" }
        }, [
          vue.createElementVNode("image", {
            class: "icon-image",
            src: _imports_2,
            mode: "aspectFit"
          })
        ])
      ])
    ]);
  }
  const PagesTestTest3 = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__scopeId", "data-v-a9c4f038"], ["__file", "/Users/peipeiwang/wppDev/eqmaster_/test/pages/test/test3.vue"]]);
  const _imports_1 = "/static/renew.png";
  const _imports_3 = "/static/edit.png";
  const _imports_4 = "/static/lock.png";
  const _imports_5 = "/static/dashboard/trick-fake.png";
  const _imports_6 = "/static/Placeholder.png";
  const _sfc_main$3 = {
    data() {
      return {
        name: "",
        jobId: "",
        relation: "",
        tags: [],
        contactId: "",
        score: 28,
        // 示例分数，可根据需要动态更改
        maxScore: 100,
        // 假设最大分数为100
        userId: "",
        username: "",
        gender: "",
        birthday: null,
        selectedOptions: [],
        num: null,
        homepageData: {
          response: {
            personal_info: {
              name: "",
              tag: "",
              tag_description: "",
              job_id: ""
            },
            eq_scores: {
              score: 0,
              dimension1_score: 0,
              dimension1_detail: "",
              dimension2_score: 0,
              dimension2_detail: "",
              dimension3_score: 0,
              dimension3_detail: "",
              dimension4_score: 0,
              dimension4_detail: "",
              dimension5_score: 0,
              dimension5_detail: "",
              summary: "",
              detail: "",
              overall_suggestion: "",
              detail_summary: ""
            },
            contacts: []
          }
        },
        intervalId: null,
        showSplash: false,
        // 默认不显示闪屏
        progress: 0,
        progressInterval: null,
        isExpanded: false,
        // 默认收起状态
        showPopup: false,
        // 将初始值设为 false，使弹窗在页面加载时不显示
        selectedOption: "同事",
        // 默认选择“同事”
        // 添同类型的标签列表
        colleagueTags: ["摸鱼高手", "潜力股", "马屁精", "靠谱伙伴"],
        bossSubordinateTags: ["完美主义者", "PUA大师", "加班狂魔", "甩锅侠", "独裁者"],
        selectedTags: [],
        isProfileComplete: false,
        // New data property to track profile completion
        profileName: "",
        // New data property for profile name
        cards: {
          intimacy: {
            unlocked: false,
            score: 0,
            description: ""
          },
          opinion: {
            unlocked: false,
            description: ""
          }
          // Add similar objects for other cards
        },
        personalName: "",
        editName: "",
        editRelation: "",
        editTags: [],
        currentView: ""
        // 初始化 currentView
      };
    },
    computed: {
      formattedBirthday() {
        if (this.birthday) {
          const date = new Date(this.birthday.year, this.birthday.month - 1, this.birthday.day);
          return date.toLocaleDateString();
        }
        return "未设置";
      },
      currentMonth() {
        const options = { month: "long" };
        return new Intl.DateTimeFormat("zh-CN", options).format(/* @__PURE__ */ new Date());
      },
      currentDate() {
        return (/* @__PURE__ */ new Date()).getDate();
      },
      currentTags() {
        if (this.editRelation === "同事") {
          return this.colleagueTags;
        } else if (this.editRelation === "老板" || this.editRelation === "下属") {
          return this.bossSubordinateTags;
        } else {
          return [];
        }
      },
      canConfirmEdit() {
        return this.editName.trim() !== "" && this.editTags.length > 0;
      }
    },
    onLoad(option) {
      formatAppLog("log", "at pages/profile/profile.vue:267", "Received options:", option);
      this.userId = option.userId || "";
      this.username = decodeURIComponent(option.username || "");
      this.gender = option.gender || "";
      this.jobId = option.jobId || "";
      this.num = option.num || "";
      this.personalName = decodeURIComponent(option.personal_name || "");
      this.name = decodeURIComponent(option.name || "");
      this.relation = decodeURIComponent(option.relation || "");
      this.contactId = option.contactId || "";
      if (option.tags) {
        try {
          this.tags = JSON.parse(decodeURIComponent(option.tags));
        } catch (e) {
          formatAppLog("error", "at pages/profile/profile.vue:289", "Error parsing tags:", e);
          this.tags = [];
        }
      }
      formatAppLog("log", "at pages/profile/profile.vue:296", "Parsed data:", {
        userId: this.userId,
        username: this.username,
        gender: this.gender,
        jobId: this.jobId,
        num: this.num,
        personalName: this.personalName,
        name: this.name,
        relation: this.relation,
        tags: this.tags,
        contactId: this.contactId
      });
      this.loadContactDetails();
      this.intervalId = setInterval(() => {
        this.loadContactDetails();
      }, 5e4);
    },
    onUnload() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
      if (this.progressInterval) {
        clearInterval(this.progressInterval);
      }
    },
    methods: {
      progressWidth(value) {
        const percentage = value / this.maxScore * 100;
        return `${percentage}%`;
      },
      circleLeftPosition(value) {
        const percentage1 = value / this.maxScore * 100;
        const progressBarWidth = uni.getSystemInfoSync().windowWidth * 0.8;
        formatAppLog("log", "at pages/profile/profile.vue:341", percentage1);
        return percentage1 / 100 * progressBarWidth;
      },
      navigateToGuide() {
        uni.navigateTo({
          url: `/pages/dashboard/dashboard?userId=${this.userId}&username=${encodeURIComponent(this.username)}&jobId=${this.jobId}`
          // 添加查询参数
        });
      },
      loadContactDetails() {
        const that = this;
        if (!this.contactId) {
          formatAppLog("error", "at pages/profile/profile.vue:353", "Contact ID is missing or invalid");
          return;
        }
        const url = `https://eqmaster.azurewebsites.net/get_contact_profile/${this.contactId}`;
        uni.request({
          url,
          method: "GET",
          success(response) {
            if (response.statusCode === 200) {
              that.contactDetails = response.data;
              formatAppLog("log", "at pages/profile/profile.vue:366", "Homepage data received:", that.contactDetails);
              that.$nextTick(() => {
                that.drawRadar();
              });
            } else {
              formatAppLog("error", "at pages/profile/profile.vue:371", "Failed to fetch data:", response.statusCode, response.data);
            }
          },
          fail(error) {
            formatAppLog("error", "at pages/profile/profile.vue:375", "Error fetching homepage data:", error);
          }
        });
      },
      expand() {
        this.isExpanded = true;
      },
      openPopup() {
        this.editName = this.name;
        this.editRelation = this.relation;
        this.editTags = [...this.tags];
        this.showPopup = true;
      },
      closePopup() {
        this.showPopup = false;
      },
      selectOption(option) {
        this.editRelation = option;
      },
      toggleTag(tag) {
        const index = this.editTags.indexOf(tag);
        if (index > -1) {
          this.editTags.splice(index, 1);
        } else {
          this.editTags.push(tag);
        }
      },
      confirmEdit() {
        if (this.canConfirmEdit) {
          this.name = this.editName;
          this.relation = this.editRelation;
          this.tags = [...this.editTags];
          this.closePopup();
        }
      },
      toProfilePage() {
        if (this.canConfirmEdit) {
          uni.navigateTo({
            url: `/pages/profile/profile?name=${encodeURIComponent(this.profileName)}&jobId=${this.jobId}&relation=${encodeURIComponent(this.selectedOption)}&tags=${encodeURIComponent(JSON.stringify(this.selectedTags))}`
          });
        }
      },
      toHomePage() {
        if (this.canConfirmEdit) {
          uni.navigateTo({
            url: `/pages/dashboard/dashboard`
          });
        }
      },
      // Add new method to handle navigation
      goToDashboard() {
        this.currentView = "dashboard";
        uni.navigateTo({
          url: `/pages/dashboard/dashboard?personalName=${encodeURIComponent(this.personalName)}&jobId=${this.jobId}&currentView=${this.currentView}`
        });
      },
      unlockCard(cardType) {
        if (!this.cards[cardType].unlocked) {
          this.cards[cardType].unlocked = true;
          if (cardType === "opinion") {
            this.cards[cardType].description = "这是TA对你的看法。";
          } else {
            this.cards[cardType].score = Math.floor(Math.random() * 100);
            this.cards[cardType].description = "这是解锁后的描述文字。";
          }
        }
      },
      chooseImage() {
        uni.chooseImage({
          count: 1,
          // 默认9
          sizeType: ["original", "compressed"],
          // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ["album", "camera"],
          // 可以指定来源是相册还是相机，默认二者都有
          success: (res) => {
            const tempFilePaths = res.tempFilePaths;
            formatAppLog("log", "at pages/profile/profile.vue:455", tempFilePaths);
            this.uploadImage(tempFilePaths[0]);
          }
        });
      },
      uploadImage(filePath) {
        uni.uploadFile({
          url: "https://eqmaster.azurewebsites.net/upload_image",
          // 替换为你的上传接口
          filePath,
          name: "file",
          success: (uploadFileRes) => {
            formatAppLog("log", "at pages/profile/profile.vue:468", uploadFileRes.data);
          },
          fail: (error) => {
            formatAppLog("error", "at pages/profile/profile.vue:472", "Upload failed", error);
          }
        });
      }
    },
    mounted() {
    },
    beforeDestroy() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
      if (this.progressInterval) {
        clearInterval(this.progressInterval);
      }
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("scroll-view", {
        "scroll-y": "",
        style: { "height": "100%" }
      }, [
        vue.createElementVNode("view", { class: "content" }, [
          vue.createElementVNode("image", {
            class: "iconback",
            src: _imports_0$6,
            mode: "widthFix",
            onClick: _cache[0] || (_cache[0] = (...args) => $options.goToDashboard && $options.goToDashboard(...args))
          }),
          vue.createElementVNode("image", {
            class: "iconrenew",
            src: _imports_1,
            mode: "widthFix"
          }),
          vue.createCommentVNode(' <view class="debug-info"> '),
          vue.createCommentVNode(" 显示从上一个页面接收到的数据  这个是修改信息的功能，能不能点开的时候，弹出来的窗口和外面的是一致的"),
          vue.createCommentVNode(" <text>this.contactDetails：{{ this.contactDetails }}</text> "),
          vue.createCommentVNode(" <text>personalName: {{ personalName }}</text> "),
          vue.createCommentVNode(" <text>profileName: {{ name }}</text> "),
          vue.createCommentVNode(" <text>name: {{ name }}</text> "),
          vue.createCommentVNode(" <text>relation: {{ relation }}</text> "),
          vue.createCommentVNode(" <text>tags: {{ JSON.stringify(tags) }}</text> "),
          vue.createCommentVNode(" <text>contactId: {{ contactId }}</text> "),
          vue.createCommentVNode(" </view> "),
          vue.createCommentVNode(" 添加白色卡片1 "),
          vue.createElementVNode("view", { class: "card-a" }, [
            vue.createElementVNode("image", {
              class: "illustrationhead",
              src: _imports_2$4,
              mode: "widthFix"
            }),
            vue.createElementVNode("view", { class: "card1inner" }, [
              vue.createElementVNode("view", { class: "card2inner" }, [
                vue.createElementVNode(
                  "text",
                  { class: "usercard-title1" },
                  vue.toDisplayString($data.name),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("image", {
                  class: "editillustration",
                  src: _imports_3,
                  mode: "widthFix",
                  onClick: _cache[1] || (_cache[1] = (...args) => $options.openPopup && $options.openPopup(...args))
                })
              ]),
              vue.createElementVNode("view", { class: "popup-tags-outside" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($data.tags, (tag) => {
                    return vue.openBlock(), vue.createElementBlock(
                      "text",
                      {
                        key: tag,
                        class: "popup-tag-outside"
                      },
                      vue.toDisplayString(tag),
                      1
                      /* TEXT */
                    );
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])
            ])
          ]),
          vue.createElementVNode("text", { class: "card-title1" }, "关系解码器"),
          vue.createElementVNode("text", { class: "card-title15" }, "一起分析聊天记录"),
          vue.createCommentVNode(' 		<view class="card-container">\n		  <view class="card-b">\n			<text class="card-titleaa">基础</text>\n			<text class="card-titleab">亲密指数</text>\n			<image class="illustrationlock" src="/static/lock.png" mode="widthFix"></image>\n		  </view>\n		  <view class="card-b">\n			<text class="card-titleaa">基础</text>\n			<text class="card-titleab">亲密指数</text>\n			<image class="illustrationlock" src="/static/lock.png" mode="widthFix"></image>\n		  </view>\n		  <view class="card-b">\n			<text class="card-titleaa">基础</text>\n			<text class="card-titleab">亲密指数</text>\n			<image class="illustrationlock" src="/static/lock.png" mode="widthFix"></image>\n		  </view>\n		</view> '),
          vue.createElementVNode("view", { class: "small-card-container" }, [
            vue.createElementVNode("scroll-view", {
              "scroll-x": "",
              style: { "width": "100%" }
            }, [
              vue.createCommentVNode(" New wrapper to arrange cards horizontally "),
              vue.createElementVNode("view", { class: "card-wrapper" }, [
                vue.createElementVNode("view", {
                  class: "card-b",
                  onClick: _cache[2] || (_cache[2] = ($event) => $options.unlockCard("intimacy"))
                }, [
                  vue.createElementVNode("text", { class: "card-titleaa" }, "基础"),
                  vue.createElementVNode("text", { class: "card-titleab" }, "亲密指数"),
                  !$data.cards.intimacy.unlocked ? (vue.openBlock(), vue.createElementBlock("image", {
                    key: 0,
                    class: "illustrationlock",
                    src: _imports_4,
                    mode: "widthFix"
                  })) : (vue.openBlock(), vue.createElementBlock("view", {
                    key: 1,
                    class: "unlocked-content"
                  }, [
                    vue.createElementVNode(
                      "text",
                      { class: "card-score" },
                      vue.toDisplayString($data.cards.intimacy.score),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "card-description" },
                      vue.toDisplayString(this.contactDetails.message),
                      1
                      /* TEXT */
                    )
                  ]))
                ]),
                vue.createElementVNode("view", {
                  class: "card-b1",
                  onClick: _cache[3] || (_cache[3] = ($event) => $options.unlockCard("opinion"))
                }, [
                  vue.createElementVNode("text", { class: "card-titleaa" }, "基础"),
                  vue.createElementVNode("text", { class: "card-titleab" }, "TA对你的看法"),
                  !$data.cards.opinion.unlocked ? (vue.openBlock(), vue.createElementBlock("image", {
                    key: 0,
                    class: "illustrationlock",
                    src: _imports_4,
                    mode: "widthFix"
                  })) : (vue.openBlock(), vue.createElementBlock("view", {
                    key: 1,
                    class: "unlocked-content"
                  }, [
                    vue.createElementVNode(
                      "text",
                      { class: "card-description" },
                      vue.toDisplayString(this.contactDetails.message),
                      1
                      /* TEXT */
                    )
                  ]))
                ]),
                vue.createElementVNode("view", { class: "card-b2" }, [
                  vue.createElementVNode("text", { class: "card-titleaa" }, "基础"),
                  vue.createElementVNode("text", { class: "card-titleab" }, "PUA鉴别"),
                  vue.createElementVNode("image", {
                    class: "illustrationlock",
                    src: _imports_4,
                    mode: "widthFix"
                  })
                ])
              ])
            ])
          ]),
          vue.createElementVNode("text", { class: "card-title1" }, "妙计囊"),
          vue.createElementVNode("text", { class: "card-title15" }, "根据关系巧妙建议，祝你应对职场难题"),
          vue.createElementVNode("image", {
            class: "illustration32",
            src: _imports_5,
            mode: "widthFix"
          }),
          vue.createElementVNode("view", {
            class: "upload-button",
            onClick: _cache[4] || (_cache[4] = (...args) => $options.chooseImage && $options.chooseImage(...args))
          }, [
            vue.createElementVNode("image", {
              class: "uploadillustration",
              src: _imports_6,
              mode: "widthFix"
            }),
            vue.createElementVNode("text", { class: "upload-title" }, "上传")
          ]),
          vue.createElementVNode("text", { class: "card-title16" }, "更多聊天截图有助于获取更准确的分析"),
          $data.showPopup ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "popup-overlay"
          }, [
            vue.createElementVNode("view", {
              class: "popup-content",
              onClick: _cache[11] || (_cache[11] = vue.withModifiers(() => {
              }, ["stop"]))
            }, [
              vue.createElementVNode("view", { class: "popup-header" }, [
                vue.createElementVNode("text", { class: "popup-title" }, "编辑人脉档案"),
                vue.createElementVNode("text", { class: "popup-question" }, "先给TA起个昵称吧！"),
                vue.createElementVNode("text", {
                  class: "popup-close",
                  onClick: _cache[5] || (_cache[5] = (...args) => $options.closePopup && $options.closePopup(...args))
                }, "×")
              ]),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "popup-input",
                  "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $data.editName = $event),
                  placeholder: "请输入名字"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.editName]
              ]),
              vue.createElementVNode("view", { class: "popup-section" }, [
                vue.createElementVNode("text", { class: "popup-question" }, "TA是你的？")
              ]),
              vue.createElementVNode("view", { class: "popup-options" }, [
                vue.createElementVNode(
                  "text",
                  {
                    class: vue.normalizeClass(["popup-option", { active: $data.editRelation === "同事" }]),
                    onClick: _cache[7] || (_cache[7] = ($event) => $options.selectOption("同事"))
                  },
                  "同事",
                  2
                  /* CLASS */
                ),
                vue.createElementVNode(
                  "text",
                  {
                    class: vue.normalizeClass(["popup-option1", { active: $data.editRelation === "老板" }]),
                    onClick: _cache[8] || (_cache[8] = ($event) => $options.selectOption("老板"))
                  },
                  "老板",
                  2
                  /* CLASS */
                ),
                vue.createElementVNode(
                  "text",
                  {
                    class: vue.normalizeClass(["popup-option2", { active: $data.editRelation === "下属" }]),
                    onClick: _cache[9] || (_cache[9] = ($event) => $options.selectOption("下属"))
                  },
                  "下属",
                  2
                  /* CLASS */
                )
              ]),
              vue.createElementVNode("view", { class: "popup-section" }, [
                vue.createElementVNode("text", { class: "popup-question" }, "哪些标签可以用来形容TA？")
              ]),
              vue.createElementVNode("view", { class: "popup-tags" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($options.currentTags, (tag) => {
                    return vue.openBlock(), vue.createElementBlock("text", {
                      key: tag,
                      class: vue.normalizeClass(["popup-tag", { active: $data.editTags.includes(tag) }]),
                      onClick: ($event) => $options.toggleTag(tag)
                    }, vue.toDisplayString(tag), 11, ["onClick"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ]),
              vue.createElementVNode(
                "button",
                {
                  class: "popup-button",
                  onClick: _cache[10] || (_cache[10] = (...args) => $options.confirmEdit && $options.confirmEdit(...args)),
                  style: vue.normalizeStyle({ opacity: $options.canConfirmEdit ? 1 : 0.5 })
                },
                " 确认更改 ",
                4
                /* STYLE */
              )
            ])
          ])) : vue.createCommentVNode("v-if", true),
          vue.createCommentVNode(" 添加色卡片2 ")
        ])
      ])
    ]);
  }
  const PagesProfileProfile = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__scopeId", "data-v-dd383ca2"], ["__file", "/Users/peipeiwang/wppDev/eqmaster_/test/pages/profile/profile.vue"]]);
  const _sfc_main$2 = {
    data() {
      return {
        username: "",
        password: ""
      };
    },
    methods: {
      login() {
        uni.request({
          url: "http://localhost:8000/login",
          // 你的 FastAPI 后端的地址
          method: "POST",
          data: {
            username: this.username,
            password: this.password
          },
          success: (res) => {
            if (res.statusCode === 200) {
              uni.showToast({
                title: res.data.message,
                icon: "success"
              });
              uni.navigateTo({
                url: `/pages/experience/experience?username=${this.username}`
              });
            } else {
              uni.showToast({
                title: res.data.detail,
                icon: "none"
              });
            }
          },
          fail: () => {
            uni.showToast({
              title: "请求失败",
              icon: "none"
            });
          }
        });
      }
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("view", { class: "login-box" }, [
        vue.createElementVNode("text", { class: "title" }, "登录"),
        vue.withDirectives(vue.createElementVNode(
          "input",
          {
            class: "input",
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.username = $event),
            placeholder: "请输入账号"
          },
          null,
          512
          /* NEED_PATCH */
        ), [
          [vue.vModelText, $data.username]
        ]),
        vue.withDirectives(vue.createElementVNode(
          "input",
          {
            class: "input",
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.password = $event),
            placeholder: "请输入密码",
            password: ""
          },
          null,
          512
          /* NEED_PATCH */
        ), [
          [vue.vModelText, $data.password]
        ]),
        vue.createElementVNode("button", {
          class: "button",
          onClick: _cache[2] || (_cache[2] = (...args) => $options.login && $options.login(...args))
        }, "登录")
      ])
    ]);
  }
  const PagesLoginLogin = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__scopeId", "data-v-e4e4508d"], ["__file", "/Users/peipeiwang/wppDev/eqmaster_/test/pages/login/login.vue"]]);
  const _sfc_main$1 = {
    data() {
      return {
        username: "",
        backgroundImage: "/static/picture1.png"
        // 确保背景图片路径正确
      };
    },
    methods: {
      nextStep() {
        if (this.username.trim()) {
          const userId = "fixedUserId12345";
          uni.setStorageSync("username", this.username);
          uni.setStorageSync("userId", userId);
          uni.navigateTo({
            url: `/pages/preference/preference?userId=${userId}&username=${encodeURIComponent(this.username)}`
          });
        } else {
          uni.showToast({
            title: "请输入您的名字",
            icon: "none"
          });
        }
      }
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createCommentVNode(" 背景图片 "),
      vue.createElementVNode("image", {
        class: "background-image",
        src: $data.backgroundImage,
        mode: "widthFix"
      }, null, 8, ["src"]),
      vue.createCommentVNode(' <image class="illustration1" src="/static/img1.png" mode="widthFix"></image> '),
      vue.createCommentVNode(" 内容区域 "),
      vue.createElementVNode("view", { class: "content" }, [
        vue.createElementVNode("view", { class: "text-content" }, [
          vue.createElementVNode("text", { class: "greeting" }, "嗨👋")
        ]),
        vue.createElementVNode("text", { class: "question" }, "很开心见到你！你叫什么名字？"),
        vue.createElementVNode("text", { class: "question1" }, "完善个人信息"),
        vue.createCommentVNode(" 输入框 "),
        vue.withDirectives(vue.createElementVNode(
          "input",
          {
            class: "name-input",
            placeholder: "请输入",
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.username = $event)
          },
          null,
          512
          /* NEED_PATCH */
        ), [
          [vue.vModelText, $data.username]
        ]),
        vue.createCommentVNode(" 继续按钮 "),
        vue.createElementVNode("view", { class: "button-container" }, [
          vue.createElementVNode("image", {
            class: "continue-button",
            src: _imports_0$2,
            mode: "aspectFit",
            onClick: _cache[1] || (_cache[1] = (...args) => $options.nextStep && $options.nextStep(...args))
          })
        ])
      ])
    ]);
  }
  const PagesExperienceExperience = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__scopeId", "data-v-5164d016"], ["__file", "/Users/peipeiwang/wppDev/eqmaster_/test/pages/experience/experience.vue"]]);
  __definePage("pages/landing/landing", PagesLandingLanding);
  __definePage("pages/battlefield/battlefield-loading", PagesBattlefieldBattlefieldLoading);
  __definePage("pages/battlefield/battlefield-summary", PagesBattlefieldBattlefieldSummary);
  __definePage("pages/battlefield/battlefield-task", PagesBattlefieldBattlefieldTask);
  __definePage("pages/dashboard/dashboard", PagesDashboardDashboard);
  __definePage("pages/battlefield/battlefield-playground", PagesBattlefieldBattlefieldPlayground);
  __definePage("pages/battlefield/battlefield-intro", PagesBattlefieldBattlefieldIntro);
  __definePage("pages/result/loading", PagesResultLoading);
  __definePage("pages/result/result", PagesResultResult);
  __definePage("pages/test/test5", PagesTestTest5);
  __definePage("pages/test/test1", PagesTestTest1);
  __definePage("pages/test/test", PagesTestTest);
  __definePage("pages/preference/preference2", PagesPreferencePreference2);
  __definePage("pages/preference/preference1", PagesPreferencePreference1);
  __definePage("pages/preference/preference", PagesPreferencePreference);
  __definePage("pages/test/test2", PagesTestTest2);
  __definePage("pages/preference/preference3", PagesPreferencePreference3);
  __definePage("pages/test/test3", PagesTestTest3);
  __definePage("pages/profile/profile", PagesProfileProfile);
  __definePage("pages/login/login", PagesLoginLogin);
  __definePage("pages/experience/experience", PagesExperienceExperience);
  __definePage("components/SProgressBar", ComponentsSProgressBar);
  const _sfc_main = {
    onLaunch: function() {
      formatAppLog("log", "at App.vue:5", "App Launch");
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:8", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:11", "App Hide");
    },
    onExit: function() {
      formatAppLog("log", "at App.vue:32", "App Exit");
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "/Users/peipeiwang/wppDev/eqmaster_/test/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);

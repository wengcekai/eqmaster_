(function (vue) {
	'use strict';

	const _sfc_main = vue.defineComponent({
	    onLaunch: function () {
	        uni.__log__('log', 'at App.uvue:5', 'App Launch');
	    },
	    onShow: function () {
	        uni.__log__('log', 'at App.uvue:8', 'App Show');
	    },
	    onHide: function () {
	        uni.__log__('log', 'at App.uvue:11', 'App Hide');
	    },
	    onExit: function () {
	        uni.__log__('log', 'at App.uvue:32', 'App Exit');
	    },
	});

	const _style_0 = {"uni-row":{"":{"flexDirection":"row"}},"uni-column":{"":{"flexDirection":"column"}}};

	const _export_sfc = (sfc, props) => {
	  const target = sfc.__vccOpts || sfc;
	  for (const [key, val] of props) {
	    target[key] = val;
	  }
	  return target;
	};

	const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["styles", [_style_0]], ["__file", "/Users/wengcekai/Downloads/EQMaster_ios/test2/App.uvue"]]);

	const __global__ = typeof globalThis === 'undefined' ? Function('return this')() : globalThis;
	__global__.__uniX = true;
	function createApp() {
	    const app = vue.createSSRApp(App);
	    return {
	        app
	    };
	}
	createApp().app.mount("#app");

})(Vue);
//# sourceMappingURL=../../../cache/.app-ios/sourcemap/app-service.js.map

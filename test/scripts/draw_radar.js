export function drawDemo(canvasId) {
	var context = uni.createCanvasContext(canvasId);
	context.setStrokeStyle("#00ff00")
	context.setLineWidth(5)
	context.rect(0, 0, 200, 200)
	context.stroke()
	context.setStrokeStyle("#ff0000")
	context.setLineWidth(2)
	context.moveTo(160, 100)
	context.arc(100, 100, 60, 0, 2 * Math.PI, true)
	context.moveTo(140, 100)
	context.arc(100, 100, 40, 0, Math.PI, false)
	context.moveTo(85, 80)
	context.arc(80, 80, 5, 0, 2 * Math.PI, true)
	context.moveTo(125, 80)
	context.arc(120, 80, 5, 0, 2 * Math.PI, true)
	context.stroke()
	context.draw()
}

export function drawRadar(canvasId, data) {
	console.log("started to draw radar chart");
	console.log('data', data);
	try {
		var ctx = uni.createCanvasContext(canvasId);
		ctx.width = 300
		ctx.height = 300
		const center = {
			x: ctx.width / 2,
			y: ctx.height / 2 + 40
		}; // 中心点
		const radius = Math.min(ctx.width, ctx.height) / 2 - 35; // 半径

		ctx.clearRect(0, 0, ctx.width, ctx.height);
		console.log('width:height', ctx.width, ctx.height);
		
		const numSides = data.length;
		const angleSlice = (Math.PI * 2) / numSides;
		const startAngle = -Math.PI / 2; // 确保第一个点从顶部开始

		// 绘制网格
		ctx.setStrokeStyle('#aaa8ac');
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

		// 绘制轴线
		for (let i = 0; i < numSides; i++) {
			const angle = startAngle + i * angleSlice;
			const x = center.x + radius * Math.cos(angle);
			const y = center.y + radius * Math.sin(angle);

			ctx.beginPath();
			ctx.moveTo(center.x, center.y);
			ctx.lineTo(x, y);
			ctx.stroke();
		}

		// 绘制数据区域
		ctx.beginPath();
		ctx.setFillStyle('rgba(164, 163, 171, 0.3)');
		ctx.setStrokeStyle('rgba(158, 228, 77, 0.8)');
		ctx.setLineWidth(4); // 设置绿线（数据区域）的粗细

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

		// 绘制数据点
		ctx.setFillStyle('rgba(158, 228, 77, 0.8)');
		for (let i = 0; i < numSides; i++) {
			const angle = startAngle + i * angleSlice;
			const value = data[i].A / data[i].fullMark;
			const x = center.x + radius * value * Math.cos(angle);
			const y = center.y + radius * value * Math.sin(angle);
			ctx.beginPath();
			ctx.arc(x, y, 3, 0, Math.PI * 2);
			ctx.fill();
		}

		// 绘制完成后调用 draw
		ctx.draw();
	} catch (e) {
		console.log(e)
	}
}
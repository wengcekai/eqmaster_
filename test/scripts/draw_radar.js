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
	console.log("Started to draw radar chart");
	console.log('Data:', data);
	
	try {
		const ctx = uni.createCanvasContext(canvasId);
		const width = 300;
		const height = 300;
		const center = {
			x: width / 2,
			y: height / 2
		};
		const radius = Math.min(width, height) / 2 - 35;

		ctx.clearRect(0, 0, width, height);
		
		const numSides = data.length;
		const angleSlice = (Math.PI * 2) / numSides;
		const startAngle = -Math.PI / 2;

		// Draw grid
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

		// Draw axes
		for (let i = 0; i < numSides; i++) {
			const angle = startAngle + i * angleSlice;
			const x = center.x + radius * Math.cos(angle);
			const y = center.y + radius * Math.sin(angle);

			ctx.beginPath();
			ctx.moveTo(center.x, center.y);
			ctx.lineTo(x, y);
			ctx.stroke();
		}

		// Draw data area
		ctx.beginPath();
		ctx.setFillStyle('rgba(164, 163, 171, 0.3)');
		ctx.setStrokeStyle('rgba(158, 228, 77, 0.8)');
		ctx.setLineWidth(2);

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

		// Draw data points
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

		// Draw labels
		ctx.setFillStyle('#333');
		ctx.setFontSize(12);
		ctx.setTextAlign('center');
		ctx.setTextBaseline('middle');
		for (let i = 0; i < numSides; i++) {
			const angle = startAngle + i * angleSlice;
			const x = center.x + (radius + 20) * Math.cos(angle);
			const y = center.y + (radius + 20) * Math.sin(angle);
			ctx.fillText(data[i].subject, x, y);
		}

		// Call draw to render the chart
		ctx.draw();
		console.log("Radar chart drawing completed");
	} catch (e) {
		console.error("Error drawing radar chart:", e);
	}
}

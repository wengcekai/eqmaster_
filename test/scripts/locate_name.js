export function findLastName(str) {
	const regex = /(小李|小王)(?!.*(小李|小王))/;
	const match = str.match(regex);

	return match ? match[0] : '老板';
}

export function getAvatar(name) {
	if (name == '小李') {
		return '/static/npc1.png'
	}
	if (name == '小王') {
		return '/static/npc2.png'
	}
	
	return '/static/npc3.png'
}

export function getBattlefieldAvatar(name) {
	if (name == "领导") {
		return "static/battlefield/boss.png";
	}
	if (name == "同事A") {
		return '/static/battlefield/xiaoA.png';
	}
	return "/static/battlefield/xiaoB.png";
}
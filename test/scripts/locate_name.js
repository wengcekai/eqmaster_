export function findLastName(str) {
	const regex = /(Sam|Anna)(?!.*(Sam|Anna))/;
	const match = str.match(regex);

	return match ? match[0] : 'Jason';
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
	if (name == "Jason") {
		return "/static/battlefield/boss11.png";
	}
	if (name == "Sam") {
		return '/static/battlefield/xiaoA1.png';
	}
	return "/static/battlefield/xiaoB1.png";
}
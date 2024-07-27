// interface FollowOptions {
// 	id: number;
// 	userFrom: number;
// 	userTo: number;
// }

export class Follow {
	id: number;
	userFrom: number;
	userTo: number;

	constructor(id: number, userFrom: number, userTo: number) {
		this.id = id;
		this.userFrom = userFrom;
		this.userTo = userTo;
	}
}

export class UsersFollow {
	id: number;
	userFrom: number;
	userTo: number;

	constructor(id: number, userFrom: number, userTo: number) {
		this.id = id;
		this.userFrom = userFrom;
		this.userTo = userTo;
	}
}

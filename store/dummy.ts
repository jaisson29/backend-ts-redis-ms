import { nanoid } from 'nanoid';

interface TableItem {
	id: string;
}

type Database = {
	[table: string]: unknown[];
};

const db: Database = {
	users: [{ id: '1', email: 'mikael.mayer@gmail.com' }],
	auth: [{ id: '1', username: 'jay', password: '12349' }],
};

export default class Store {
	async query<T extends TableItem>(table: keyof Database, query: Partial<T>) {
		const col = await this.list<T>(table);
		const keys = Object.keys(query) as (keyof T)[];
		const filtered = col?.filter((item: T) => keys.every((key) => item[key] === query[key]));
		return filtered ?? [];
	}

	async list<T extends TableItem>(table: keyof Database): Promise<T[]> {
		return (db[table] as T[]) ?? [];
	}
	async get<T extends TableItem>(table: keyof Database, id: string): Promise<T | null> {
		const items = db[table] as T[];
		return items.find((item: T) => item.id === id) ?? null;
	}
	async upsert<T extends TableItem>(table: keyof Database, data: T): Promise<T> {
		const items = await this.list(table);

		console.log(data);
		if (data.id) {
			const index = items.findIndex((item) => item.id === data.id);
			if (index !== -1) {
				items[index] = { ...items[index], ...data };
			} else {
				throw new Error('No se encontro ningun registro para actualizar');
			}
		} else {
			data.id = nanoid();
			items.push(data);
		}

		return data;
	}
	async remove<T extends TableItem>(table: keyof Database, id: string): Promise<string> {
		const items = db[table] as T[];
		items.filter((item: T) => item.id !== id);
		return id;
	}
}

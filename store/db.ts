export interface Item {
	id: number | string;
}

export interface SelectOptions {
	where: Record<string, { table: string; value: unknown }>;
	orders: { sortField: string; sortType: 'ASC' | 'DESC' }[];
	conditions: boolean;
	join: { table: string; on: { field: string }; alias?: string }[];
}

export abstract class DBMethods {
	abstract query<T>(query: string, params?: unknown[]): Promise<T[]>;
	abstract list<T>(table: string): Promise<T[] | null>;
	abstract get<T>(table: string, options: Partial<SelectOptions>): Promise<T[]>;
	abstract upsert<T extends Item>(table: string, data: T): Promise<T>;
	abstract remove<T>(table: string, id: Item['id']): Promise<T[]>;
}

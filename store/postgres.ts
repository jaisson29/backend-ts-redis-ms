import { Pool, PoolClient, QueryResult } from 'pg';
import { PG_CONFIG } from '../config';
import logger from '../api/components/logger';

interface Item {
	id: number | string;
}

export class Store {
	private pool: Pool;

	constructor(private schema: string) {
		this.pool = new Pool(PG_CONFIG);
		this.checkConnection();
		this.setupErrorHandling();
	}

	private setupErrorHandling() {
		this.pool.on('error', (err: Error) => {
			logger.error('Unexpected error on idle client', err);
			this.reconnect();
		});
	}

	private async checkConnection() {
		try {
			const client = await this.pool.connect();
			await client.query('SET search_path TO back_redis_ts, public');
			client.release();
			logger.info('Database connection successful');
		} catch (error) {
			logger.error('Database connection failed', error);
			throw new Error('Unable to connect to the database');
		}
	}

	private async reconnect() {
		console.log('Attempting to reconnect to the database...');
		try {
			await this.pool.end();
			this.pool = new Pool(PG_CONFIG);
			await this.checkConnection();
			this.setupErrorHandling();
			logger.info('Reconnected to the database successfully');
		} catch (error) {
			logger.error(error, 'Reconnection attempt failed');
			setTimeout(() => this.reconnect(), 5000);
		}
	}

	private async ensureConnected() {
		try {
			const client = await this.pool.connect();
			client.release();
		} catch (error) {
			logger.error(error, 'Error trying to connect');
			await this.reconnect();
		}
	}

	private applySchema(table: string): string {
		return `${this.schema}.${table}`;
	}

	public async query<T>(query: string, params?: unknown[]): Promise<T[]> {
		await this.ensureConnected();
		const client = await this.pool.connect();
		try {
			logger.debug(query, params);
			const res: QueryResult = await client.query(query, params);
			return res.rows as T[];
		} finally {
			client.release();
		}
	}

	public async list<T>(table: string): Promise<T[] | null> {
		const queryText = `SELECT * FROM ${this.applySchema(table)}`;
		const rows = await this.query<T>(queryText);
		return rows.length > 0 ? rows : null;
	}

	public async getFiltered<T>(
		table: string,
		filters: Record<string, { table: string; value: unknown }> = {},
		condition: boolean = true,
		joinTables: { table: string; on: { field: string }; alias?: string }[] = [],
	): Promise<T[]> {
		const baseTableAlias = 'b';

		const joinClauses = joinTables
			.map((join, index) => {
				const alias = join.alias ?? `j${index + 1}`;
				return `JOIN ${this.applySchema(join.table)} ${alias} ON b."${join.on.field}" = ${alias}."id"`;
			})
			.join(' ');

		const fromClause = `${this.applySchema(table)} ${baseTableAlias}`;

		const whereClauses = Object.keys(filters)
			.map((column, index) => {
				const tableName = filters[column].table;
				const tableAlias =
					tableName === table ? baseTableAlias : joinTables.find((join) => join.table === table)?.alias ?? table;
				return `${tableAlias}."${column}" = $${index + 1}`;
			})
			.join(condition ? ' AND ' : ' OR ');

		const queryText = `SELECT * FROM ${fromClause} ${joinClauses} ${whereClauses ? 'WHERE ' + whereClauses : ''}`;

		const rows = await this.query<T>(
			queryText,
			Object.values(filters).map((val) => val.value),
		);
		return rows.length > 0 ? rows : [];
	}

	public async get<T>(
		table: string,
		id: Item['id'],
		joinTables: { table: string; on: string; alias?: string }[] = [],
	): Promise<T | null> {
		const baseTableAlias = 'b';

		const joinClauses = joinTables
			.map((join, index) => {
				const alias = join.alias ?? `j${index}`;
				return `JOIN ${this.applySchema(join.table)} ${alias} ON ${alias}.${join.on}`;
			})
			.join(' ');

		const queryText = `SELECT * FROM ${this.applySchema(
			table,
		)} ${baseTableAlias} ${joinClauses} WHERE ${baseTableAlias}.id = $1`;

		const rows = await this.query<T>(queryText, [id]);
		return rows.length > 0 ? rows[0] : null;
	}

	public async upsert<T extends Item>(table: string, data: T): Promise<T> {
		return this.transaction(async (client: PoolClient) => {
			const existing = data.id ? await this.get<T>(table, data.id) : null;
			let queryText: string;
			let queryParams: unknown[];

			if (existing) {
				const { id, ...updateData } = data;
				const keys = Object.keys(updateData);
				const setteos = keys.map((key, index) => `${this.applySchema(key)} = $${index + 1}`).join(', ');
				queryText = `UPDATE ${this.applySchema(table)} SET ${setteos} WHERE id = $${keys.length + 1} RETURNING *`;
				queryParams = [...Object.values(updateData), id];
			} else {
				const { id, ...insertData } = data;
				const inserts = Object.keys(insertData)
					.map((key: string) => `"${key}"`)
					.join(', ');
				const valuesTemplate = Object.keys(insertData)
					.map((_, index) => `$${index + 1}`)
					.join(', ');
				queryText = `INSERT INTO ${this.applySchema(table)} (${inserts}) VALUES (${valuesTemplate}) RETURNING *`;
				queryParams = Object.values(insertData);
			}

			const res = await client.query(queryText, queryParams);
			if (res.rows.length > 0) {
				return res.rows[0] as T;
			}
			throw new Error('Operation failed');
		});
	}

	public async remove<T>(table: string, id: Item['id']): Promise<Item['id']> {
		return this.transaction(async (client: PoolClient) => {
			const existing = await this.get<T>(table, id);
			if (!existing) {
				throw new Error('Item not found');
			}
			const queryText = `DELETE FROM ${this.applySchema(table)} WHERE id = $1`;
			await client.query(queryText, [id]);
			return id;
		});
	}

	public async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
		await this.ensureConnected();
		const client = await this.pool.connect();
		try {
			await client.query('BEGIN');
			const result = await callback(client);
			await client.query('COMMIT');
			return result;
		} catch (error) {
			await client.query('ROLLBACK');
			throw error;
		} finally {
			client.release();
		}
	}
}

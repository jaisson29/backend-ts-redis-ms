import axios, { AxiosInstance } from 'axios';
import { DBMethods, Item, SelectOptions } from './db';
import logger from '../api/components/logger';

export class Store implements DBMethods {
	private static instance: Store;
	private axiosInstance: AxiosInstance;

	private constructor(private host: string, private port: number) {
		this.axiosInstance = axios.create({
			baseURL: `http://${this.host}:${this.port}`,
		});
	}
	public static getInstance(host: string, port: number): Store {
		if (!Store.instance) {
			Store.instance = new Store(host, port);
		}
		return Store.instance;
	}

	public getAxiosInstance(): AxiosInstance {
		return this.axiosInstance;
	}

	async query<T>(query: string, params?: unknown[]): Promise<T[]> {
		const response = await this.axiosInstance.post('/', { query: query, params: params });
		return response.data;
	}
	async list<T>(table: string): Promise<T[] | null> {
		const response = await this.axiosInstance.get(`/${table}`);
		return response.data;
	}
	async get<T>(table: string, options: Partial<SelectOptions>): Promise<T[]> {
		logger.debug(options);
		const reponse = await this.axiosInstance.post(`/get/${table}`, { options: options });
		return reponse.data;
	}
	async upsert<T extends Item>(table: string, data: T): Promise<T> {
		const response = await this.axiosInstance.post(`/${table}`, data);
		return response.data;
	}
	async remove<T>(table: string, id: string | number): Promise<T[]> {
		const response = await this.axiosInstance.delete(`/${table}/${id}`);
		return response.data;
	}
}

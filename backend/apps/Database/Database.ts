import { MongoClient } from 'mongodb';
import { env } from '../../Config/env';

export class DatabaseConnection {
    private static url: string;
    private static client: MongoClient;

    constructor() {}

    static getMongoClient(): MongoClient {
        if (!this.client) {
            this.url = env.mongoUri;
            this.client = new MongoClient(this.url);
        }
        return this.client;
    }
}

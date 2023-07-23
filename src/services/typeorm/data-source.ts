import dotenv from 'dotenv';
dotenv.config();
import "reflect-metadata"
import { DataSource } from "typeorm"
import { Author } from "./entity/Author"
import { Quote } from "./entity/Quote"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [Author, Quote],
    migrations: [],
    subscribers: [],
})

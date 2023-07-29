// sprav basic Express server s jednym http get Hello world
// napoj TypeORM kniznicu na hocijaku DB co chces, a sprav 2 tabulky, authors a quotes
// vytvor 2 endpointy, jeden pre get latest quotes, druhy HTTP POST pre pridanie noveho quote

import express, { Express } from 'express';
import dotenv from 'dotenv';
import 'reflect-metadata';
import { AppDataSource } from '../src/services/typeorm/data-source';
import { router } from './routes/router';
import { graphqlRouter } from './routes/graphqlRouter';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use('/', router);
app.use('/graphql', graphqlRouter);

async function main() {
    try {
        await AppDataSource.initialize().then (() => {
            console.log('Database connection established');
        });
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        await AppDataSource.close().then(() => {
            console.log('Database connection closed');
        });
        console.log(error);
    }
}

main();

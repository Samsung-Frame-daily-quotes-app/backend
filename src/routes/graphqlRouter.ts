import express, { Express } from 'express';
import "reflect-metadata"
import { graphqlHTTP } from 'express-graphql'
import { schema } from '../services/schema/schema';

export const graphqlRouter: Express = express();

graphqlRouter.use('/', graphqlHTTP({
    schema: schema,
    graphiql: true,
}));
    

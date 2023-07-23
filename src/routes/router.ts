import express, { Express, Request, Response } from 'express';
import "reflect-metadata"
import { AppDataSource } from '../services/typeorm/data-source';
import { Author } from '../services/typeorm/entity/Author';
import { Quote } from '../services/typeorm/entity/Quote';
import { saveQuote } from '../helper/helper.Quote';

export const router: Express = express();

router.use(express.json());

router.get('/', async (_, res: Response) => {
    const queryQuote = await AppDataSource.getRepository(Quote).find( {
        order: {
            generatedAt: "DESC"
        },
        take: 1
    });
    if (queryQuote === undefined || queryQuote === null) {
        res.status(404).send('Not found');
        console.log('No quotes found');
    } else {
        res.status(200).send(queryQuote);
        console.log('Latest quote sent');
    }
});

router.post('/', async (req: Request, res: Response) => {
    const author: string = req.body.author;
    const quote: string  = req.body.quote;

    if (typeof author !== 'string' || typeof quote !== 'string') {
        res.status(400).send('Bad request');
        return;
    }
    try {
        const queryAuthor = await AppDataSource.getRepository(Author).findOneBy({ name: author });
        if (queryAuthor === undefined || queryAuthor === null) {
            const newAuthor: Author = new Author();
            newAuthor.name = author;
            const authorRepository = AppDataSource.getRepository(Author);
            await authorRepository.save(newAuthor);
            const newQuote = await saveQuote(quote, newAuthor);
            if (newQuote != null) {
                newAuthor.quotes = [newQuote];
                await authorRepository.save(newAuthor);
                console.log(`Quote: "${quote}" has been saved and author ${author} has been created`);
            }
        } else {
            const newQuote = await saveQuote(quote, queryAuthor);
            if (newQuote != null) {
                queryAuthor.quotes.push(newQuote);
                const authorRepository = AppDataSource.getRepository(Author);
                await authorRepository.save(queryAuthor);
                console.log(`Quote: "${quote}" has been saved and author ${author} has been updated`);
            }
        }
        const queryQuote = await AppDataSource.getRepository(Quote).findOneBy({ content: quote });
        if ((queryQuote === undefined || queryQuote === null) && queryAuthor != null) {
            await saveQuote(quote, queryAuthor);
            console.log(`Quote: "${quote}" has been saved`);
        } else {
            console.log(`Quote "${quote}" already exists`);
        }
    } catch (error) {
        console.log(error);
    }
});

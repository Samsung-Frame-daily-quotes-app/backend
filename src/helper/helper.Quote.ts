import "reflect-metadata"
import { AppDataSource } from '../services/typeorm/data-source';
import { Author } from '../services/typeorm/entity/Author';
import { Quote } from '../services/typeorm/entity/Quote';

export async function saveQuote(quote: string, queryAuthor: Author) {
    try {
        const newQuote: Quote = new Quote();
        newQuote.content = quote;
        newQuote.generatedAt = new Date();
        newQuote.author = queryAuthor;
        const quoteRepository = AppDataSource.getRepository(Quote);
        await quoteRepository.save(newQuote);
        return newQuote;
    } catch (error) {
        console.log(error);
        return null;
    }
}
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
        await AppDataSource.getRepository(Quote).save(newQuote);
        await AppDataSource.getRepository(Author).save(queryAuthor);
        return newQuote;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function saveAuthor(author: string) {
    try {
        const newAuthor: Author = new Author();
        newAuthor.name = author;
        newAuthor.generatedAt = new Date();
        await AppDataSource.getRepository(Author).save(newAuthor);
        return newAuthor;
    } catch (error) {
        console.log(error);
        return null;
    }
}

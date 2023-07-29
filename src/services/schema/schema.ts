import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLSchema } from "graphql";
import { AppDataSource } from "../typeorm/data-source";
import { Author } from "../typeorm/entity/Author";
import { Quote } from "../typeorm/entity/Quote";
import { saveQuote, saveAuthor } from "../../helper/helperFunctions";

const QuoteType: GraphQLObjectType = new GraphQLObjectType({
    name: 'Quote',
    fields: () => ({
        id: { type: GraphQLString },
        content: { type: GraphQLString },
        author: { type: AuthorType },
        generatedAt: { type: GraphQLString },
    })
});

const AuthorType: GraphQLObjectType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        quotes: { type: new GraphQLList(QuoteType) },
        generatedAt: { type: GraphQLString },
    })
});

const RootQuery: GraphQLObjectType = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        getLatestQuote: {
            type: QuoteType,
            args: {},
            async resolve() {
                const queryQuote = await AppDataSource.getRepository(Quote).find({
                    relations: ['author'],
                    order: {
                        generatedAt: 'DESC'
                    },
                    take: 1,
                });
                if (queryQuote.length === 0 || queryQuote[0] === undefined) {
                    return ('No quotes found');
                } else {
                    const quote: Quote = queryQuote[0];
                    return {
                        id: quote.id,
                        content: quote.content,
                        author : {
                            id: quote.author.id,
                            name: quote.author.name,
                            quotes: quote.author.quotes,
                            generatedAt: quote.author.generatedAt,
                        },
                        generatedAt: quote.generatedAt,
                    };
                }
            }
        }
    }
});

const rootMutation: GraphQLObjectType = new GraphQLObjectType({
    name: 'RootMutationType',
    fields: {
        addQuote: {
            type: QuoteType,
            args: { 
                author: { type: GraphQLString },
                quote: { type: GraphQLString }, 
            },
            async resolve(_, { author, quote } ) {
                if (typeof author !== 'string' || typeof quote !== 'string') {
                    return ('Bad request');
                }
                var newQuote: Quote | null = null;
                const queryAuthor = await AppDataSource.getRepository(Author).findOneBy({ name: author });
                if (queryAuthor === undefined || queryAuthor === null) {
                    const newAuthor: Author | null = await saveAuthor(author);
                    if (newAuthor !== null)
                        newQuote = await saveQuote(quote, newAuthor);
                    return newQuote !== null ? {
                        id: newQuote.id,
                        content: newQuote.content,
                        author : {
                            id: newQuote.author.id,
                            name: newQuote.author.name,
                            quotes: newQuote.author.quotes,
                            generatedAt: newQuote.author.generatedAt,
                        },
                        generatedAt: newQuote.generatedAt,
                    } : {
                        id: '',
                        name: '',
                        quotes: [],
                        generatedAt: '',
                    };
                } else {
                    newQuote = await saveQuote(quote, queryAuthor);
                    return newQuote !== null ? {
                        id: newQuote.id,
                        content: newQuote.content,
                        author : {
                            id: newQuote.author.id,
                            name: newQuote.author.name,
                            quotes: newQuote.author.quotes,
                            generatedAt: newQuote.author.generatedAt,
                        },
                        generatedAt: newQuote.generatedAt,
                    } : {
                        id: '',
                        name: '',
                        quotes: [],
                        generatedAt: '',
                    };
                }
            }
        }
    }
});

export const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: rootMutation,
});

import 'reflect-metadata';
import { AppDataSource } from './typeorm/data-source';
import { Author } from './typeorm/entity/Author';
import { saveQuote, saveAuthor } from '../helper/helperFunctions';
import dotenv from 'dotenv';
import { GatewayIntentBits, Client, ChannelType } from 'discord.js';
dotenv.config();

export async function handleQuoteRequest(author: string, quote: string): Promise<void> {
  try {
      const queryAuthor = await AppDataSource.getRepository(Author).findOneBy({ name: author });
      if (queryAuthor === undefined || queryAuthor === null) {
          const newAuthor: Author | null = await saveAuthor(author);
          if (newAuthor !== null) await saveQuote(quote, newAuthor);
          console.log(`Quote: "${quote}" has been saved and author ${author} has been created.`);
      } else {
          await saveQuote(quote, queryAuthor);
          console.log(`Quote: "${quote}" by ${author} has been saved.`);
      }
  } catch (error) {
      console.log(error);
  }
}

export function initializeDiscordBot() {
  const discordClient: Client = new Client({
    intents: [
      GatewayIntentBits.Guilds, 
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

  discordClient.login(process.env.DISCORD_BOT_TOKEN);

  discordClient.once('ready', () => {
    console.log(`Logged in as ${discordClient.user?.tag}!`);
  });

  discordClient.on('messageCreate', async (message) => {
    if (message.guild && message.channel.type ===  ChannelType.GuildText && message.channel.id === process.env.DISCORD_CHANNEL_ID) {
      try {
        await handleQuoteRequest(message.author.username, message.content);
        console.log(`author: ${message.author.username}, content: ${message.content}`);
      } catch (error) {
        console.error('Error inserting message into database:', error);
      }
    }
  });
}
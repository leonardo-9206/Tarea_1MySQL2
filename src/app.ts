import { Server } from './server.ts';
import routes from './routes/index.ts';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const port = Number(process.env.PORT) || 3000;

function main(): void {
  const server = new Server({ port, routes });
  server.start();
}

main();
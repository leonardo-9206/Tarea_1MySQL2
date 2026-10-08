import express, { Express, Router } from 'express';
import cors from 'cors';

type ServerOptions = {
  port: number;
  routes: Router;
};

export class Server {
  private readonly port: number;
  private readonly app: Express;
  private readonly routes: Router;

  constructor(options: ServerOptions) {
    this.app = express();
    this.port = options.port;
    this.routes = options.routes;
  }

  public start = (): void => {
    // Enable CORS middleware
    this.app.use(cors());

    // Enable JSON parsing for incoming requests
    this.app.use(express.json());

    // Mount API routes under /api/v1
    this.app.use('/api/v1', this.routes);

    // Start server listener
    this.app.listen(this.port, () => {
      console.log(`MySQL2 TypeScript Server running at http://localhost:${this.port}`);
    });
  };
}
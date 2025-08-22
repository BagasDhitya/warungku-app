import express, { Application } from "express";
import dotenv from "dotenv";

dotenv.config();

class App {
    private app: Application;

    constructor() {
        this.app = express();

        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.app.use(express.json());
    }

    public start() {
        const PORT = process.env.APP_PORT as string || "3000";
        this.app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    }
}

const app = new App();
app.start();

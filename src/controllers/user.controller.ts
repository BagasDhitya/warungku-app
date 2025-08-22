import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { getCache, setCache } from "../helpers/cacheConfig";
import logger, { fileLogger, generateHtmlReport } from "../helpers/logger";

export class UserController {
    userService: UserService;

    constructor() {
        this.userService = new UserService();
        this.getAll = this.getAll.bind(this);
        this.getById = this.getById.bind(this);
        this.create = this.create.bind(this);
    }

    public async getAll(req: Request, res: Response) {
        const cacheKey = "users:all";

        try {
            const cachedData = await getCache(cacheKey);

            if (cachedData) {
                console.log(`[CACHE HIT] Returning data from cache for key: ${cacheKey}`);
                return res.json({
                    source: "cache",
                    data: cachedData,
                    message: "Successfully retrieved data from cache"
                });
            }

            console.log(`[CACHE MISS] Fetching data from database for key: ${cacheKey}`);

            const response = await this.userService.getAll();

            try {
                await setCache(cacheKey, response, 60);
                console.log(`[CACHE SET] Data cached for key: ${cacheKey}`);
            } catch (cacheErr) {
                console.error(`[CACHE ERROR] Failed to set cache for key ${cacheKey}:`, cacheErr);
            }

            res.json({
                source: "database",
                data: response,
                message: "Successfully retrieved data from database"
            });

        } catch (error) {
            console.error("[ERROR] Failed to get users:", error);
            res.status(500).send({
                message: "Internal server error",
                error: (error as Error).message
            });
        }
    }

    public async getById(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const response = await this.userService.getById(Number(id));

            res.json({
                source: "database",
                data: response,
                message: `Successfully retrieved user with id ${id}`
            });
        } catch (error) {
            console.error(`[ERROR] Failed to get user id ${id}:`, error);
            res.status(500).send({
                message: "Internal server error",
                error: (error as Error).message
            });
        }
    }

    public async create(req: Request, res: Response) {
        try {
            const { username, email, password } = req.body;
            const response = await this.userService.create(username, email, password);

            // FS logger
            fileLogger(`Created user : ${response.username} - ${response.email}`);

            // Winston log
            logger.info(`New user created`, { id: response.id_user, email: response.email });

            // Generate HTML report otomatis untuk setiap log
            generateHtmlReport("app.log");      // report untuk winston
            generateHtmlReport("manual.log");   // report untuk fileLogger

            res.status(201).json(response);
        } catch (error) {
            res.status(500).send({
                message: 'Internal server error'
            });
        }
    }
}

import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { memcached } from "../cache";

export class UserController {
    userService: UserService

    constructor() {
        this.userService = new UserService()

        this.getAll = this.getAll.bind(this)
        this.getById = this.getById.bind(this)
    }

    public async getAll(req: Request, res: Response) {
        try {
            const cacheKey = "users:all";

            // check cache
            memcached.get(cacheKey, async (err, data) => {
                if (err) {
                    console.error('Memcached error:', err);
                }

                if (data) {
                    console.log('Serve from cache');
                    return res.json({
                        source: 'cache',        // menandakan data dari cache
                        data: JSON.parse(data), // isi data dari cache
                        message: 'Successfully retrieved data from cache'
                    });
                }

                // jika cache kosong, ambil dari DB
                const response = await this.userService.getAll();

                // simpan ke cache
                memcached.set(cacheKey, JSON.stringify(response), 60, (err) => {
                    if (err) console.error('Cache set error:', err);
                });

                res.json({
                    source: 'database',          // menandakan data dari DB
                    data: response,
                    message: 'Successfully retrieved data from database'
                });
            });

        } catch (error) {
            res.status(500).send({
                message: 'Internal server error',
                error: (error as Error).message
            });
        }
    }


    public async getById(req: Request, res: Response) {
        try {
            const { id } = req.params
            const response = await this.userService.getById(Number(id))
            res.json(response)
        } catch (error) {
            res.status(500).send({
                message: 'Internal server error'
            })
        }
    }
}
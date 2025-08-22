import { Request, Response } from "express";
import { UserService } from "../services/user.service";

export class UserController {
    userService: UserService

    constructor() {
        this.userService = new UserService()

        this.getAll = this.getAll.bind(this)
        this.getById = this.getById.bind(this)
    }

    public async getAll(req: Request, res: Response) {
        try {
            const response = await this.userService.getAll()
            res.json(response)
        } catch (error) {
            res.status(500).send({
                message: 'Internal server error'
            })
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
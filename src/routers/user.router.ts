import { UserController } from "../controllers/user.controller";
import { Router } from "express";

const userController = new UserController()
const router = Router()

router.get('/users', userController.getAll)
router.get('/users/:id', userController.getById)

export default router
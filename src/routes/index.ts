// src/routes/index.ts
import { UserController } from "../controllers/userController"

const userController = new UserController()

export default userController.router

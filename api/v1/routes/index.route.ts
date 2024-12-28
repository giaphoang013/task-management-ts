import { Express } from "express"
import {taskRoutes} from "./task.route"
import { userRoutes } from "./user.route"
import * as authMiddlewares from "../middlewares/auth.middleware"
const mainv1Routes = (app: Express): void => {
    const version = "/api/v1"
    app.use(version + "/tasks", authMiddlewares.requireAuth,taskRoutes)
    app.use(`${version}/users`, userRoutes) 
}

export default mainv1Routes;
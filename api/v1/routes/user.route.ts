import  {Router} from 'express';
const router: Router = Router();

import * as controller from "../controller/user.controller"
import * as authMiddlewares from "../middlewares/auth.middleware"

router.post("/register", controller.register);

router.post("/login", controller.login);

router.get("/detail", authMiddlewares.requireAuth, controller.detail);

export const userRoutes: Router = router;
import express, { Express } from "express";
import dotenv from "dotenv";
import * as database from "./config/database";
import mainv1Routes from "./api/v1/routes/index.route";
import bodyParser from "body-parser";
import cors from "cors";

dotenv.config();

database.connect();

const app: Express = express();
const port: number | string = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
mainv1Routes(app);


app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
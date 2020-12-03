import express, { Application } from "express";
import { compiler } from "./middlewares/compileData";

const app: Application = express();

import appRoute from "./routes";
// Settings
app.set("port", 3000);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compiler);
// Route
app.use(appRoute);
export default app;

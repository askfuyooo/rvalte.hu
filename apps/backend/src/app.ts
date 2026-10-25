import express from "express";

import apiRouter from "./routes/api.js";
import apiNotFound from "./middleware/apiNotFound.js";
import notFound from "./middleware/notFound.js";

const app = express();

app.use(express.json());

app.use("/api", apiRouter);
app.use("/api", apiNotFound);

app.use(notFound);

export default app;

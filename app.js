const { join } = require("node:path");
const express = require("express");
const morgan = require("morgan");
const session = require("express-session");
const dotenv = require("dotenv");
const { connectToDatabase } = require("./database/database-connection");
const { AppError } = require("./utils/app-error");
const { addAdmin } = require("./utils/add-admin");
const appRouter = require("./routes/app-route");

const dotenvConfig = dotenv.config({ path: join(__dirname, "./config.env") });

if (!!dotenvConfig.error) {
  console.error("[-] dotenv config", dotenvConfig.error.message);
  console.info("[i] process terminated.");

  process.exit(1);
}

const port = process.env.PORT;
const host = process.env.HOST;

const app = express();

connectToDatabase().then(() => addAdmin());

app.use(morgan("dev"));

app.set("view engine", "ejs");
app.set("views", join(__dirname, "./views"));

app.use(express.static(join(__dirname, "./public")));

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 },
  })
);

app.use("/", appRouter);

app.all("*", (req, res, next) => {
  const { method, originalUrl } = req;
  next(new AppError(404, `can't find ${method} ${originalUrl}`));
});

app.use((err, req, res, next) => {
  console.log(err);
  const { statusCode = 500, status = "error", message = "internal app error" } = err;

  console.log(err);

  res.status(statusCode).json({ status, message });
});

app.listen(port, host, () => {
  console.info(`[i] app is running on ${host}:${port} ...`);
});

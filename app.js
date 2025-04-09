const path = require("node:path");
const express = require("express");
const morgan = require("morgan");
const { connect } = require("mongoose");
const session = require("express-session");
const { AppError } = require("./utils/app-error");
const appRouter = require("./routes/app-routes");

const host = "127.0.0.1";
const port = 8000;

const app = express();

connect("mongodb://localhost:27017/user-management")
  .then(() => console.log("database is connected"))
  .catch(() => {
    console.log("database is disconnected");
    process.exit(1);
  });

app.use(morgan("dev"));
app.use(express.json({ limit: "10kb" }));

app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "./public")));

app.use(
  session({
    secret: "user-super-secure-session-secret",
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
  const { statusCode = 500, status = "error", message = "internal server error" } = err;

  res.status(statusCode).json({ status, message });
});

app.listen(port, host, () => {
  console.log(`you are listening to ${host}: ${port}`);
});

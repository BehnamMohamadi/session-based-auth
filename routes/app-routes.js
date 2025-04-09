const router = require("express").Router();

const apiRouter = require("./api-routes");
const viewRouter = require("./view-routes");

router.use("/", viewRouter);
router.use("/api", apiRouter);

module.exports = router;

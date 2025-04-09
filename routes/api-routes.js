const router = require("express").Router();

const authRoute = require("./auth-routes");
const adminRoute = require("./admin-routes");

router.use("/auth", authRoute);
router.use("/admin", adminRoute);

module.exports = router;

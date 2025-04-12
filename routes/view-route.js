const router = require("express").Router();
const {
  renderLoginPage,
  renderProfilePage,
  renderAdminLoginPage,
  renderAdminProfilePage,
  renderSignUpPage,
} = require("../controller/view-controller");

const { protect } = require("../controller/auth-controller");
const { asyncHandler } = require("../utils/async-handler");

router.get("/login", renderLoginPage);
router.get("/profile", asyncHandler(protect), renderProfilePage);

router.get("/admin/login", renderAdminLoginPage);
router.get("/admin/profile/:username", renderAdminProfilePage);

router.get("/signup", renderSignUpPage);

module.exports = router;
